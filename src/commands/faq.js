import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import faqData from '../../data/faq.json';

export const data = new SlashCommandBuilder()
  .setName('faq')
  .setDescription('Choose a frequently asked question');

export async function execute(interaction) {
  const options = faqData.map((f, idx) => ({
    label: f.question.slice(0, 25),
    value: idx.toString()
  }));
  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('faq-select')
      .setPlaceholder('Select a question')
      .addOptions(options)
  );

  await interaction.reply({ content: 'What do you want to know?', components: [row] });
}

// then elsewhere, listen for selectmenu interactions:
import { Client } from 'discord.js';
client.on('interactionCreate', async intr => {
  if (!intr.isStringSelectMenu()) return;
  if (intr.customId !== 'faq-select') return;
  const idx = parseInt(intr.values[0], 10);
  const answer = faqData[idx].answer;
  await intr.update({ content: answer, components: [] });
});
