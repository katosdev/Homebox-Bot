// scripts/register-commands.js
import { readdirSync } from 'fs';
import { join } from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { config } from 'dotenv';

config(); // loads DISCORD_TOKEN, CLIENT_ID, GUILD_ID from .env

// 1) Load your command JSON data
const commands = [];
const commandsPath = join(process.cwd(), 'src/commands');
for (const file of readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const { data } = await import(join(commandsPath, file));
  commands.push(data.toJSON());
}

// 2) Configure REST client
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// 3) Choose your registration target:
// • For development in a specific guild:
const route = Routes.applicationGuildCommands(
  process.env.CLIENT_ID,
  process.env.GUILD_ID
);
// • Or for global deployment:
// const route = Routes.applicationCommands(process.env.CLIENT_ID);

// 4) Push the commands
try {
  console.log(`Started refreshing ${commands.length} commands…`);
  const data = await rest.put(route, { body: commands });
  console.log(`Successfully reloaded ${data.length} commands.`);
} catch (error) {
  console.error(error);
}
