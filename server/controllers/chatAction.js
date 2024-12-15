import { Telegraf,Markup } from 'telegraf';
import dotenv from 'dotenv';
import USERS from '../models/user.js'; 
import findMatch from '../utils/matchUser.js'; 
dotenv.config();  

function getRandomString(stringsArray) {
  if (!Array.isArray(stringsArray) || stringsArray.length === 0) {
    throw new Error("Input must be a non-empty array of strings.");
  }
  const randomIndex = Math.floor(Math.random() * stringsArray.length);
  return stringsArray[randomIndex];
}

// Example usage
const partnerHints = [
  "Looks like you’ve been paired with someone who’s a total wildcard! Ready to see what they’ve got? 😉🔥",
  "Your partner seems intriguing—think you can handle their charm? 😏✨",
  "They say opposites attract… or do they? Let’s find out with this pairing! 😜🎢",
  "You’ve got a chat partner who might just sweep you off your feet—don’t let them get away! 💕😂",
  "This partner’s got mystery written all over them—can you crack the code? 🕵️‍♂️😉",
  "Brace yourself—this might be your most entertaining chat yet! 😏🎉",
  "Your partner’s got vibes that scream fun. Are you up for the challenge? 😎💌",
  "They’ve got the charm, and you’ve got the sass—sounds like a perfect match! 😘🔥",
  "Time to bring your A-game because your chat partner seems like a real pro! 🏆😜",
  "Your partner is ready to impress. Think you can keep up? 😏🚀",
  "It’s like fate sent you the most unpredictable partner—ready to dive in? 😘🎤",
  "You’ve been paired with someone who’s bringing the energy. Can you match it? 🎉😏",
  "I’d keep an eye on this partner—they might just surprise you! 👀✨",
  "Who needs Cupid when I’ve just paired you with the ultimate charmer? 💘😂",
  "Your partner seems like a keeper—don’t let this conversation go to waste! 😜💌",
  "This pairing has all the potential for some serious fun—let’s see where it goes! 🎢💖",
  "Warning: Your partner might be too much fun to handle. Proceed at your own risk! 😏🔥",
  "I think your partner’s got a few tricks up their sleeve—time to find out! 🃏😉",
  "They’ve got the humor; you’ve got the charm. This chat could be legendary! 🤝😂",
  "Your partner’s bringing the heat—think you can keep things cool? 😎💘"
];

const Hint = getRandomString(partnerHints);


export const handleStop = async (ctx,bot) => {
    const telegramId = ctx.from.id;
    let user = await USERS.findOne({ telegramId });
    if (!user) {
      return ctx.reply("Please use /start to register first.");
    }
    if (user.chatPartner) {
      const partner = await USERS.findById(user.chatPartner);
      await bot.telegram.sendMessage(
        partner.telegramId,
        "Your Partner Left the chat 😥\n\n/next-find a new partner\n/stop-stop the bot \n\nhttps://t.me/talking_anonmyousbot"
      );
      partner.chatPartner = null;
      partner.isSearching = false;
      await partner.save();
    }
    user.chatPartner = null;
    user.isSearching = false;
    await user.save();
    return ctx.reply(
      "You have left the chat 😥\n\n/next-find a new partner\n/stop-stop the bot \n\n@talking_anonmyousbot"
    );
  };
export const handleNext = async (ctx, bot) => {
    const telegramId = ctx.from.id;
    let user = await USERS.findOne({ telegramId });
    if (!user) {
      return ctx.reply("Please use /start to register first.");
    }

    if (user.chatPartner) {
      const partner = await USERS.findById(user.chatPartner);
      await bot.telegram.sendMessage(
        partner.telegramId,
        "Your Partner Left the chat 😥\n\n/next-find a new partner\n/stop-stop the bot \n\n@talking_anonmyousbot"
      );
      partner.chatPartner = null;
      partner.isSearching = false;
      await partner.save();
      ctx.reply("You have left the chat.");
    }
    user.isSearching = true;
    user.chatPartner = null;
    await user.save();
    const partnerTelegramId = await findMatch(user._id);
    if (partnerTelegramId) {
      await ctx.reply(`Found Someone 😉!\n\n/next-find a new partner\n/stop-stop the bot\n\n ${getRandomString(partnerHints)}`);
      await bot.telegram.sendMessage(partnerTelegramId, `Found Someone 😉!\n\nnext-find a new partner\n/stop-stop the bot\n\n ${getRandomString(partnerHints)}`);
    } else {
      await ctx.reply("🔍 Searching for a random partner...");
    }
  };

  