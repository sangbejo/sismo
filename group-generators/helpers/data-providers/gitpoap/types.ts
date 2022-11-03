export type GitPoapEvent = {
  name: string;
  gitPoapEventId: number;
  poapEventId: number;
  poapEventFancyId: string;
  year: number;
  description: string;
  imageUrl: string;
  repositories: string[];
  mintedCount: number;
};

export type TotalRepoCountType = {
  aggregateRepo: {
    _count: {
      id: number;
    };
  };
};

export type AllReposOnRepoPageType = {
  allRepos: GitPoapRepo[];
};

export type GitPoapRepo = {
  id: number;
  name: string;
  githubRepoId: number;
  organization: {
    name: string;
  };
  project: {
    gitPoaps: { id: number }[];
  };
};
