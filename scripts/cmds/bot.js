const axios = require('axios');

const baseApiUrl = "https://noobs-api.top/dipto/baby";

module.exports = {
  config: {
    name: "bot",
    aliases: [],
    version: "8.2.0",
    author: "Milon |API dip to",
    countDown: 0,
    role: 0,
    description: "Only Bot command with all funny dialogues",
    category: "fun",
    guide: {
      en: "{pn} [message]\n{pn} teach ask - reply"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ").toLowerCase();

    try {
      if (!args[0]) {
        const userName = await usersData.getName(senderID);
        return api.sendMessage({
          body: `「 ${userName} 」\nবলুন আমি "বট" আপনাকে কিভাবে সাহায্য করতে পারি?`,
          mentions: [{ tag: userName, id: senderID }]
        }, threadID, messageID);
      }

      if (args[0] === 'teach') {
        const content = query.replace("teach ", "");
        const [q, a] = content.split(/\s*-\s*/);
        if (!q || !a) return api.sendMessage("⚠️ Format: teach ask - reply", threadID, messageID);
        const re = await axios.get(`${baseApiUrl}?teach=${encodeURIComponent(q)}&reply=${encodeURIComponent(a)}&senderID=${senderID}`);
        return api.sendMessage(`✅ Added: ${re.data.message}`, threadID, messageID);
      }

      const res = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(query)}&senderID=${senderID}&font=1`);
      return api.sendMessage(res.data.reply, threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: senderID
        });
      }, messageID);

    } catch (e) {
      return api.sendMessage("API Busy!", threadID, messageID);
    }
  },

  onReply: async ({ api, event, Reply }) => {
    if (api.getCurrentUserID() == event.senderID) return;
    try {
      const res = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(event.body)}&senderID=${event.senderID}&font=1`);
      api.sendMessage(res.data.reply, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "bot",
          type: "reply",
          messageID: info.messageID,
          author: event.senderID
        });
      }, event.messageID);
    } catch (err) {}
  },

  onChat: async ({ api, event, usersData }) => {
    try {
      const body = event.body ? event.body.toLowerCase() : "";
      
      if (body.startsWith("bot") || body.startsWith("বট")) {
        const textAfterTrigger = body.replace(/^(bot|বট)\s*/, "").trim();
        const userName = await usersData.getName(event.senderID);

        if (!textAfterTrigger) {
          const randomReplies = [
            "𝗵𝗲 𝗯𝗼𝘁 𝗯𝗼𝘁 𝗰𝗵𝗶𝗹𝗹 𝗯𝗿𝗼!", "I love you 💝", "আমি এখন বস মিলন এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏",
            "আমাকে না ডেকে আমার বস মিলন কে একটা জি GF দাও-😽🫶", "জান তোমার নানি রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
            "চুনা ও চুনা আমার বস মিলন'এর হবু বউ রে কেও দেকছো?😪", "জান হাঙ্গা করবা-🙊😝",
            "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤", "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
            "বেশি Bot Bot করলে leave নিবো কিন্তু😒", "তোর বাড়ি কি মাল দিপ গ্রাম😵‍💫",
            "মেয়ে হলে বস মিলন কে 𝐊𝐈𝐒𝐒 দে 😒", "চুমু খাওয়ার বয়স টা চকলেট🍫খেয়ে উড়িয়ে দিলো মিলন বস 🥺🤗",
            "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱", "জান বাল ফালাইবা-🙂🥱🙆‍♂",
            "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇", "দিনশেষে পরের BOW সুন্দর-☹️🤧",
            "সুন্দর মাইয়া মানেই-🥱আমার বস মিলন এর বউ-😽🫶", "হা জানু , এইদিক এ আসো কিস দেই🤭 😘",
            "আরে আমি মজা করার mood এ নাই😒", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘",
            "জান বাল ফালাইবা-🙂🥱🙆‍♂", "আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস মিলন কে দান করেন-🥱🐰🍒",
            "ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧", "অনুমতি দিলে কল দিতাম..!😒",
            "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽"
          ];
          const rand = randomReplies[Math.floor(Math.random() * randomReplies.length)];
          
          return api.sendMessage({
            body: `「 ${userName} 」\n\n${rand}`,
            mentions: [{ tag: userName, id: event.senderID }]
          }, event.threadID, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID
            });
          }, event.messageID);
        }

        const res = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(textAfterTrigger)}&senderID=${event.senderID}&font=1`);
        api.sendMessage(res.data.reply, event.threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "bot",
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        }, event.messageID);
      }
    } catch (err) {}
  }
};
