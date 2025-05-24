import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { Octokit } from '@octokit/rest';
const octo = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

export const data = new SlashCommandBuilder()
  .setName('discussongithub')
  .setDescription('Move this thread to GitHub')
  .setDMPermission(false);

export async function execute(interaction) {
  // only in threads
  if (!interaction.channel.isThread()) {
    return interaction.reply({ content: 'Use this inside a thread.', ephemeral: true });
  }
  // role check
  if (!interaction.member.roles.cache.some(r => r.name === 'maintainer')) {
    return interaction.reply({ content: 'Only maintainers may do this.', ephemeral: true });
  }

  await interaction.deferReply();
  // fetch messages
  const msgs = await interaction.channel.messages.fetch({ limit: 100 });
  const body = msgs
    .map(m => `**${m.author.tag}**: ${m.content}`)
    .reverse()
    .join('\n\n');

  // create GitHub Discussion (or issue)
  const gh = await octo.discussions.create({
    owner, repo,
    category_id: /* fetch your category ID ahead of time */,
    title: interaction.channel.name,
    body
  });

  // archive & tag thread
  await interaction.channel.setArchived(true);
  await interaction.channel.send({ content: `Moved to GitHub: ${gh.data.html_url}` });
  await interaction.editReply('✅ Thread moved and archived.');
}
