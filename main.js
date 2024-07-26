import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest';

(async () => {
  const OWNER = 'KcB6hzra';
  const REPO = 'test-storage';
  const COMMITTER = {
    name: 'KcB6hzra Website',
    email: '176685668+KcB6hzra@users.noreply.github.com',
  };

  const pat = localStorage.test_storage_pat;

  if (await sha256(pat) === 'ec66af468346007b6318e1589477dd79a8eb13a51d0d7f467b2113a287d13349') {
    window.octokit = new Octokit({ auth: pat });
    window.save = save;
  }

  async function sha256(text) {
    const bytes  = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function base64encode(text) {
    const bytes = new TextEncoder().encode(text);
    const binaryString = Array.from(bytes, byte => String.fromCodePoint(byte)).join('');
    return btoa(binaryString);
  }

  async function save(octokit, path, content) {
    const contentEncoded = base64encode(content);
    console.log(`contentEncoded: ${contentEncoded}`);
    const sha = await getFileHash(octokit, path);
    console.log(`sha: ${sha}`);
    const result = await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path,
      sha,
      message: 'Update from website',
      content: contentEncoded,
      committer: COMMITTER,
      author: COMMITTER,
    });
    console.log(`result: ${result}`);
  }

  async function getFileHash(octokit, path) {
    try {
      const file = await octokit.rest.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path,
      });
      console.log(`file: ${file}`);
      return file.data;
    } catch (e) {
      console.log(e);
      return void 0;
    }
  }
})();
