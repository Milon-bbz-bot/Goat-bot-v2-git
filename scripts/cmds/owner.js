const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "2.0.1",
    author: "Milon Hasan",
    countDown: 5,
    role: 0,
    description: "Owner & Bot Info",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {

    const imageUrl = "https://i.imgur.com/dJD7ren.jpeg";

    const uptime = process.uptime();
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((uptime % (60 * 60)) / 60);

    const infoMessage = `💠 𝗠𝗜𝗟𝗢𝗡 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 💠
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
» 🤖 𝗕𝗼𝘁: 𝗠𝗜𝗟𝗢𝗡 𝗕𝗢𝗧
» ☄️ 𝗣𝗿𝗲𝗳𝗶𝘅: 『 . 』
» 🧠 𝗖𝗺𝗱𝘀: 𝟭𝟳𝟯 𝗨𝗻𝗶𝘁𝘀
» ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲: ${days}𝗱 ${hours}𝗵 ${mins}𝗺

◈──────── OWNER ────────◈
» 👤 𝗡𝗮𝗺𝗲: 𝗠𝗶𝗹𝗼𝗻 𝗛𝗮𝘀𝗮𝗻
» 🎂 𝗔𝗴𝗲: 𝟭𝟳+ 𝗬𝗲𝗮𝗿𝘀
» 💬 𝗦𝘁𝗮𝘁𝘂𝘀: ꜱɪʟᴇɴᴄᴇ ɪꜱ ᴍʏ ᴀᴛᴛɪᴛᴜᴅᴇ
» 🔗 𝗦𝗼𝗰𝗶𝗮𝗹: facebook.com/share/17uGq8qVZ9/
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`;

    try {

      const cacheDir = path.join(__dirname, "cache");
      const cachePath = path.join(cacheDir, "owner_info.jpg");

      // ✅ recursive folder create
      fs.ensureDirSync(cacheDir);

      // ✅ image download
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(cachePath, response.data);

      return api.sendMessage(
        {
          body: infoMessage,
          attachment: fs.createReadStream(cachePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        },
        event.messageID
      );

    } catch (error) {
      console.error("Owner info error:", error);
      return api.sendMessage(infoMessage, event.threadID, event.messageID);
    }
  }
};
