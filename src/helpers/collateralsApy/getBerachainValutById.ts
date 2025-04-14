import type { Address } from "viem";
import { formatToFixed } from "@/helpers/filters";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const WETH_WBERA_ID =
  "0xdd70a5ef7d8cfe5c5134b5f9874b09fb5ce812b4000200000000000000000003";
const WBTC_WBERA_ID =
  "0x38fdd999fe8783037db1bbfe465759e312f2d809000200000000000000000004";

const poolIds = {
  2: WETH_WBERA_ID,
  3: WBTC_WBERA_ID,
};

const subgraphUrl = "https://api.berachain.com/";

type AprItem = {
  apr: string;
  type: string;
  id: string;
};

type DynamicData = {
  isPaused: boolean;
  aprItems: AprItem[];
};

type ResponseData = {
  data: {
    poolGetPool: {
      dynamicData: DynamicData;
    };
  };
  loading: boolean;
  networkStatus: number;
};

export const getBerachainValutById = async (cauldronId: number) => {
  try {
    const graphClient = new ApolloClient({
      uri: subgraphUrl,
      cache: new InMemoryCache(),
    });

    const query = gql`
      query GetPool($id: String!, $userAddress: String, $chain: GqlChain!) {
        poolGetPool(id: $id, userAddress: $userAddress, chain: $chain) {
          dynamicData {
            isPaused
            aprItems {
              apr
              type
              id
            }
          }
        }
      }
    `;

    const variables = {
      chain: "BERACHAIN",
      id: poolIds[cauldronId as keyof typeof poolIds],
    };

    const { data }: ResponseData = await graphClient.query({
      query: query,
      fetchPolicy: "no-cache",
      variables,
    });

    const apr = Number(data.poolGetPool.dynamicData.aprItems[0].apr);
    return formatToFixed(apr * 100, 2);
  } catch (error) {
    console.log("GetBerachainValutById Error:", error);
    return "0.00";
  }
};
