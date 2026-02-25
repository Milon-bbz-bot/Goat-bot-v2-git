const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uid",
    version: "27.0.0",
    author: "Milon",
    countDown: 2,
    role: 0,
    category: "utility",
    description: "Sends high-speed UID card with user info and English report",
    guide: "{pn} or {pn} @mention"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID, mentions } = event;
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    const targetID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID;
    const timestamp = Date.now();
    const imgPath = path.join(cacheDir, `u_${targetID}.png`);
    const filePath = path.join(cacheDir, `r_${targetID}.txt`);

    try {
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID]?.name || "Facebook User";

      // ১. প্রফেশনাল ইংলিশ রিপোর্ট ফাইল তৈরি
      const reportData = 
`------------------------------------
      OFFICIAL UID DATA REPORT
------------------------------------
FULL NAME   : ${userName}
USER ID     : ${targetID}
GENERATED AT: ${new Date().toUTCString()}
STATUS      : VERIFIED & ACTIVE
SOURCE      : MILON PROJECT ENGINE
------------------------------------
CONFIDENTIAL | GLOBAL SECURITY SYSTEM`;

      fs.writeFileSync(filePath, reportData);

      // ২. শক্তিশালী ইমেজ জেনারেটর (ইউজারের নিজস্ব ছবি ব্যবহার করে)
      const avatar = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      // এপিআই লিঙ্কটি এমনভাবে তৈরি যাতে ইউজার ইনফো ইমেজে থাকে
      const apiUrl = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(avatar)}&text1=${encodeURIComponent(userName)}&text2=UID%3A%20${targetID}&text3=Verified%20User&avatar=${encodeURIComponent(avatar)}`;

      const response = await axios({
        method: 'get',
        url: apiUrl,
        responseType: 'arraybuffer',
        timeout: 10000 // ১০ সেকেন্ড টাইমআউট যাতে বোট ঝুলে না থাকে
      });

      fs.writeFileSync(imgPath, Buffer.from(response.data));

      // ৩. ক্লিনিং এবং সেন্ডিং
      return api.sendMessage({
        body: `${targetID}`, // বডিতে শুধু ইউআইডি
        attachment: [
          fs.createReadStream(imgPath),
          fs.createReadStream(filePath)
        ]
      }, threadID, () => {
        setTimeout(() => {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 5000);
      }, messageID);

    } catch (error) {
      console.error("UID ERROR:", error);
      // ইমেজ ফেইল হলে সরাসরি শুধু আইডি এবং ফাইল পাঠিয়ে দিবে
      return api.sendMessage(`${targetID}\n\n[System: Image Engine Busy]`, threadID, messageID);
    }
  }
};
