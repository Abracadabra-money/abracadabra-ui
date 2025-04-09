import type { Address } from "viem";
import { formatToFixed } from "@/helpers/filters";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const subgraphUrl =
  "https://api.goldsky.com/api/public/project_clpx84oel0al201r78jsl0r3i/subgraphs/kodiak-v3-berachain-mainnet/latest/gn";

type ResponseData = {
  data: {
    kodiakVault: {
      id: string;
      apr: {
        averageApr: string;
      };
    };
  };
  loading: boolean;
  networkStatus: number;
};

export const getKodiakIslandsVaultById = async (id: Address) => {
  try {
    const graphClient = new ApolloClient({
      uri: subgraphUrl,
      cache: new InMemoryCache(),
    });

    const query = gql`
            {
              kodiakVault(id: "${id}") {
                id
                apr {
                  averageApr
                }
              }
            }
          `;

    const { data }: ResponseData = await graphClient.query({
      query: query,
      fetchPolicy: "no-cache",
    });

    return formatToFixed(data.kodiakVault.apr.averageApr, 2);
  } catch (error) {
    console.log("GetKodiakIslandsValutById Error:", error);
    return "0.00";
  }
};
