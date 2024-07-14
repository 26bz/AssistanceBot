## Overview

AssistanceBot is a Discord bot designed to facilitate basic interaction and support functionalities within Discord servers.

### Features

- **Message Logging:** Tracks and logs interactions within specified channels.
- **Pattern-Based Responses:** Provides predefined responses based on user input patterns.
- **Support Channel Designation Check:** Ensures designated channels are used for support queries.

### Technologies Used

- **Node.js:** JavaScript runtime environment.
- **Discord.js:** Library for interacting with the Discord API.
- **dotenv:** Module for loading environment variables.
- **File System:** Utilized for logging interactions and messages.

## Setup

To run AssistanceBot locally or deploy it to a server, follow these steps:

### Prerequisites

- Node.js installed on your machine ([Download Node.js](https://nodejs.org/))
- Discord account with a registered bot application ([Discord Developer Portal](https://discord.com/developers/applications))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/26bz/AssistanceBot.git
   ```

   Replace `https://github.com/26bz/AssistanceBot.git` with your actual repository URL.

2. Navigate into the cloned directory:

   ```bash
   cd AssistanceBot
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add your Discord bot token and other necessary variables:

     ```plaintext
     DISCORD_TOKEN=your_discord_bot_token
     ```

5. Start the bot:

   ```bash
   npm start
   ```

6. Customize and configure the bot as needed for your Discord server.
