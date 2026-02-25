module.exports = {
config: {
name: "pingall",
aliases: ["tag", "everyone"],
category: "GROUP",
role: 1,
author: "Milon",
countDown: 5,
description: {
en: "Mention all members one by one without any prefix text (Admin Only)"
},
guide: {
en: "{pn} [optional message]"
}
},

onStart: async ({ api, event, threadsData, args, role }) => {
const { threadID, messageID, senderID } = event;
const extraText = args.join(" ");

try {
const threadData = await threadsData.get(threadID);

// Admin Check (Bot Admin or Group Admin)
const isAdmin = threadData.adminIDs.some(id => id == senderID);
if (role < 2 && !isAdmin) {
return api.sendMessage("⚠️ This command is only for Group Admins or Bot Admins.", threadID, messageID);
}

// Filter all group members
const members = threadData.members.filter(m => m.inGroup === true);

if (members.length === 0) {
return api.sendMessage("❌ Member list not found!", threadID, messageID);
}

api.sendMessage(`🚀 Starting to mention ${members.length} members...`, threadID);

let delay = 0;
for (const member of members) {
setTimeout(() => {
// If user provides extra text, it will show: Name Message. Otherwise just Name.
const body = extraText ? `${member.name} ${extraText}` : `${member.name}`;

api.sendMessage({
body: body,
mentions: [{
tag: member.name,
id: member.userID
}]
}, threadID);
}, delay);

delay += 1000; // 1 second interval for safety
}

} catch (err) {
api.sendMessage("❌ Error: " + err.message, threadID, messageID);
}
}
};
