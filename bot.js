const { Client, GatewayIntentBits, TextChannel } = require('discord.js');
const { logger, logPatternMatch } = require('./logger');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const PREFIX = "!"; // Command prefix

// Initialize userSessions object to store session data
const userSessions = {};

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
const questions = loadQuestions(path.join(__dirname, 'src/questions/minecraft'));

// Array of blacklisted channel IDs
const blacklistedChannels = ['1219670538692071454', '1199934460389490688', '1229171729331523704']; // Replace with actual channel IDs

// Function to find the best match for a user's message
function getResponse(message) {
    try {
        const content = message.content.toLowerCase(); // Convert the message content to lowercase

        for (const { pattern, response } of questions) {
            // Check if the content matches the pattern
            if (pattern.test(content)) {
                return { response, pattern: pattern.toString() };
            }
        }
        
        // If no match is found, return null
        return null;

    } catch (error) {
        console.error(`Error getting response: ${error.message}`);
        return null;
    }
}

// Function to check if a channel is blacklisted
function isBlacklistedChannel(channel) {
    // Check if the channel ID is in the blacklistedChannels array
    return blacklistedChannels.includes(channel.id);
}

// Function to check if support is enabled for a channel
function isSupportEnabled(channel) {
    // Implement your logic to check if support is enabled for the channel
    // For demonstration purposes, return true if the channel is not blacklisted
    return !isBlacklistedChannel(channel);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    try {
        if (message.author.bot) return; // Ignore messages from bots

        const result = getResponse(message);

        if (result) {
            // Check if the message is sent in a text channel and if support is enabled for the channel
            if (!(message.channel instanceof TextChannel) || !isSupportEnabled(message.channel)) {
                message.reply("This channel isn't a supported channel or support is disabled in this channel. Please visit the supported channels for assistance.");
                return;
            }

            message.reply(result.response); // Reply with the predefined response
            logPatternMatch(message, result.pattern); // Log the pattern match
        }

    } catch (error) {
        console.error(`Error handling message: ${error.message}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
