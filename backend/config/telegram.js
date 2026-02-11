const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const prompt = require("prompt-sync")();

const apiId = 31866463; // 👉 Replace with your my.telegram.org API_ID
const apiHash = "5fa4d88ede4e908c46796050bc57c5b1"; // 👉 Replace with your my.telegram.org API_HASH

// 👉 After first login, replace "" with saved session string
const stringSession = new StringSession("");
// const stringSession = new StringSession("");
const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
   useWSS: true,
});


const readline = require("readline");

function customPrompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function initTelegram() {
  await client.start({
    phoneNumber: async () => "+919424821409",
    password: async () => customPrompt("Enter your 2FA password (if any): "),
    phoneCode: async () => customPrompt("Enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log(" Tele-g connected!");
  console.log("👉 Save this session string:", client.session.save());
}

module.exports = { client, initTelegram };
