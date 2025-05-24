import supportMap from '../../data/supportKeywords.json';

export async function handleSupport(msg) {
  const text = msg.content.toLowerCase();
  for (const { keywords, response } of supportMap) {
    if (keywords.some(k => text.includes(k))) {
      return msg.reply(response);
    }
  }
}