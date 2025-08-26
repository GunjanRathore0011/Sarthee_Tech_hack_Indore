const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const prompt = require("prompt-sync")();

const apiId = 22675614; // 👉 Replace with your my.telegram.org API_ID
const apiHash = "e44d8e72a5696d35e4267e558eabdc14"; // 👉 Replace with your my.telegram.org API_HASH

// 👉 After first login, replace "" with saved session string
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjE5MwG7gUvLJCERsCb26b2T8lUBymLvusgYqCLIYf9xLdg0cviPmDcLtQiLOTZXdx+7RYv5PbsYg7xrIXo4K5vrh+2XO+H9T6ar2Wk3/uvG3fASjC8gnsd8Rhj8IIt47XtHVYFeHhCNi8MUCqvYEjG+ELv9nNKakSO/O7noEKSJZMA4gV6tIhg99703bBbrd2rFM6lr1wnAT3r7Y7dgFfr4lh1kteCZ234uoKIot1KcpjGguEgIKvhYPXod5zetcHnZFKw0810cODaxleeh8UuGZR50srbw1yUTMdPk7pOPNsqt8pddlARnL+HKn1S+iXS62n2ymuKnn248PT07nhBiihXkUw==");
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
    phoneNumber: async () => "+919753230663",
    password: async () => customPrompt("Enter your 2FA password (if any): "),
    phoneCode: async () => customPrompt("Enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log(" Tele-g connected!");
  console.log("👉 Save this session string:", client.session.save());
}

module.exports = { client, initTelegram };
