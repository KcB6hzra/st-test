import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

(async () => {
  const pat = localStorage.pat;

  if (await sha256(pat) === 'ec66af468346007b6318e1589477dd79a8eb13a51d0d7f467b2113a287d13349') {
    window.octokit = new Octokit({ auth: localStorage.pat });
    window.save = save;
  }

  async function sha256(text) {
    const bytes  = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('');
  }

  async function base64encode(text) {
    const bytes = new TextEncoder().encode(text);
    const binaryString = Array.from(bytes, byte => String.fromCodePoint(byte)).join('');
    return btoa(binaryString);
  }

  async function save(octokit, path, content) {
    const OWNER = 'KcB6hzra';
    const REPO = 'test-storage';
    const COMMITTER_NAME = 'KcB6hzra Website';
    const COMMITTER_EMAIL = '176685668+KcB6hzra@users.noreply.github.com';

    const contentEncoded = base64encode(content);

    const file = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path,
    });

    console.log(`file: ${file}`);

    const { sha } = file.data;

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path,
      message: 'Update from website',
      content: contentEncoded,
      committer: {
        name: COMMITTER_NAME,
        email: COMMITTER_EMAIL,
      },
      author: {
        name: COMMITTER_NAME,
        email: COMMITTER_EMAIL,
      },
    });

    console.log(`data: ${data}`);
  }
})();




