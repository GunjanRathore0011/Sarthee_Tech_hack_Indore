const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const prompt = require("prompt-sync")();

const apiId = 22675614; // 👉 Replace with your my.telegram.org API_ID
const apiHash = "e44d8e72a5696d35e4267e558eabdc14"; // 👉 Replace with your my.telegram.org API_HASH

// 👉 After first login, replace "" with saved session string
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjExMQG7cjGfoRjM4qkGBNtO4knXttUNWqRruxT47FVRDQX3zgvKjMZSQxJMbiUUYMF8dzC28a24RlLZEZe38TD6+D4h2xNoSsq60o35SXz+r/zFP9xFFL8Iy6t7Nuzcp/r7RYRpXYQhijTzhD6f74LFUGrPSjwH3vaBSchExN1y9rUyKj7Sns0BQUS/Jpwz3jafx7IglAen1fCIeJe9pxQWALHhKxEVun7N45iWOYdZSjCsRCfV7Y8zzqi5ly6Aoi8mvLsp7KW4WPDW6OtHQN42XFm9cX9WsIGLQz4U6MygqXkw++PZ05ydz0ati4bB2shkW0ZKjR5XijREJjMp16A3CqcqCA==");

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
  console.log("👉 Save this session string:", client.session.save());
}

module.exports = { client, initTelegram };
