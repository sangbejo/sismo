import { gql } from "graphql-request";
import { AllReposOnRepoPageType, TotalRepoCountType } from "./types";
import { GraphQLProvider } from "@group-generators/helpers/data-providers/graphql";

export const getTotalRepoCountQuery = async (
  graphqlProvider: GraphQLProvider
): Promise<TotalRepoCountType> => {
  return graphqlProvider.query<TotalRepoCountType>(gql`
    query totalRepoCount {
      aggregateRepo {
        _count {
          id
        }
      }
    }
  `);
};

export const getAllReposOnRepoPageQuery = async (
  graphQLProvider: GraphQLProvider,
  pageNumber: number,
  perPage: number
): Promise<AllReposOnRepoPageType> => {
  return graphQLProvider.query<AllReposOnRepoPageType>(
    gql`
      query allReposOnRepoPage($sort: String, $page: Float, $perPage: Float) {
        allRepos(sort: $sort, page: $page, perPage: $perPage) {
          id
          name
          githubRepoId
          organization {
            name
          }
          project {
            gitPOAPs {
              id
            }
          }
        }
      }
    `,
    {
      page: pageNumber,
      perPage,
      sort: "gitpoap-count",
    }
  );
};
