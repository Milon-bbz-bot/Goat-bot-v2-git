const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    version: "2.3.8",
    role: 0,
    credits: "Mahabub & Milon",
    description: "Chat with a Simsimi-like bot (No Prefix + Mention Fixed)",
    category: "fun",
    guide: "{pn} [message]"
  },

  onChat: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body || senderID == api.getCurrentUserID()) return;

    const input = body.toLowerCase().trim();

    if (input.startsWith("bot")) {
      const query = body.slice(3).trim(); 

      try {
        const { data } = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
        const apiUrl = data.sim;
        const apiUrl2 = data.api2;
        const userName = (await usersData.getName(senderID)) || "User";

        if (!query) {
          const greetings = [
            "𝗵𝗲 𝗯𝗼𝘁 𝗯𝗼𝘁 𝗰𝗵𝗶𝗹𝗹 𝗯𝗿𝗼!", "I love you 💝", "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻", 
            "আমি এখন বস মিলন এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻", "আমাকে না ডেকে আমার বস মিলন কে একটা জি এফ দাও-😽🫶🌺",
            "ঝাং থুমালে আইলাপিউ পেপি-💝😽", "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈", "জান তোমার নানি রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
            "চুনা ও চুনা আমার বস মিলন'এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭", "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻",
            "জান হাঙ্গা করবা-🙊😝🌻", "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼", "আমার বস মিলন এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶",
            "- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস মিলন এর ইনবক্স চলে যাও-🙊🥱👅", "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
            "oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂", "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস মিলন কে দান করেন-🥱🐰🍒",
            "তাকাই আছো কেন চুমু দিবা-🙄🐸😘", "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇", "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧",
            "মেয়ে হলে বস মিলন কে 𝐊𝐈𝐒𝐒 দে 😒", "Bot না জানু বল জানু 😘", "বার বার Disturb করেছিস কোনো😾, আমার বস মিলন এর সাথে ব্যাস্ত আছি😋",
            "হা জানু , এইদিক এ আসো কিস দেই🤭 😘", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", "হা বলো, শুনছি আমি 😏", "চুমু খাওয়ার বয়স টা চকলেট🍫খেয়ে উড়িয়ে দিলো মিলন বস 🥺🤗",
            "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘", "কি গো সোনা আমাকে ডাকছ কেনো", "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱", "হুম জান তোমার অইখানে উম্মাহ😷😘"
          ];
          const rand = greetings[Math.floor(Math.random() * greetings.length)];
          return api.sendMessage({
            body: `「 ${userName} 」\n\n${rand}`,
            mentions: [{ tag: userName, id: senderID }]
          }, threadID, (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                author: senderID
              });
            }
          }, messageID);
        }

        // AI এর উত্তর নেওয়ার অংশ
        const res = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(query)}`);
        let reply = res.data.data.msg;

        if (reply.includes("I cannot understand") || reply.includes("Teach me")) {
           reply = "জানু, এটা তো আমি জানি না। একটু শিখায় দিবা? 🥺";
        }

        let styledText = reply;
        try {
          const font = await axios.get(`${apiUrl2}/bold?text=${encodeURIComponent(reply)}&type=serif`);
          styledText = font.data.data.bolded || reply;
        } catch(e) { console.log("Font Error") }

        return api.sendMessage(styledText, threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              author: senderID
            });
          }
        }, messageID);

      } catch (e) {
        console.error(e);
      }
    }
  },

  onStart: async function ({ api, event }) {
    return api.sendMessage("জানু, আমাকে ডাকতে সরাসরি 'bot' লিখে তোমার কথা বলো। ❤️", event.threadID, event.messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    if (Reply.author !== event.senderID) return;
    const { threadID, messageID, body } = event;

    try {
      const { data } = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const res = await axios.get(`${data.sim}/sim?type=ask&ask=${encodeURIComponent(body)}`);
      let reply = res.data.data.msg;

      if (reply.includes("I cannot understand") || reply.includes("Teach me")) {
        reply = "হুম জানু বলো, শুনছি... 😘";
      }

      api.sendMessage(reply, threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID
          });
        }
      }, messageID);
    } catch (e) {
      console.error(e);
    }
  }
};
