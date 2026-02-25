const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uid",
    version: "30.0.0",
    author: "Milon",
    countDown: 2,
    role: 0,
    category: "utility",
    description: "Sends persistent UID card with profile pic",
    guide: "{pn} or {pn} @mention"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID, mentions } = event;
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    const targetID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID;
    
    // প্রতিবার ইউনিক নাম দেওয়ার জন্য টাইমস্ট্যাম্প যোগ করা হয়েছে
    const imgPath = path.join(cacheDir, `u_${targetID}_${Date.now()}.png`);
    const filePath = path.join(cacheDir, `r_${targetID}_${Date.now()}.txt`);

    try {
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID]?.name || "Facebook User";

      // ১. রিপোর্ট ফাইল তৈরি
      const reportData = `------------------------------------\n      OFFICIAL UID DATA REPORT\n------------------------------------\nFULL NAME   : ${userName}\nUSER ID     : ${targetID}\nGENERATED AT: ${new Date().toUTCString()}\nSTATUS      : VERIFIED\nAUTHOR      : MILON\n------------------------------------`;
      fs.writeFileSync(filePath, reportData);

      // ২. ইমেজ জেনারেশন
      const avatar = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const text1 = `USER: ${userName.toUpperCase()}`;
      const text2 = `🆔 UID: ${targetID}`;
      const text3 = `🛠️ AUTHOR: MILON`;

      // এপিআই লিঙ্কে '&cacheBust=${Date.now()}' যোগ করা হয়েছে যাতে প্রতিবার নতুন ছবি আসে
      const apiUrl = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(avatar)}&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&text3=${encodeURIComponent(text3)}&avatar=${encodeURIComponent(avatar)}&color=800080&cacheBust=${Date.now()}`;

      const response = await axios({
        method: 'get',
        url: apiUrl,
        responseType: 'arraybuffer',
        timeout: 25000 // টাইমআউট আরও বাড়ানো হয়েছে
      });

      fs.writeFileSync(imgPath, Buffer.from(response.data));

      // ৩. মেসেজ পাঠানো
      return api.sendMessage({
        body: `${targetID}`,
        attachment: [
          fs.createReadStream(imgPath),
          fs.createReadStream(filePath)
        ]
      }, threadID, (err) => {
        if (err) console.error(err);
        // পাঠানোর পর ফাইল ডিলিট করা
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (error) {
      console.error("UID ERROR:", error);
      const fallbackMsg = {
        body: `${targetID}\n\n[⚠️ Image Engine Busy - Please try again]`,
        attachment: fs.existsSync(filePath) ? [fs.createReadStream(filePath)] : []
      };
      return api.sendMessage(fallbackMsg, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);
    }
  }
};
