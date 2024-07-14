const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'interaction_logs.json');

function logInteraction(message, blacklistedChannels) {
    try {
        const logData = {
            userId: message.author.id,
            channelId: message.channel.id,
            timestamp: new Date().toISOString(),
            content: message.content
            // Add more metadata as needed
        };

        // Check if the channel is not blacklisted for logging
        if (!blacklistedChannels.includes(logData.channelId)) {
            fs.appendFileSync(logFilePath, JSON.stringify(logData) + '\n');
        }
    } catch (error) {
        console.error(`Error logging interaction: ${error.message}`);
    }
}

function logPatternMatch(message, pattern) {
    console.log(`Pattern match: User ${message.author.id} matched pattern ${pattern} with message: ${message.content}`);
}

module.exports = {
    logInteraction,
    logPatternMatch
};
