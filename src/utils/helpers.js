import axios from "axios";

const config = {
  headers: {
    "X-Cg-Pro-Api-Key": "CG-nguZHRFas4tyUdHhPHwVgN9T", //api key
  },
};

export const toFixed = (num, fixed) => {
  // eslint-disable-next-line no-useless-escape
  let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (fixed || -1) + `})?`);
  return num.toString().match(re)[0];
};

export const tokenPrices = async (tokens) => {
  const prices = {};

  if (tokens.includes("wonderland")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=wonderland&vs_currencies=usd",
      config
    );
    prices["wonderland"] = data.wonderland.usd;
  }

  if (tokens.includes("convex-finance")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=convex-finance&vs_currencies=usd",
      config
    );
    prices["convex-finance"] = data["convex-finance"].usd;
  }

  if (tokens.includes("curve-dao-token")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=curve-dao-token&vs_currencies=usd",
      config
    );
    prices["curve-dao-token"] = data["curve-dao-token"].usd;
  }

  if (tokens.includes("uop")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=utopia-genesis-foundation&vs_currencies=usd",
      config
    );
    prices["uop"] = data["utopia-genesis-foundation"].usd;
  }

  if (tokens.includes("uop")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=utopia-genesis-foundation&vs_currencies=usd",
      config
    );
    prices["uop"] = data["utopia-genesis-foundation"].usd;
  }

  if (tokens.includes("weth")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd",
      config
    );
    prices["weth"] = data.weth.usd;
  }

  if (tokens.includes("olympus")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=olympus&vs_currencies=usd",
      config
    );
    prices["olympus"] = data.olympus.usd;
  }

  if (tokens.includes("sushi")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=sushi&vs_currencies=usd",
      config
    );
    prices["sushi"] = data.sushi.usd;
  }

  if (tokens.includes("ice")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=ice-token&vs_currencies=usd",
      config
    );

    prices["ice"] = data["ice-token"].usd;
  }

  if (tokens.includes("spell")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=spell-token&vs_currencies=usd",
      config
    );

    prices["spell"] = data["spell-token"].usd;
  }

  if (tokens.includes("mim")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=magic-internet-money&vs_currencies=usd",
      config
    );

    prices["mim"] = data["magic-internet-money"].usd;
  }

  if (tokens.includes("staker")) {
    const { data } = await axios.get(
      "https://pro-api.coingecko.com/api/v3/simple/price?ids=ellipsis&vs_currencies=usd",
      config
    );

    prices["staker"] = data.ellipsis.usd;
  }

  return prices;
};
