import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import axios from 'axios';
import bodyParser from 'body-parser';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Define webhook endpoint
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle the incoming updates from Telegram
    bot.handleUpdate(req.body); // Pass the request body to Telegraf's handler
    return res.status(200).send('OK');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

// Set the webhook
const setWebhook = async () => {
  const webhookUrl = `https://${process.env.VERCEL_URL}/api/webhook`; // Use the Vercel URL here
  await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${webhookUrl}`);
};

setWebhook();
