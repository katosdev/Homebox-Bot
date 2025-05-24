import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// load slash commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath)) {
  const cmd = await import(path.join(commandsPath, file));
  client.commands.set(cmd.data.name, cmd);
}

client.once('ready', () => {
  console.log(`Ready as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
  if (msg.author.bot) return;
  // 1) #ideas keyword scan
  if (msg.channel.name === 'ideas') {
    import('./modules/ideaScanner.js').then(m => m.handleIdea(msg));
  }
  // 2) #support keyword auto-reply
  if (msg.channel.name === 'support') {
    import('./modules/supportResponder.js').then(m => m.handleSupport(msg));
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  await cmd.execute(interaction, client);
});

client.login(process.env.DISCORD_TOKEN);
