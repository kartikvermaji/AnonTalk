import { Telegraf,Markup } from 'telegraf';
import dotenv from 'dotenv';
import USERS from '../models/user.js'; 
import findMatch from '../utils/matchUser.js'; 
import {handleNext, handleStop }from "./chatAction.js";
dotenv.config(); 

const bot = new Telegraf(process.env.BOT_TOKEN);

//BUTTONS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BUTTONS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


bot.hears("Stop Chat", async (ctx) => {
  await handleStop(ctx, bot);
});

bot.hears("Find Next Partner", async (ctx) => {
  await handleNext(ctx, bot);
})
          
  
// Action for Male
bot.action("set_male", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.gender = "Male";
  await user.save();
  ctx.reply("Gender set to Male 🧔‍♂️");
});
// Action for Female
bot.action("set_female", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.gender = "Female";
  await user.save();
  ctx.reply("Gender set to Female 👩‍🦰");
});
// Action for Other
bot.action("set_other", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.gender = "Other";
  await user.save();
  ctx.reply("Gender set to Other 🌈");
});


bot.action("set_book", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.interests = "Books 📚";
  await user.save();
  ctx.reply("Interest set to Books 📚")
});
bot.action("set_anime", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.interests = "Anime 😍";
  await user.save();
  ctx.reply("Interest set to Anime 😍")
});
bot.action("set_movie", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.interests = "Movies 📺";
  await user.save();
  ctx.reply("Interest set to Books 📚")
});
bot.action("set_game", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.interests = "Games 🎳";
  await user.save();
  ctx.reply("Interest set to Games 🎳")
});
bot.action("set_talk", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.interests = "Talking 🗣️";
  await user.save();
  ctx.reply("Interest set to Talking 🗣️")
});
bot.action("set_drawing", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  user.interests = "Art/Crafts 🎨";
  await user.save();
  ctx.reply("Interest set to Art/Crafts 🎨")
});

//COMMANDS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//COMMANDS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//START THE CHAT
bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const username = ctx.from.username;
  let user = await USERS.findOne({ telegramId});
  if (!user) {
    user = new USERS({ telegramId,username});
  //   ctx.reply(
  //   "Select your Gender",
  //   Markup.inlineKeyboard([
  //     [Markup.button.callback("Male 🧔‍♂️", "set_male")],
  //     [Markup.button.callback("Female 👩‍🦰", "set_female")],
  //     [Markup.button.callback("Other 🌈", "set_other")],
  //   ])
  // );
    await user.save();
  }
    await ctx.reply(
    "Welcome to Anonymous Chat Bot! \nUse: \n/next to find a chat partner \n/stop to stop chatting \n/profile to update and view profile",
    Markup.keyboard(["Find Next Partner", "Stop Chat"])
      .resize()
  );
  
});
// HELP THE CHAT
bot.command("help", (ctx) => {
  ctx.reply(`
Available commands:
/start - Start the bot
/next - Find a new partner
/stop - End current chat
/profile - Update your preferences
`);
});
// PROFILE
bot.command("profile", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  ctx.reply("Update your profile: /set_gender, /set_partner_gender.");
});
// SET GENDER Command
bot.command("set_gender", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  ctx.reply(
    "Select your Gender",
    Markup.inlineKeyboard([
      [Markup.button.callback("Male 🧔‍♂️", "set_male")],
      [Markup.button.callback("Female 👩‍🦰", "set_female")],
      [Markup.button.callback("Other 🌈", "set_other")],
    ])
  );
});

//SET PARTNER GENDER
// bot.command("set_partner_gender", async (ctx) => {
//   const [_, partnerGender] = ctx.message.text.split(" ");

//   if (!["male", "female", "any"].includes(partnerGender)) {
//     return ctx.reply("Invalid preference. Please use 'male', 'female', or 'any'.");
//   }

//   const user = await USERS.findOne({ telegramId: ctx.from.id });
//   user.partnerGender = partnerGender;
//   await user.save();

//   ctx.reply("Your partner preference has been updated.");
// });

bot.command("next", async (ctx) => {
  await handleNext(ctx, bot);
});

bot.command("stop", async (ctx) => {
  await handleStop(ctx, bot);
});
// UPDATE INTERESTS
bot.command("set_interests", async (ctx) => {
  const telegramId = ctx.from.id;
  let user = await USERS.findOne({ telegramId });
  if (!user) {
    return ctx.reply("Please use /start to register first.");
  }
  ctx.reply(
    "Select your Interests",
    Markup.inlineKeyboard([
      [Markup.button.callback("Books 📚", "set_book")],
      [Markup.button.callback("Anime 😍", "set_anime")],
      [Markup.button.callback("Movies 📺", "set_movie")],
      [Markup.button.callback("Games 🎳", "set_game")],
      [Markup.button.callback("Talking 🗣️", "set_talk")],
      [Markup.button.callback("Art/Crafts 🎨", "set_drawing")],
    ])
  );
});

//CHATTING
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
