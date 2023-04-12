import axios from "axios";

const grapthUrls = {
  1: "abra-test-mainnet/v0.0.1",
  42161: "abta-test-arbitrum/v0.0.2",
  43114: "abra-test-avalanche/v0.0.2",
};

const getMagicGlpTotalRewards = async (chainId) => {
  const url = `https://api.studio.thegraph.com/query/4540/${grapthUrls[chainId]}`;

  const id =
    +chainId === 42161
      ? "0x588d402c868add9053f8f0098c2dc3443c991d17"
      : "0x5efc10c353fa30c5758037fdf0a233e971ecc2e0";

  const query = `{
    magicGlp(id: "${id}") {
        totalRewards
    }
}`;

  const { data } = await axios.default.post(url, { query });

  return data.data.magicGlp?.totalRewards || 0;
};

export { getMagicGlpTotalRewards };
