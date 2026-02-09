const axios = require("axios");
const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

let xfont = null;
let yfont = null;
let categoryEmoji = null;

async function loadResources() {
  try {
    const [x, y, c] = await Promise.all([
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/xfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/yfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/category.json")
    ]);
    xfont = x.data;
    yfont = y.data;
    categoryEmoji = c.data;
  } catch (e) {
    console.error("[HELP] Resource load failed");
  }
}

function fontConvert(text, type = "command") {
  const map = type === "category" ? xfont : yfont;
  if (!map) return text;
  return text.split("").map(c => map[c] || c).join("");
}

function getCategoryEmoji(cat) {
  return categoryEmoji?.[cat.toLowerCase()] || "⦿";
}

function roleText(role) {
  if (role === 0) return "👤 User";
  if (role === 1) return "👑 Group Admin";
  if (role === 2) return "🤖 Bot Admin";
  return "Unknown";
}

function findCommand(name) {
  name = name.toLowerCase();
  for (const [, cmd] of commands) {
    const a = cmd.config?.aliases;
    if (cmd.config?.name === name) return cmd;
    if (Array.isArray(a) && a.includes(name)) return cmd;
    if (typeof a === "string" && a === name) return cmd;
  }
  return null;
}

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "2.5",
    author: "Saimx69x | fixed milon",
    role: 0,
    category: "info",
    shortDescription: "Show all commands in one list",
    guide: {
      en: "{pn} or {pn} [command]"
    }
  },

  onStart: async function ({ message, args, event, role }) {
    if (!xfont || !yfont || !categoryEmoji) await loadResources();

    const prefix = getPrefix(event.threadID);
    const input = args.join(" ").trim();

    // Collect all commands and group by category
    const categoriesMap = {};
    for (const [name, cmd] of commands) {
      if (!cmd?.config || cmd.config.role > role) continue;
      const cat = (cmd.config.category || "UNCATEGORIZED").toLowerCase();
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(name);
    }

    /* ───── Single Command Info View ───── */
    if (input) {
      const cmd = findCommand(input);
      if (cmd) {
        const c = cmd.config;
        let usage = "No usage guide";
        if (c.guide) {
          usage = typeof c.guide === "object" ? (c.guide.en || Object.values(c.guide)[0]) : c.guide;
          usage = usage.replace(/{pn}/g, `${prefix}${c.name}`);
        }

        const infoMsg = `⚡️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 ⚡️
━━━━━━━━━━━━━━━━━━
🗡️ 𝗡𝗮𝗺𝗲 » ${c.name}
📝 𝗗𝗲𝘀𝗰 » ${c.longDescription || c.shortDescription || "N/A"}
🧩 𝗨𝘀𝗮𝗴𝗲 » ${usage}
📦 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 » ${c.category.toUpperCase()}
⏱️ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻 » ${c.countDown || 5}s
🔒 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 » ${roleText(c.role)}
✨ 𝗖𝗿𝗲𝗱𝗶𝘁𝘀 » ${c.author || "𝗠𝗶𝗹𝗼𝗻 𝗛𝗮𝘀𝗮𝗻"}`;

        return message.reply(infoMsg);
      }
    }

    /* ───── All Commands List (No Page) ───── */
    let msg = `✨ 𝗠 𝗜 𝗟 𝗢 𝗡 ✦  𝗖 𝗢 𝗠 𝗠 𝗔 𝗡 𝗗 𝗦 ✨\n`;
    msg += `✧･ﾟ: *✧･ﾟ:* ༻ ༺ *:･ﾟ✧*:･ﾟ✧\n\n`;

    const sortedCategories = Object.keys(categoriesMap).sort();

    for (const cat of sortedCategories) {
      const catDisplay = fontConvert(cat.toUpperCase(), "category");
      const emoji = getCategoryEmoji(cat);
      const cmds = categoriesMap[cat].sort().map(n => fontConvert(n)).join(", ");

      msg += `${emoji} ━━━━『 ${catDisplay} 』━━━━ ⦿\n`;
      msg += `│  ${cmds}\n`;
      msg += `✧･ﾟ: *✧･ﾟ:* *:･ﾟ✧*:･ﾟ✧\n\n`;
    }

    const totalCmds = Object.values(categoriesMap).reduce((a, b) => a + b.length, 0);

    msg += `🔰 𝗧𝗶𝗽: 𝗧𝘆𝗽𝗲 ${prefix}𝗵𝗲𝗹𝗽 [𝗰𝗼𝗺𝗺𝗮𝗻𝗱]\n\n`;
    msg += `🗡️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗦𝗬𝗦𝗧𝗘𝗠 🗡️\n𝗧𝗼𝘁𝗮𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 » ${totalCmds}\n𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀 » ${sortedCategories.length}\n👑 Owner: 𝗠𝗶𝗹𝗼𝗻 𝗛𝗮𝘀𝗮𝗻`;

    return message.reply(msg);
  }
};
