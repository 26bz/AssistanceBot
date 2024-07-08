const { Client, GatewayIntentBits, TextChannel } = require('discord.js');
const { logInteraction } = require('./logger'); // Import the logInteraction function from logger.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const PREFIX = "!"; // Command prefix

// Function to load questions from JSON files
function loadQuestions(dir) {
    try {
        const files = fs.readdirSync(dir);
        let questions = [];

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const fileQuestions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            for (const [key, value] of Object.entries(fileQuestions)) {
                questions.push({ pattern: new RegExp(value.pattern, 'i'), response: value.response });
            }
        });

        return questions;
    } catch (error) {
        console.error(`Error loading questions: ${error.message}`);
        return [];
    }
}

// Load questions from Minecraft folder
const minecraftQuestions = loadQuestions(path.join(__dirname, 'src/questions/minecraft'));

// Array of supported channel IDs
const supportedChannels = ['1219670538692071454','1199934460389490688','1229171729331523704']; // Replace with actual channel IDs

// Function to find the best match for a user's message
function getResponse(message) {
    try {
        const content = message.content.toLowerCase(); // Convert the message content to lowercase

        for (const question of minecraftQuestions) {
            if (question.pattern.test(content)) {
                return question.response;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error getting response: ${error.message}`);
        return null;
    }
}

// Function to check if a channel is designated for support
function isSupportChannel(channel) {
    // Check if the channel ID is in the supportedChannels array
    return supportedChannels.includes(channel.id);
}

// Function to check if support is enabled for a channel
function isSupportEnabled(channel) {
    // Implement your logic to check if support is enabled for the channel
    // For demonstration purposes, return true by default
    return true;
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    try {
        if (message.author.bot) return; // Ignore messages from bots

        logInteraction(message, supportedChannels); // Log the interaction

        const response = getResponse(message);

        if (response) {
            // Check if the message is sent in a text channel and if support is enabled for the channel
            if (!(message.channel instanceof TextChannel) || !isSupportEnabled(message.channel)) {
                message.reply("This channel isn't a support channel or support is disabled in this channel. Please visit the support channels for assistance.");
                return;
            }

            // Check if the channel is designated for support
            if (!isSupportChannel(message.channel)) {
                message.reply("This channel isn't designated for support. Please visit the support channels for assistance.");
                return;
            }

            message.reply(response); // Reply with the predefined response
        }
    } catch (error) {
        console.error(`Error handling message: ${error.message}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
