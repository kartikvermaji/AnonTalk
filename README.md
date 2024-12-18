# AnonTalk Telegram Bot

**AnonTalk** is a fun and engaging Telegram bot that connects random users for anonymous chatting. The bot pairs users based on their interests, allowing them to chat while keeping their identities hidden. If a user blocks the bot, the bot automatically removes the blocker and notifies their chat partner.

## Features

- **Anonymous Chatting:** Chat without revealing your identity.
- **Interest-Based Pairing:** Find chat partners with similar interests (e.g., books, anime, movies).
- **Profile Customization:** Set your gender and interests to personalize the chat experience.
- **Message Forwarding:** The bot forwards messages, photos, videos, and documents between matched users.
- **Partner Removal on Block:** If a user blocks the bot, the bot deletes their partner's data and notifies them.

## Prerequisites

Before running the bot, you'll need:

- A **Telegram bot token**. Create a bot using [BotFather](https://core.telegram.org/bots#botfather).
- A **MongoDB database** for storing user information and chat data.
- **Node.js** installed on your system.

## Installation

### Step 1: Clone the Repository


git clone https://github.com/your-username/anonTalk-bot.git
cd anonTalk-bot
Step 2: Install Dependencies
bash
Copy code
npm install
Step 3: Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

bash
Copy code
BOT_TOKEN=your-telegram-bot-token
MONGO_URI=your-mongodb-connection-string
Replace your-telegram-bot-token with your Telegram bot's token and your-mongodb-connection-string with your MongoDB URI.

Step 4: Run the Bot
bash
Copy code
npm start
The bot will now be running and ready to interact with users.

Bot Commands
/start – Start the bot and set up your profile (gender and interests).
/next – Find a new chat partner based on your preferences.
/stop – End the current chat.
/help – Get help on how to use the bot.
Database Schema
The bot uses MongoDB to store user data. Here's a brief overview of the user schema:

telegramId: The unique ID for each Telegram user.
username: The Telegram username of the user.
gender: The user's gender (e.g., Male, Female, Other).
interests: The user's selected interests (e.g., Books, Anime, Movies).
chatPartner: The telegramId of the user's current chat partner (if any).
Flow and Error Handling
If a user blocks the bot, the bot identifies the blocker through the partner's chatPartner field and deletes the blocker’s data.
If a partner is found for a user, the bot forwards all messages, photos, videos, and documents between the two.
Users are notified if their chat partner leaves the conversation.
Contributing
Contributions are welcome! If you find a bug or want to add a new feature, feel free to create an issue or submit a pull request.

License
Distributed under the APACHE 2.0 License. See LICENSE for more information.
