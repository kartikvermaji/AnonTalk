import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import USERS from '../models/user.js'; 
import findMatch from '../utils/matchUser.js'; 
dotenv.config(); 

const bot = new Telegraf(process.env.BOT_TOKEN);

// const usersState = {
//       telegramId:null,
//       gender: "other",
//       partnerGender:"any",
//       isSearching:false,
//       chatPartner:null,
//       interests:[],
//       rating:0,
//       ratingsCount:0,
// }
// const partnerState = {
//     telegramId:null,
//     gender: "other",
//     partnerGender:"any",
//     isSearching:false,
//     chatPartner:null,
//     interests:[],
//     rating:0,
//     ratingsCount:0,
// }



// Start command
bot.start(async (ctx) => {
  const telegramId = ctx.from.id;

  let user = await USERS.findOne({ telegramId });
  if (!user) {
    user = new USERS({ telegramId });
    await user.save();
  }
//   usersState=user

  ctx.reply("Welcome to Anonymous Chat Bot! \nUse: \n/next to find a chat partner \n/stop to stop chatting \n/profile to update and view profile");
});

// Help command
bot.command("help", (ctx) => {
  ctx.reply(`
Available commands:
/start - Start the bot
/next - Find a new partner
/stop - End current chat
/profile - Update your preferences
`);
});

// Profile command
bot.command("profile", async (ctx) => {
  const telegramId = ctx.from.id;

  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }

  ctx.reply("Update your profile: /set_gender, /set_partner_gender.");
});

// Gender setting commands
bot.command("set_gender", async (ctx) => {
  const [_, gender] = ctx.message.text.split(" ");

  if (!["male", "female", "other"].includes(gender)) {
    return ctx.reply("Invalid gender. Please use 'male', 'female', or 'other'.");
  }

  const user = await USERS.findOne({ telegramId: ctx.from.id });
  user.gender = gender;
  await user.save();

  ctx.reply("Your gender has been updated.");
});

bot.command("set_partner_gender", async (ctx) => {
  const [_, partnerGender] = ctx.message.text.split(" ");

  if (!["male", "female", "any"].includes(partnerGender)) {
    return ctx.reply("Invalid preference. Please use 'male', 'female', or 'any'.");
  }

  const user = await USERS.findOne({ telegramId: ctx.from.id });
  user.partnerGender = partnerGender;
  await user.save();

  ctx.reply("Your partner preference has been updated.");
});

// Match command
bot.command("next", async (ctx) => {
  const user = await USERS.findOne({ telegramId: ctx.from.id });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }

  user.isSearching = true;
  user.chatPartner = null;
  await user.save();

  const partnerTelegramId = await findMatch(user._id);
  if (partnerTelegramId) {
    ctx.reply("You are now connected to a partner. Say hi!");
    bot.telegram.sendMessage(partnerTelegramId, "You are now connected to a partner. Say hi!");
  } else {
    ctx.reply("No partners found. Please wait...");
  }
});

// Stop command
bot.command("stop", async (ctx) => {
  const user = await USERS.findOne({ telegramId: ctx.from.id });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }

  if (user.chatPartner) {
    const partner = await USERS.findById(user.chatPartner);
    partner.chatPartner = null;
    partner.isSearching = true;
    await partner.save();
  }

  user.chatPartner = null;
  user.isSearching = false;
  await user.save();

  ctx.reply("You have left the chat.");
});

bot.on("message", async (ctx) => {
  const user = await USERS.findOne({ telegramId: ctx.from.id });

  if (user.chatPartner) {
    const partner = await USERS.findById(user.chatPartner);
    bot.telegram.sendMessage(partner.telegramId, ctx.message.text);
  } else {
    ctx.reply("You are not currently in a chat.");
  }
});

export default bot;
