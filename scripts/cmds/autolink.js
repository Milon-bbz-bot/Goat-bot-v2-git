const fs = require("fs");
const { downloadVideo } = require("sagor-video-downloader");

module.exports = {
  config: {
    name: "autolink",
    version: "1.3.1",
    author: "MOHAMMAD AKASH (Fixed by Milon)",
    countDown: 5,
    role: 0,
    shortDescription: "Auto-download & send videos silently",
    category: "media"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const threadID = event.threadID;
      const messageID = event.messageID;
      const message = event.body || "";

      const links = message.match(/https?:\/\/[^\s]+/g);
      if (!links) return;

      const uniqueLinks = [...new Set(links)];

      api.setMessageReaction("⏳", messageID, () => {}, true);

      let success = 0;
      let failed = 0;

      for (const url of uniqueLinks) {
        try {
          const data = await downloadVideo(url);
          if (!data || !data.filePath) throw new Error("Download failed");

          if (!fs.existsSync(data.filePath)) throw new Error("File missing");

          const sizeMB = fs.statSync(data.filePath).size / 1024 / 1024;

          if (sizeMB > 25) {
            fs.unlinkSync(data.filePath);
            failed++;
            continue;
          }

          await api.sendMessage(
            {
              body:
`📥 ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ
━━━━━━━━━━━━━━━
🎬 ᴛɪᴛʟᴇ: ${data.title || "Video"}
📦 sɪᴢᴇ: ${sizeMB.toFixed(2)} MB
━━━━━━━━━━━━━━━`,
              attachment: fs.createReadStream(data.filePath)
            },
            threadID,
            () => {
              try { fs.unlinkSync(data.filePath); } catch {}
            }
          );

          success++;
        } catch {
          failed++;
        }
      }

      const reaction =
        success > 0 && failed === 0 ? "✅" :
        success > 0 ? "⚠️" : "❌";

      api.setMessageReaction(reaction, messageID, () => {}, true);

    } catch {}
  }
};
