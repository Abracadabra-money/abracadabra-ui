import axios from "axios";

const getOhmApy = async () => {
  try {
    const response = await axios({
      url: "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        query: `
              query {
                _meta {
                  block {
                    number
                  }
                }
                protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
                  currentAPY
                }
              }
            `,
      }),
    });

    if (response.data?.data?.protocolMetrics?.[0].currentAPY) {
      return +response.data?.data?.protocolMetrics?.[0].currentAPY;
    }

    return false;
  } catch (e) {
    console.log("fetchOHMApy error:", e);
    return false;
  }
};

export { getOhmApy };
