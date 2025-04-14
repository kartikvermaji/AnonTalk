import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import USERS from '../models/user.js'; 
import { handleNext, handleStop } from './chatAction.js';
const bot = new Telegraf(process.env.BOT_TOKEN);

dotenv.config();
async function setWebhook() {
  const webhookUrl = `${process.env.VERCEL_URL}api/webhook`;
  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`Webhook set successfully: ${webhookUrl}`);
  } catch (error) {
    if (error.response && error.response.error_code === 429) {
      const retryAfter = error.response.parameters.retry_after;
      console.log(`Too many requests. Retrying after ${retryAfter} seconds...`);
      setTimeout(setWebhook, retryAfter * 1000); // Retry after the delay
    } else {
      console.error('Error setting webhook:', error);
    }
  }
}
setWebhook();

// async function getUsers() {
//   try {
//     const users = await USERS.find({}, { username: 1, Admin: 1 }); // include both fields

//     for (const user of users) {
//       if (user.username === "hehe_sharingan") {
//         user.Admin = true;
//         await user.save(); // await for proper DB update
//         console.log(`${user.username} is now an Admin.`);
//       } else {
//         console.log(user.username, " ", user.Admin);
//       }
//     }

//   } catch (err) {
//     console.error("Error fetching users:", err);
//   }
// }

// getUsers();

// Helper function to remove user when blocked
const handleBlockedUser = async (ctx, error) => {
  if (error.response && error.response.error_code === 403) {
    // The current user (ctx) is the partner of the blocker
    const currentUser = await USERS.findOne({ telegramId: ctx.from.id });
    if (!currentUser) {
      console.error("Error: currentuser not found or chatPartner is null.");
      return;
    }
    if(!currentUser.chatPartner){
      console.error("Error: Partner not found or chatPartner is null.");
      return;
    }

    // Find the blocker (currentUser's chatPartner)
    const blocker = await USERS.findById(currentUser.chatPartner);
    if (blocker) {
      console.log(`User ${blocker.username} (ID: ${blocker.telegramId}) has blocked the bot.`);

      // Delete the blocker from the database
      await USERS.deleteOne({ telegramId: blocker.telegramId });
      console.log(`User ${blocker.username} (ID: ${blocker.telegramId}) has been deleted from the database.`);

      // Update the current user (remove their chatPartner)
      currentUser.chatPartner = null;
      await currentUser.save();

      // Notify the current user
      await bot.telegram.sendMessage(
        currentUser.telegramId,
        "Your partner has left the chat.\nUse /next to find a new partner. 😊"
      );
    } else {
      console.error("Error: Blocker user not found in the database.");
    }
  } else {
    console.error("Unexpected error:", error);
  }
};

