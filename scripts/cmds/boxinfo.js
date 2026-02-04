const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "groupinfo",
    aliases: ['boxinfo'],
    version: "1.0",
    author: "Milon",
    countDown: 5,
    role: 0,
    shortDescription: "See Box info",
    longDescription: "গ্রুপের যাবতীয় তথ্য দেখার জন্য",
    category: "box chat",
    guide: {
      en: "{p}groupinfo",
    }
  },

  onStart: async function ({ api, event }) {
    try {
      let threadInfo = await api.getThreadInfo(event.threadID);
      let threadMem = threadInfo.participantIDs.length;
      
      var gendernam = [];
      var gendernu = [];
      var nope = [];

      for (let z in threadInfo.userInfo) {
        var gioitinhone = threadInfo.userInfo[z].gender;
        var nName = threadInfo.userInfo[z].name;
        if (gioitinhone == "MALE") { gendernam.push(z); }
        else if (gioitinhone == "FEMALE") { gendernu.push(z); }
        else { nope.push(nName); }
      }

      var nam = gendernam.length;
      var nu = gendernu.length;
      var listad = '';
      var qtv2 = threadInfo.adminIDs;
      let qtv = qtv2.length;
      let sl = threadInfo.messageCount;
      let icon = threadInfo.emoji || "👍";
      let threadName = threadInfo.threadName || "No Name";
      let id = threadInfo.threadID;

      for (let i = 0; i < qtv2.length; i++) {
        const infu = await api.getUserInfo(qtv2[i].id);
        const name = infu[qtv2[i].id].name;
        listad += '• ' + name + '\n';
      }

      let sex = threadInfo.approvalMode;
      var pd = sex == false ? 'Turned off' : 'Turned on';

      var callback = () => api.sendMessage({
        body: `🔧「 𝐆𝐂 𝐍𝐚𝐦𝐞 」: ${threadName}\n🔧「 𝐆𝐫𝐨𝐮𝐩 𝐈𝐃 」: ${id}\n🔧「 𝐀𝐩𝐩𝐫𝐨𝐯𝐚𝐥 」: ${pd}\n🔧「 𝐄𝐦𝐨𝐣𝐢 」: ${icon}\n🔧「 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 」: 𝐈𝐧𝐜𝐥𝐮𝐝𝐢𝐧𝐠 ${threadMem} 𝐌𝐞𝐦𝐛𝐞𝐫𝐬\n🔧「 𝐍𝐮𝐦𝐛𝐞𝐫 𝐎𝐟 𝐌𝐚𝐥𝐞𝐬 」: ${nam}\n🔧「 𝐍𝐮𝐦𝐛𝐞𝐫 𝐎𝐟 𝐅𝐞𝐦𝐚𝐥𝐞𝐬 」: ${nu}\n🔧「 𝐓𝐨𝐭𝐚𝐥 𝐀𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐬 」: ${qtv}\n「 𝐈𝐧𝐜𝐥𝐮𝐝𝐞 」:\n${listad}\n🔧「 𝐓𝐨𝐭𝐚𝐥 𝐍𝐮𝐦𝐛𝐞𝐫 𝐎𝐟 𝐌𝐞𝐬𝐬𝐚𝐠𝐞𝐬 」: ${sl} msgs.\n\n𝐌𝐚𝐝𝐞 𝐖𝐢𝐭𝐡 ❤️ 𝐁𝐲: Milon Hasan`,
        attachment: fs.createReadStream(__dirname + '/cache/thread.png')
      }, event.threadID, () => {
        if (fs.existsSync(__dirname + '/cache/thread.png')) fs.unlinkSync(__dirname + '/cache/thread.png');
      }, event.messageID);

      // যদি গ্রুপের কোনো ছবি না থাকে তবে শুধু টেক্সট পাঠাবে
      if (!threadInfo.imageSrc) {
        return api.sendMessage(`🔧「 𝐆𝐂 𝐍𝐚𝐦𝐞 」: ${threadName}\n🔧「 𝐆𝐫𝐨𝐮𝐩 𝐈𝐃 」: ${id}\n🔧「 𝐀𝐩𝐩𝐫𝐨𝐯𝐚𝐥 」: ${pd}\n🔧「 𝐄𝐦𝐨𝐣𝐢 」: ${icon}\n🔧「 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 」: 𝐈𝐧𝐜𝐥𝐮𝐝𝐢𝐧𝐠 ${threadMem} 𝐌𝐞𝐦𝐛𝐞𝐫𝐬\n🔧「 𝐍𝐮𝐦𝐛𝐞𝐫 𝐎𝐟 𝐌𝐚𝐥𝐞𝐬 」: ${nam}\n🔧「 𝐍𝐮𝐦𝐛𝐞𝐫 𝐎𝐟 𝐅𝐞𝐦𝐚𝐥𝐞𝐬 」: ${nu}\n\n𝐌𝐚𝐝𝐞 𝐖𝐢𝐭𝐡 ❤️ 𝐁𝐲: Milon Hasan`, event.threadID);
      }

      return request(encodeURI(`${threadInfo.imageSrc}`))
        .pipe(fs.createWriteStream(__dirname + '/cache/thread.png'))
        .on('close', () => callback());

    } catch (error) {
      console.error(error);
      api.sendMessage("তথ্য সংগ্রহ করতে সমস্যা হয়েছে।", event.threadID);
    }
  }
};
