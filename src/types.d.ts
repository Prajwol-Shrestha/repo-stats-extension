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
    files: number;
    folders: number;
    sizeKB: number;
    truncated: boolean;
  };
  error?: string;
  statusCode?: number;
};
