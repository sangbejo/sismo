import readline from "readline";
import axios from "axios";
import { getAllReposOnRepoPageQuery, getTotalRepoCountQuery } from "./queries";
import { GitPoapEvent, GitPoapRepo } from "./types";
import { GraphQLProvider } from "@group-generators/helpers/data-providers/graphql";

export class GitPoapProvider extends GraphQLProvider {
  url: string;

  constructor() {
    super({ url: "https://api.gitpoap.io/graphql" });
    this.url = "https://public-api.gitpoap.io/";
  }

  public async getAllRepos(): Promise<string[]> {
    const allGitHubRepos: string[] = [];
    for await (const repo of this._fetchAllRepos()) {
      allGitHubRepos.push(`${repo.organization.name}/${repo.name}`);
    }
    return allGitHubRepos;
  }

  private async *_fetchAllRepos(): AsyncGenerator<
    GitPoapRepo,
    void,
    undefined
  > {
    let downloadNumber = 0;
    let pageNumber = 1;
    const perPage = 100;
    let gitPoapRepos: GitPoapRepo[] = [];

    do {
      const res = await getAllReposOnRepoPageQuery(this, pageNumber, perPage);
      gitPoapRepos = res.allRepos;
      for (const repo of gitPoapRepos) {
        yield repo;
        downloadNumber++;
      }
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`downloading GitPoap repos... (${downloadNumber})`);
      pageNumber++;
    } while (gitPoapRepos.length === perPage);
  }

  public async getEvents(): Promise<GitPoapEvent[]> {
    const res = await axios({
      url: `${this.url}v1/gitpoaps/events`,
      method: "get",
    }).catch((error) => {
      console.log(error);
      throw new Error("Error while fetching GitPoap API");
    });

    const gitPoapEvents: GitPoapEvent[] = res.data;
    return gitPoapEvents;
  }

  public async getTotalRepoCount(): Promise<number> {
    const res = await getTotalRepoCountQuery(this);
    return res.aggregateRepo._count.id;
  }
}
