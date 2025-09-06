import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();
import bot from '../controllers/botcontroller.js';

export default async function webhookHandler(req, res) {
  if (req.method === 'POST') {
    try {
      const webhookInfo = await bot.telegram.getWebhookInfo();
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
