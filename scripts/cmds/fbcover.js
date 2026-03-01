const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs-extra");

module.exports = {
config: {
name: "fbcover",
version: "1.0.0",
author: "Mohammad Nayan by milon fix",
countDown: 5,
role: 0,
category: "Image",
description: "Generate a Facebook cover image",
guide: {
en: "{pn} name - subname - address - email - phone - color"
}
},

onStart: async function ({ api, event, args, usersData }) {
const { threadID, messageID, senderID } = event;
const info = args.join(" ");

// API Link (github থেকে ডাটা নিচ্ছে)
const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
const n = apis.data.api;

// ইউজার আইডি এবং নাম বের করা (Goat Bot সিস্টেমে)
const targetID = Object.keys(event.mentions)[0] || senderID;
const userData = await usersData.get(targetID);
const nam = userData.name;

if (!info) {
return api.sendMessage(
"Please enter in the format:\n{pn} name - subname - address - email - phone nbr - color (default = no)",
threadID, messageID
);
}

const msg = info.split("-");
const name = msg[0]?.trim() || "";
const subname = msg[1]?.trim() || "";
const address = msg[2]?.trim() || "";
const email = msg[3]?.trim() || "";
const phone = msg[4]?.trim() || "";
const color = msg[5]?.trim() || "no";

const processingMsg = await api.sendMessage(`Processing your cover, please wait...`, threadID);

// ইমেজ জেনারেট ইউআরএল
const imgUrl = `${n}/fbcover/v1?name=${encodeURIComponent(name)}&uid=${targetID}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(phone)}&color=${encodeURIComponent(color)}`;

try {
const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
const outputPath = __dirname + `/cache/fbcover_${senderID}.png`;

// cache ফোল্ডার চেক
fs.ensureDirSync(__dirname + "/cache");

const image = await jimp.read(response.data);
await image.writeAsync(outputPath);

const attachment = fs.createReadStream(outputPath);

const body = `◆━━━━━━━━◆◆━━━━━━━━◆\n` +
`🔴 INPUT NAME: ${name}\n` +
`🔵 INPUT SUBNAME: ${subname}\n` +
`📊 ADDRESS: ${address}\n` +
`✉️ EMAIL: ${email}\n` +
`☎️ PHONE NO.: ${phone}\n` +
`🎇 COLOUR: ${color}\n` +
`🆔 USER: ${nam}\n` +
`◆━━━━━━━━◆◆━━━━━━━━◆`;

// প্রসেসিং মেসেজ ডিলিট করে ইমেজ পাঠানো
await api.unsendMessage(processingMsg.messageID);

return api.sendMessage({
body: body,
attachment: attachment
}, threadID, () => {
if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
}, messageID);

} catch (error) {
console.error(error);
if (processingMsg.messageID) api.unsendMessage(processingMsg.messageID);
return api.sendMessage("An error occurred while generating the FB cover.", threadID, messageID);
}
}
};
