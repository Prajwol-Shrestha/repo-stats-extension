chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "GET_REPO_STATS") return;

  (async () => {
    try {
      const { owner, repo } = message.payload;

      const repoRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
      );
      if (!repoRes.ok) {
        sendResponse({
          status: "error",
          statusCode: repoRes.status,
        });
        return;
      }

      const repoData = await repoRes.json();
      const sizeKB = repoData.size;
      const branch = repoData.default_branch;

      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      );
      if (!treeRes.ok) throw new Error("Failed to fetch repo tree");

      const treeData = await treeRes.json();

      let filesCount = 0;
      let folderCount = 0;

      for (const item of treeData.tree ?? []) {
        if (item.type === "blob") filesCount++;
        if (item.type === "tree") folderCount++;
      }

      sendResponse({
        status: "success",
        data: {
          filesCount,
          folderCount,
          sizeKB,
          truncated: Boolean(treeData.truncated),
        },
      });
    } catch (err) {
      sendResponse({
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  })();

  return true;
});
