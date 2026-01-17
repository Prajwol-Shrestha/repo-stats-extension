import type { RepoStatsResponse } from "./types";
import { prettifySize } from "./utils";

function parseRepoFromUrl(url: string) {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const state = document.getElementById("state")!;
  const result = document.getElementById("result")!;
  const error = document.getElementById("error")!;

  const tab = tabs[0];
  if (!tab?.url) {
    state.textContent = "No active tab.";
    return;
  }

  const repo = parseRepoFromUrl(tab.url);
  if (!repo) {
    state.textContent = "Open a GitHub repository to view stats.";
    return;
  }

  chrome.runtime.sendMessage(
    {
      type: "GET_REPO_STATS",
      payload: repo,
    },
    (response: RepoStatsResponse) => {
      const { status, statusCode, error: errorMessage, data } = response;
      if (status === "loading") {
        return (state.textContent = "Loading…");
      }

      if (status === "error") {
        if (statusCode === 404) {
          return (error.textContent = "Repository not found.");
        }
        if (statusCode === 403) {
          return (error.textContent = "API rate limit exceeded.");
        }
        if (statusCode === 401) {
          return (error.textContent =
            "This repository is private. This extension can only analyze public repositories.");
        }
        return (error.textContent = errorMessage || "Something went wrong!");
      }
      if (!data && !error) {
        return (state.textContent = "Something went wrong!");
      }
      if (data) {
        state.hidden = false;

        const { files, folders, truncated, sizeKB } = data;
        const isTruncated = truncated;

        document.getElementById("files")!.textContent =
          `${files}${isTruncated && "+"}`;
        document.getElementById("folders")!.textContent =
          `${folders}${isTruncated && "+"}`;
        document.getElementById("size")!.textContent =
          `${prettifySize(sizeKB)}`;

        document.getElementById("warning")!.hidden = !isTruncated; // incase of large repos.. API returns truncated true.. so insuch case we can't show full details

        result.hidden = false;
      }
    },
  );
});
