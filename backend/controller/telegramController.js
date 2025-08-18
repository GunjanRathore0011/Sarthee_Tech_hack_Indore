   
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

async function askBot(req, res) {
  try {
    const { query } = req.body;
    console.log("Received query:", query);

   const botA = "@UniversalSearch_Ro_bot"; // replace with actual Bot A username
    const botB = "@TrueCaller1Bot"; // replace with actual Bot B username
    const intervalMs = 5000; // Wait 5 seconds for Bot A's second reply
    const botBTimeout = 4000; // Wait max 5 sec for Bot B final reply

    const replies = [];

    // --- Step 1: Send query to Bot B and get actual reply ---
    const botBReply = await new Promise((resolve) => {
      let resolved = false;

      const handlerB = (event) => {
        if (event.message && event.message.senderId) {
          const msg = event.message.message;

          // Ignore placeholder like "Searching..."
          if (!msg.toLowerCase().includes("searching") && !resolved) {
            resolved = true;
            client.removeEventHandler(handlerB, new NewMessage({ fromUsers: botB }));
            resolve(msg);
          }
        }
      };

      client.addEventHandler(handlerB, new NewMessage({ fromUsers: botB }));
      client.sendMessage(botB, { message: query });

      // Safety timeout: if no valid reply in botBTimeout, take last message
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          client.removeEventHandler(handlerB, new NewMessage({ fromUsers: botB }));
          resolve("No final reply received from Bot B"); // fallback
        }
      }, botBTimeout);
    });

    replies.push(botBReply);

    // --- Step 2: Send query to Bot A and collect replies for fixed interval ---
    const botAReplies = [];
    const handlerA = (event) => {
      if (event.message && event.message.senderId) {
        botAReplies.push(event.message.message);
      }
    };

    client.addEventHandler(handlerA, new NewMessage({ fromUsers: botA }));
    await client.sendMessage(botA, { message: query });

    // Wait fixed interval for possible second reply
    await new Promise((resolve) => setTimeout(resolve, intervalMs));

    client.removeEventHandler(handlerA, new NewMessage({ fromUsers: botA }));

    replies.push(...botAReplies);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

     const staticPrompt = `
      I need you to act as a data processing engine. I will provide a block of raw, unstructured data. Your task is to extract, clean, and structure this data into a single JSON array of user objects. Each object in the array should represent a unique individual.

Follow these strict rules for processing:

1.  **De-duplication:** All records belonging to the same unique user must be consolidated into a single object.
2.  **Dynamic Key Identification:**
    * **Primary Key:** Prioritize document numbers (Aadhaar, Passport, etc.) as the unique identifier.
    * **Fallback Key:** If a document number is not present, use a combination of the "Full name" and "The name of the father" as "Name of Son" as a composite key to identify the user.
3.  **Symmetric Structure:** The output must be an array of objects, where each object has a consistent set of keys: "fullName", "fatherName", "documentNumber", "documentType", "telephones", "addresses", "regions", "emails",and  "nicknames" or (unkown says).
4.  **Data Aggregation:** Collect all available information for each user. For multi-value fields like "telephones", "addresses", and "regions", combine all unique values from the raw data into a single JSON array.
5.  **Handling Missing Data:** If a field has no data, so drop it  for single-value keys (like "documentNumber","email") .
6.  **Irrelevant Information:** Ignore any text, logs, or metadata that are not directly related to a user's personal profile (e.g., search bot logs, timestamps, or service-related messages, and if say no data found ).
7.  **If some times the Raw Data is not in the correct format,or say give irrelevant message like :"exceed the search limit or try another time " so  you should return an empty array.**
7 .  **Output Format:** The final output must be a valid JSON array of user objects, with each object containing the keys (dynamically or mention above).
**Here is the raw data to process:**
      Raw Data: "${replies}"
      
      Output JSON:
    `;

      const result = await model.generateContent(staticPrompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract a JSON array from the model's output
    let structuredData = [];
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        structuredData = JSON.parse(match[0]);
      } else {
        // fallback: try to parse as object if array not found
        const objMatch = text.match(/\{[\s\S]*\}/);
        if (objMatch) {
          structuredData = [JSON.parse(objMatch[0])];
        }
      }
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      structuredData = [];
    }

    // Send the structured data back to the client
    return res.status(200).json(structuredData);

  } catch (error) {
    console.error("Error in askBots:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { askBot };


