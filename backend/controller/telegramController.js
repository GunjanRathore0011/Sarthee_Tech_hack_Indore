
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { NewMessage } = require("telegram/events");
const { client } = require("../config/telegram");
require("dotenv").config();

// Ensure the API key is set in the environment variables
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
// Assume this is at the top of your file
// const { NewMessage } = require('your-telegram-client-library'); 

async function askBot(req, res) {
  try {
    const { query } = req.body;
    console.log("Received query:", query);

    const botA = "@UniversalSearch_Ro_bot";
    const botB = "@TrueCaller1Bot";
    const waitTime = 10000; // 10 seconds

    // Storage for replies
    const botAReplies = [];
    const botBReplies = [];

    // Handlers
    const handlerA = (event) => {
      if (event.message && event.message.senderId) {
        botAReplies.push(event.message.message);
      }
    };

    const handlerB = (event) => {
      if (event.message && event.message.senderId) {
        botBReplies.push(event.message.message);
      }
    };

    // Store NewMessage instances for proper removal
    const newMessageHandlerA = new NewMessage({ fromUsers: botA });
    const newMessageHandlerB = new NewMessage({ fromUsers: botB });

    // Attach both handlers
    client.addEventHandler(handlerA, newMessageHandlerA);
    client.addEventHandler(handlerB, newMessageHandlerB);

    // Send query to both bots
    await client.sendMessage(botA, { message: query });
    await client.sendMessage(botB, { message: query });

    // Wait 10 sec
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Remove handlers
    client.removeEventHandler(handlerA, newMessageHandlerA);
    client.removeEventHandler(handlerB, newMessageHandlerB);

    // Combine all replies into a single array
    const allReplies = [...botAReplies, ...botBReplies];
    console.log("Collected replies:", allReplies);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Construct the prompt using the correctly joined replies
    const staticPrompt = `
I need you to act as a data processing engine. I will provide a block of raw, unstructured data. Your task is to extract, clean, and structure this data into a single JSON array of user objects. Each object in the array should represent a unique individual.

Follow these strict rules for processing:

1. De-duplication: Consolidate same user into one object.
2. Primary Key: Use document numbers. Fallback: "fullName + fatherName".
3. Symmetric Structure: Keys should be: "fullName","fatherName","documentNumber","documentType","telephones","addresses","regions","emails","nicknames","Age","gender" and any additional information that realted to the number because sometimes its dynamic feature , ensure that no important information drop.
4. Aggregation: Collect unique values into arrays where applicable.
5. Missing Data: Drop empty single-value keys.
6. Ignore irrelevant info (logs, search errors, no data found).
7. If input is invalid or says "exceed limit / try again" → return empty array.
8. Output: Only valid JSON array.

Here is the raw data to process:
Raw Data: """${allReplies.join("\n")}"""

Output JSON:
`;

    let structuredData = [];
    try {
      const result = await model.generateContent(staticPrompt);
      const text = result.response.text();

      // Clean text (remove markdown fencing, whitespace, etc.)
      const cleanedText = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // Try array first
      const match = cleanedText.match(/\[[\s\S]*\]/);
      if (match) {
        structuredData = JSON.parse(match[0]);
      } else {
        // fallback: try object
        const objMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (objMatch) {
          structuredData = [JSON.parse(objMatch[0])];
        } else {
          structuredData = [];
        }
      }
    } catch (err) {
      console.error("Processing error:", err);
      structuredData = [];
    }

    // ✅ Always send safe JSON
    return res.status(200).json(structuredData);
  } catch (error) {
    console.error("Error in askBot:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { askBot };


