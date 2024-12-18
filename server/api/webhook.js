import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();
import bot from '../controllers/botcontroller.js';
// const bot = new Telegraf(process.env.BOT_TOKEN);

// Webhook handler function
export default async function webhookHandler(req, res) {
  if (req.method === 'POST') {
    try {
      // console.log('Incoming update:', req.body); // Log updates for debugging
      const webhookInfo = await bot.telegram.getWebhookInfo();
      // console.log(webhookInfo);
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling update:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

// Setup webhook on bot initialization
(async () => {
  const webhookUrl = `${process.env.VERCEL_URL}/api/webhook`;
  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`Webhook set successfully: ${webhookUrl}`);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
})();
