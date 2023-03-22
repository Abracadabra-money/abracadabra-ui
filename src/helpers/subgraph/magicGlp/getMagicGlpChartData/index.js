const moment = require("moment");
const getGlpData = require("./get-glp-data");
const getFeesData = require("./get-fees-data");
const getGlpPerformanceData = require("./get-glp-performance-data");

const getMagicGlpChartData = async (chainId, month = 3) => {
  const pastMonth = moment().subtract(month, "month").toDate();
  const pastDay = moment().subtract(1, "day").toDate();
  const groupPeriod = 86400;

  const from = Math.floor(+new Date(pastMonth) / 1000);
  const to = Math.floor(new Date(pastDay) / 1000);

  const params = { from, to, groupPeriod, chainId };

  const glpData = await getGlpData(params);
  const feesData = await getFeesData(params);

  return await getGlpPerformanceData(glpData, feesData, params);
};

export { getMagicGlpChartData };
