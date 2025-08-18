const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const prompt = require("prompt-sync")();

const apiId = 22675614; // 👉 Replace with your my.telegram.org API_ID
const apiHash = "e44d8e72a5696d35e4267e558eabdc14"; // 👉 Replace with your my.telegram.org API_HASH

// 👉 After first login, replace "" with saved session string
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjEwNQG7sXIVyXlPKvmQiAK0NxJxY3PjDsvw63+4JkqTSOW+9unWrw3XlVwmK+0TyCrB3IsruQQS4Ju68hMB0ntd4lAHhiXeIt6wIszpnUzBceAxcr5zBqiOzTwMGMRWl6bVuJRtp9kbBLhrREfZ1oHnELvbe63l7/87tu4Uwuf6swzo0dPmScs1ClafxlmOLiMpeTvDz4T2BiKQV2QLcEzZujrdJWCEzs4jQCefQAOBlV3BBg+tf08UVPgefNZVHeLe0ymq65jHYBo4Rfu/HIBUbA/8rh+bxrUwei11jik93I7mCgyBqQaj6F2ADmtBMjvCMOjk8wDN+z8kpGcq3si7FskH/Q==");

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
    phoneNumber: async () => "+919644421660",
    password: async () => customPrompt("Enter your 2FA password (if any): "),
    phoneCode: async () => customPrompt("Enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log(" Tele-g connected!");
//   console.log("👉 Save this session string:", client.session.save());
}

module.exports = { client, initTelegram };
