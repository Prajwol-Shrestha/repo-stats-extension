export type RepoStatsRequest = {
  type: "CALCULATE_REPO_STATS";
  payload: {
    owner: string;
    repo: string;
  };
};

export type RepoStatsResponse = {
  status: "loading" | "success" | "error";
  data?: {
    filesCount: number;
    folderCount: number;
    sizeKB: number;
    truncated: boolean;
  };
  error?: string;
  statusCode?: number;
};
