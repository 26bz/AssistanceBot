const { Client, GatewayIntentBits, TextChannel } = require('discord.js');
const { logInteraction, logPatternMatch } = require('./logger');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const PREFIX = "!"; // Command prefix
const BLACKLISTED_CHANNELS = ['1219670538692071454', '1199934460389490688', '1229171729331523704']; // Replace with actual channel IDs

const userSessions = {}; // Initialize userSessions object to store session data

/**
 * Load questions from JSON files in the specified directory.
 * @param {string} dir - The directory to load questions from.
 * @returns {Array} The loaded questions.
 */
function loadQuestions(dir) {
    try {
        const files = fs.readdirSync(dir);
        const questions = files.flatMap(file => {
            const filePath = path.join(dir, file);
            const fileQuestions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return Object.values(fileQuestions).map(({ pattern, response }) => ({
                pattern: new RegExp(pattern, 'i'),
                response
            }));
        });

        return questions;
    } catch (error) {
        console.error(`Error loading questions: ${error.message}`);
        return [];
    }
}

const questions = loadQuestions(path.join(__dirname, 'src/questions/minecraft'));

/**
 * Check if a channel is blacklisted.
 * @param {TextChannel} channel - The channel to check.
 * @returns {boolean} True if the channel is blacklisted, false otherwise.
 */
function isBlacklistedChannel(channel) {
    return BLACKLISTED_CHANNELS.includes(channel.id);
}

/**
 * Check if support is enabled for a channel.
 * @param {TextChannel} channel - The channel to check.
 * @returns {boolean} True if support is enabled, false otherwise.
 */
function isSupportEnabled(channel) {
    return !isBlacklistedChannel(channel);
}

/**
 * Find the best match for a user's message.
 * @param {string} content - The content of the message.
 * @returns {Object|null} The matched response and pattern, or null if no match is found.
 */
function getResponse(content) {
    try {
        const lowerContent = content.toLowerCase();
        for (const { pattern, response } of questions) {
            if (pattern.test(lowerContent)) {
                return { response, pattern: pattern.toString() };
            }
        }
        return null;
    } catch (error) {
        console.error(`Error getting response: ${error.message}`);
        return null;
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    try {
        if (message.author.bot) return;

        const result = getResponse(message.content);

        if (result) {
            if (!(message.channel instanceof TextChannel) || !isSupportEnabled(message.channel)) {
                message.reply("This channel isn't a supported channel or support is disabled in this channel. Please visit the supported channels for assistance.");
                return;
            }

            message.reply(result.response);
            logPatternMatch(message, result.pattern);
            logInteraction(message, BLACKLISTED_CHANNELS);
        }

    } catch (error) {
        console.error(`Error handling message: ${error.message}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
