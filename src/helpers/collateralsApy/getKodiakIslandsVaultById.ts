import axios from "axios";
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

export const getKodiakIslandsVaultById = async (id: string) => {
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
    return await getKodiakIslandsApr(id);
  }
};

const getKodiakIslandsApr = async (id: string) => {
  try {
    const { data } = await axios.get(
      `https://backend.kodiak.finance/vaults/${id}`
    );

    return data.apr;
  } catch (error) {
    console.log("Error fetch Kodiak Islands APR:", error);
    return "0.00";
  }
};
