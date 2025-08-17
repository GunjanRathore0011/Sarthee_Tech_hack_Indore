// const { NewMessage } = require("telegram/events");
// const { client } = require("../config/telegram");

// async function askBot(req, res) {
//   try {
//     const { query } = req.body;
//     const targetBot = "@UniversalSearch_Ro_bot"; // replace with actual bot username

//     // Send message to bot
//     await client.sendMessage(targetBot, { message: query });

//     // Collect replies
//     const replies = [];

//     await new Promise((resolve) => {
//       const handler = (event) => {
//         if (event.message && event.message.senderId) {
//           replies.push(event.message.message);

//           // Once we got 2 replies, stop listening
//           if (replies.length === 2) {
//             client.removeEventHandler(handler, new NewMessage({ fromUsers: targetBot }));
//             resolve();
//           }
//         }
//       };

//       client.addEventHandler(handler, new NewMessage({ fromUsers: targetBot }));
//     });

//     // Send both replies to frontend
//     return res.json({ replies });

//   } catch (error) {
//     console.error("Error in askBot:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// }

// module.exports = { askBot };


const { NewMessage } = require("telegram/events");
const { client } = require("../config/telegram");

async function askBot(req, res) {
  try {
    const { query } = req.body;
    const targetBot = "@UniversalSearch_Ro_bot"; // replace with actual bot username

    // Send query to bot
    await client.sendMessage(targetBot, { message: query });

    let replyCount = 0;
    let secondReply = null;

    await new Promise((resolve) => {
      const handler = (event) => {
        if (event.message && event.message.senderId) {
          replyCount++;

          if (replyCount === 2) {   // 👈 only take the 2nd reply
            secondReply = event.message.message;
            client.removeEventHandler(handler, new NewMessage({ fromUsers: targetBot }));
            resolve();
          }
        }
      };

      client.addEventHandler(handler, new NewMessage({ fromUsers: targetBot }));
    });

    return res.json({ reply: secondReply });

  } catch (error) {
    console.error("Error in askBot:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { askBot };
