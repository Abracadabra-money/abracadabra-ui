import type { Address } from "viem";
import { formatToFixed } from "@/helpers/filters";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const subgraphUrl = "https://api.berachain.com/";

type ResponseData = {
  data: {
    polGetRewardVault: {
      dynamicData: {
        apr: string;
      };
    };
  };
  loading: boolean;
  networkStatus: number;
};

export const getBerachainValutById = async (id: Address) => {
  try {
    const graphClient = new ApolloClient({
      uri: subgraphUrl,
      cache: new InMemoryCache(),
    });

    const query = gql`
      {
        polGetRewardVault(
          chain: BERACHAIN
          vaultAddress: "${id}"
        ) {
          dynamicData {
            apr
          }
        }
      }
    `;

    const { data }: ResponseData = await graphClient.query({
      query: query,
      fetchPolicy: "no-cache",
    });

    const apr = Number(data.polGetRewardVault.dynamicData.apr);
    return formatToFixed(apr * 100, 2);
  } catch (error) {
    console.log("GetBerachainValutById Error:", error);
    return "0.00";
  }
};
