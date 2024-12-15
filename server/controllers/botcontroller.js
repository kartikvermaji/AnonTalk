import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import USERS from '../models/user.js'; 
import findMatch from '../utils/matchUser.js'; 
import { handleNext, handleStop } from './chatAction.js';

dotenv.config(); 

const bot = new Telegraf(process.env.BOT_TOKEN);

// Handle when the user clicks the 'Find Next Partner' button
bot.hears('Find Next Partner', async (ctx) => {
  await handleNext(ctx, bot);  // This is where your /next logic goes
});

// Handle when the user clicks the 'Stop Chat' button
bot.hears('Stop Chat', async (ctx) => {
  await handleStop(ctx, bot);  // This is where your /stop logic goes
});

// Helper Function: Update User Attribute
async function updateUserAttribute(ctx, attribute, value, successMessage, followUpMessage) {
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
}

// Gender Actions with Fun Replies
bot.action("set_male", (ctx) => updateUserAttribute(ctx, "gender", "Male", "You are now a male! 😎 Who's ready for a bro chat? 🧔‍♂️", "Now you're all set! Ready for the next partner?"));
bot.action("set_female", (ctx) => updateUserAttribute(ctx, "gender", "Female", "So, you're a lady! 💁‍♀️ Let's get those girl chats going! 👩‍🦰", "You're all set, queen! Ready to chat with someone new?"));
bot.action("set_other", (ctx) => updateUserAttribute(ctx, "gender", "Other", "Ah, you're a mystery! 🔮 Let's keep it intriguing 🌈", "You're unique and amazing! Let's find your next chat buddy! 🦄"));

// Interest Actions with Fun Replies
bot.action("set_book", (ctx) => updateUserAttribute(ctx, "interests", "Books 📚", "You love books! 📖 Ready for some deep conversations? 🤓", "Now you're all set for some literary chats! 📚"));
bot.action("set_anime", (ctx) => updateUserAttribute(ctx, "interests", "Anime 😍", "Anime lover! 🍿 Let's talk about your favorite characters! 🦸‍♂️", "You are ready to talk anime! 🌟"));
bot.action("set_movie", (ctx) => updateUserAttribute(ctx, "interests", "Movies 📺", "A movie buff, huh? 🎬 Ready for the popcorn chats? 🍿", "You're all set for movie night talk! 🍿"));
bot.action("set_game", (ctx) => updateUserAttribute(ctx, "interests", "Games 🎳", "Game on! 🎮 Who's ready for a gaming session? 🕹️", "You’re all set to talk games! 🎮"));
bot.action("set_talk", (ctx) => updateUserAttribute(ctx, "interests", "Talking 🗣️", "You love to chat! Let's talk about everything and nothing 🗣️", "You're all set to talk! Let's start a conversation 💬"));
bot.action("set_drawing", (ctx) => updateUserAttribute(ctx, "interests", "Art/Crafts 🎨", "Art lover alert! 🎨 Ready to sketch some fun convos? 🖌️", "You're all set to talk art! 🎨"));

// Profile Setup Actions with Fun Messages
bot.action("set_gender", async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply(
        "What gender do you identify as? 👇",
        Markup.inlineKeyboard([
            [Markup.button.callback("Male 🧔‍♂️", "set_male")],
            [Markup.button.callback("Female 👩‍🦰", "set_female")],
            [Markup.button.callback("Other 🌈", "set_other")],
        ])
    );
});

bot.action("set_interest", async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply(
        "What interests do you have? 👇",
        Markup.inlineKeyboard([
            [Markup.button.callback("Books 📚", "set_book"), Markup.button.callback("Anime 😍", "set_anime")],
            [Markup.button.callback("Movies 📺", "set_movie"), Markup.button.callback("Games 🎳", "set_game")],
            [Markup.button.callback("Talking 🗣️", "set_talk"), Markup.button.callback("Art/Crafts 🎨", "set_drawing")],
        ])
    );
});

// Chat Actions with Buttons
bot.action("to_next", (ctx) => handleNext(ctx, bot));
bot.action("to_stop", (ctx) => handleStop(ctx, bot));

// Commands with Fun Replies
bot.start(async (ctx) => {
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

        ctx.reply(
            "Now, let's choose your interests! 🎉",
            Markup.inlineKeyboard([
                [Markup.button.callback("Books 📚", "set_book"), Markup.button.callback("Anime 😍", "set_anime")],
                [Markup.button.callback("Movies 📺", "set_movie"), Markup.button.callback("Games 🎳", "set_game")],
                [Markup.button.callback("Talking 🗣️", "set_talk"), Markup.button.callback("Art/Crafts 🎨", "set_drawing")],
            ])
        );
    } else {
        ctx.reply(
            "Welcome back to Anonymous Chat Bot! 🌟 \nUse: \n/next to find a chat partner 🧑‍🤝‍🧑 \n/stop to stop chatting 🚫 \n/profile to update your profile 📝",
            Markup.keyboard(["Find Next Partner", "Stop Chat"]).resize()
        );
    }
});

bot.command("help", (ctx) => {
    ctx.reply(`
Available commands:
/start - Start the bot 🚀
/next - Find a new partner 💬
/stop - End current chat 🛑
/profile - Update your preferences 📝
    `);
});

bot.command("profile", async (ctx) => {
    const telegramId = ctx.from.id;
    let user = await USERS.findOne({ telegramId });

    if (!user) {
        return ctx.reply("Please use /start to register first. 📝");
    }

    ctx.reply(
        "🤖 Update your Profile",
        Markup.inlineKeyboard([
            [Markup.button.callback("Set Gender 🧬", "set_gender"), Markup.button.callback("Set Interest 🧩", "set_interest")],
        ])
    );
});

bot.command("next", (ctx) => handleNext(ctx, bot));
bot.command("stop", (ctx) => handleStop(ctx, bot));

// Message Forwarding with Fun Responses
bot.on("message", async (ctx) => {
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
});

export default bot;
