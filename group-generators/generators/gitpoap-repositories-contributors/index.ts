import { dataProviders } from "@group-generators/helpers/data-providers";
import { Tags, ValueType, GroupWithData, AccountSource } from "topics/group";
import {
  GenerationContext,
  GenerationFrequency,
  GroupGenerator,
} from "topics/group-generator";

const generator: GroupGenerator = {
  generationFrequency: GenerationFrequency.Daily,

  generate: async (context: GenerationContext): Promise<GroupWithData[]> => {
    const gitPoapProvider = new dataProviders.GitPoapProvider();
    const githubProvider = new dataProviders.GithubProvider();

    const allGitPoapRepos = await gitPoapProvider.getAllRepos();

    const allContributors = await githubProvider.getRepositoriesContributors(
      allGitPoapRepos,
      { getOrganizationMembers: false }
    );

    return [
      {
        name: "gitpoap-repositories-contributors",
        timestamp: context.timestamp,
        data: allContributors,
        accountSources: [AccountSource.GITHUB],
        valueType: ValueType.Score,
        tags: [Tags.User, Tags.POAP],
      },
    ];
  },
};

export default generator;
