import axios from "axios";
import { getGraphUrl } from "./getGraphUrl";

type Chain = { name: string; id: number };

export const queryMethods = {
  VALUE_LOCKED: "totalValueLockedUsd",
  FEES_GENERATED: "totalFeesGenerated",
  MIM_BORROWED: "totalMimBorrowed",
  BORROWING_FEES: "borrowFeesGenerated",
  INTEREST_FEES: "interestFeesGenerated",
  LIQUIDATION_FEES: "liquidationFeesGenerated",
};

const chains: Chain[] = [
  { name: "Ethereum", id: 1 },
  { name: "Optimism", id: 10 },
  { name: "Fantom", id: 250 },
  { name: "Arbitrum", id: 42161 },
  { name: "Avalanche", id: 43114 },
];

export const getTotal = (cauldronsData: any, queryMethod: string) => {
  let total = 0;

  cauldronsData.forEach((network: any) => {
    network.data.map((cauldron: any) => (total += +cauldron[queryMethod]));
  });

  return total;
};

export const getByChain = async (queryMethod: string) => {
  const query = `{
  protocols {
    ${queryMethod}
  }
}`;

  const totalByChain = await Promise.all(
    chains.map(async (chain: Chain) => {
      const { data } = await axios.post(getGraphUrl(chain.id), { query });
      return {
        value: +data.data.protocols[0][queryMethod],
        name: chain.name,
      };
    })
  );

  return totalByChain;
};

export const getByCauldron = async (queryMethod: string) => {
  const query = `{
    cauldrons {
      ${queryMethod}
      name
    }
  }`;

  const byCauldron = await Promise.all(
    chains.map(async (chain: Chain) => {
      const { data } = await axios.post(getGraphUrl(chain.id), { query });
      return data.data.cauldrons
        .filter((cauldron: any) => +cauldron[queryMethod] > 0)
        .map((cauldron: any) => {
          return { value: +cauldron[queryMethod], name: cauldron.name };
        });
    })
  );

  return byCauldron.flat();
};

export const getFeesByCategory = async () => {
  const query = `{
        protocols {
          totalFeesGenerated
          borrowFeesGenerated
          interestFeesGenerated
          liquidationFeesGenerated
        }
      }`;

  let feesByCategory = [
    { name: "borrowFees", value: 0 },
    { name: "interestFees", value: 0 },
    { name: "liquidationFees", value: 0 },
    { name: "unregisteredFees", value: 0 },
  ];

  await Promise.all(
    chains.map(async (chain: Chain) => {
      const { data } = await axios.post(getGraphUrl(chain.id), { query });
      const {
        borrowFeesGenerated,
        interestFeesGenerated,
        liquidationFeesGenerated,
        totalFeesGenerated,
      } = data.data.protocols[0];
      const unregisteredFees =
        +totalFeesGenerated -
        +borrowFeesGenerated -
        +interestFeesGenerated -
        +liquidationFeesGenerated;

      feesByCategory[0].value += +borrowFeesGenerated;
      feesByCategory[1].value += +interestFeesGenerated;
      feesByCategory[2].value += +liquidationFeesGenerated;
      feesByCategory[3].value += +unregisteredFees;
    })
  );

  return feesByCategory;
};
