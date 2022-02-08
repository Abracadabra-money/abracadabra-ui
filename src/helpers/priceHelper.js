import axios from "axios";

export const tokenPrices = async (tokens) => {
  const prices = {};

  if (tokens.includes("uop")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=utopia-genesis-foundation&vs_currencies=usd"
    );

    prices["uop"] = data["utopia-genesis-foundation"].usd;
  }

  if (tokens.includes("weth")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd"
    );
    prices["weth"] = data.weth.usd;
  }

  if (tokens.includes("sushi")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=sushi&vs_currencies=usd"
    );
    prices["sushi"] = data.sushi.usd;
  }

  if (tokens.includes("ice")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ice-token&vs_currencies=usd"
    );

    prices["ice"] = data["ice-token"].usd;
  }

  if (tokens.includes("staker")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ellipsis&vs_currencies=usd"
    );

    prices["staker"] = data.ellipsis.usd;
  }

  if (tokens.includes("mim")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=mim&vs_currencies=usd"
    );

    prices["mim"] = data["mim"].usd;
  }

  return prices;
};