// Handle when the user clicks the 'Find Next Partner' button
bot.hears('Find Next Partner', async (ctx) => {
  try {
    await handleNext(ctx, bot);  // This is where your /next logic goes
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});

// Handle when the user clicks the 'Stop Chat' button
bot.hears('Stop Chat', async (ctx) => {
  try {
    await handleStop(ctx, bot);  // This is where your /stop logic goes
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});

// Helper Function: Update User Attribute
async function updateUserAttribute(ctx, attribute, value, successMessage, followUpMessage) {
  try {
    await ctx.answerCbQuery();
    const telegramId = ctx.from.id;
    let user = await USERS.findOne({ telegramId });

    if (!user) {
      return ctx.reply("Please use /start to register first.");
    }

    user[attribute] = value;
    await user.save();
    ctx.reply(successMessage);
    
    // Add a follow-up message with navigation buttons
    ctx.reply(
      followUpMessage,
      Markup.inlineKeyboard([
        [Markup.button.callback("Find Next Partner 🤝", "to_next")],
        [Markup.button.callback("Stop Chat 🚫", "to_stop")]
      ])
    );
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
}

// Gender Actions with Fun Replies
bot.action("set_male", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "gender", "Male", "You are now a male! 😎 Who's ready for a bro chat? 🧔‍♂️", "Now you're all set! Ready for the next partner?");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("set_female", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "gender", "Female", "So, you're a lady! 💁‍♀️ Let's get those girl chats going! 👩‍🦰", "You're all set, queen! Ready to chat with someone new?");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("set_other", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "gender", "Other", "Ah, you're a mystery! 🔮 Let's keep it intriguing 🌈", "You're unique and amazing! Let's find your next chat buddy! 🦄");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});

// Interest Actions with Fun Replies
bot.action("set_book", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "interests", "Books 📚", "You love books! 📖 Ready for some deep conversations? 🤓", "Now you're all set for some literary chats! 📚");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("set_anime", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "interests", "Anime 😍", "Anime lover! 🍿 Let's talk about your favorite characters! 🦸‍♂️", "You are ready to talk anime! 🌟");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("set_movie", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "interests", "Movies 📺", "A movie buff, huh? 🎬 Ready for the popcorn chats? 🍿", "You're all set for movie night talk! 🍿");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("set_game", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "interests", "Games 🎳", "Game on! 🎮 Who's ready for a gaming session? 🕹️", "You’re all set to talk games! 🎮");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("set_talk", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "interests", "Talking 🗣️", "You love to chat! Let's talk about everything and nothing 🗣️", "You're all set to talk! Let's start a conversation 💬");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("set_drawing", async (ctx) => {
  try {
    await updateUserAttribute(ctx, "interests", "Art/Crafts 🎨", "Art lover alert! 🎨 Ready to sketch some fun convos? 🖌️", "You're all set to talk art! 🎨");
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});

// Profile Setup Actions with Fun Messages
bot.action("set_gender", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    ctx.reply(
      "What gender do you identify as? 👇",
      Markup.inlineKeyboard([
        [Markup.button.callback("Male 🧔‍♂️", "set_male")],
        [Markup.button.callback("Female 👩‍🦰", "set_female")],
        [Markup.button.callback("Other 🌈", "set_other")],
      ])
    );
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("set_interest", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    ctx.reply(
      "What interests do you have? 👇",
      Markup.inlineKeyboard([
        [Markup.button.callback("Books 📚", "set_book"), Markup.button.callback("Anime 😍", "set_anime")],
        [Markup.button.callback("Movies 📺", "set_movie"), Markup.button.callback("Games 🎳", "set_game")],
        [Markup.button.callback("Talking 🗣️", "set_talk"), Markup.button.callback("Art/Crafts 🎨", "set_drawing")],
      ])
    );
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.command("set_interest", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    ctx.reply(
      "What interests do you have? 👇",
      Markup.inlineKeyboard([
        [Markup.button.callback("Books 📚", "set_book"), Markup.button.callback("Anime 😍", "set_anime")],
        [Markup.button.callback("Movies 📺", "set_movie"), Markup.button.callback("Games 🎳", "set_game")],
        [Markup.button.callback("Talking 🗣️", "set_talk"), Markup.button.callback("Art/Crafts 🎨", "set_drawing")],
      ])
    );
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});

// Chat Actions with Buttons
bot.action("to_next", async (ctx) => {
  try {
    await handleNext(ctx, bot);
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.action("to_stop", async (ctx) => {
  try {
    await handleStop(ctx, bot);
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});

// Commands with Fun Replies
bot.start(async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const username = ctx.from.username;
    let user = await USERS.findOne({ telegramId });

    if (!user) {
      user = new USERS({ telegramId, username });
      await user.save();

      ctx.reply(
        "Let's start by setting up your profile! 🤖 Choose your gender and interests below. 👇",
        Markup.inlineKeyboard([
          [Markup.button.callback("Male 🧔‍♂️", "set_male"), Markup.button.callback("Female 👩‍🦰", "set_female")],
          [Markup.button.callback("Other 🌈", "set_other")],
        ])
      );

    //   ctx.reply(
    //     "Now, let's choose your interests! 🎉",
    //     Markup.inlineKeyboard([
    //       [Markup.button.callback("Books 📚", "set_book"), Markup.button.callback("Anime 😍", "set_anime")],
    //       [Markup.button.callback("Movies 📺", "set_movie"), Markup.button.callback("Games 🎳", "set_game")],
    //       [Markup.button.callback("Talking 🗣️", "set_talk"), Markup.button.callback("Art/Crafts 🎨", "set_drawing")],
    //     ])
    //   );
    
    } else {
      ctx.reply(
        "Welcome back to Anonymous Chat Bot! 🌟 \nUse: \n/next to find a chat partner 🧑‍🤝‍🧑 \n/stop to stop chatting 🚫 \n/profile to update your profile 📝",
        Markup.keyboard(["Find Next Partner", "Stop Chat"]).resize()
      );
    }
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.command("help", (ctx) => {
  ctx.reply("This bot allows you to connect with random users. Use /next to find someone new or /stop to end a chat.");
});
bot.command("next", async(ctx) => {
  try {
    await handleNext(ctx, bot);  // This is where your /next logic goes
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.command("tellme", async(ctx) => {
  try {
    const telegramId = ctx.from.id;
    let user = await USERS.findOne({ telegramId });
    if (!user) {
        return ctx.reply("Oops! Looks like you haven't registered yet. Use /start to begin. 🚀");
    }
    if (!user.Admin) {
        return ctx.reply("Your're not ADMIN kiddo !!");
    }
    if(!user.chatPartner){
        return ctx.reply("In your service sir !!\n You are not in chat My lord");
    }
    if (user.chatPartner) {
      const partner = await USERS.findById(user.chatPartner);
      return ctx.reply(`In your service sir !!\n This is your Guy \n\n @${partner.username} \n ${partner.gender} \n\n User Count : ${USERS.length}`);
    }
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
bot.command("stop", async(ctx) => {
  try {
    await handleStop(ctx, bot);  // This is where your /next logic goes
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});
// Message event handling (forwarding messages to chat partner)
bot.on("message", async (ctx) => {
  try {
    const user = await USERS.findOne({ telegramId: ctx.from.id });
    if (user && user.chatPartner) {
      const partner = await USERS.findById(user.chatPartner);
      if (!partner) {
        return ctx.reply("Your chat partner could not be found. 😔");
      }
      const message = ctx.message;
      if (message.text) {
        await bot.telegram.sendMessage(partner.telegramId, message.text);
      } else if (message.photo) {
        const fileId = message.photo[message.photo.length - 1].file_id;
        await bot.telegram.sendPhoto(partner.telegramId, fileId, { caption: message.caption || "" });
      } else if (message.video) {
        await bot.telegram.sendVideo(partner.telegramId, message.video.file_id, { caption: message.caption || "" });
      } else if (message.document) {
        await bot.telegram.sendDocument(partner.telegramId, message.document.file_id, { caption: message.caption || "" });
      } else {
        ctx.reply("This type of message is not supported yet. 😅");
      }
    } else {
      ctx.reply("You are not currently in a chat. 🤷‍♂️");
    }
  } catch (error) {
    await handleBlockedUser(ctx, error);
  }
});

export default bot; 