import { Octokit } from '@octokit/rest';
const octo = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoOwner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

export async function handleIdea(msg) {
  const keywords = msg.content
    .toLowerCase()
    .match(/\b\w{4,}\b/g)
    .slice(0, 10);
  // GitHub Discussions search endpoint
  const q = keywords.map(k => `${k} in:body repo:${repoOwner}/${repo}`).join('+');
  const res = await octo.search.issuesAndPullRequests({ q });
  if (res.data.total_count > 0) {
    const links = res.data.items.slice(0, 5)
      .map(d => `- [${d.title}](${d.html_url})`)
      .join('\n');
    return msg.reply(
      `I found similar topics on our GitHub Discussions—please check if any match your idea:\n${links}`
    );
  }
}
