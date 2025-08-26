const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
console.log("sending to tweiliol")
async function sendWhatsAppText(to, body) {
    console.log("send text....................")
    console.log(to)
    console.log(body)
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body
  });
  
}

async function sendWhatsAppMedia(to, body, mediaUrlArray) {
    console.log("..............send pdf")
  console.log(to)
    console.log(body)
    console.log(mediaUrlArray)
    return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
    mediaUrl: mediaUrlArray
  });
}

module.exports = { client, sendWhatsAppText, sendWhatsAppMedia };
