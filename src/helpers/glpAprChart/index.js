const moment = require("moment");
const getGlpData = require("./helpers/get-glp-data");
const getFeesData = require("./helpers/get-fees-data");
const getGlpPerformanceData = require("./helpers/get-glp-performance-data");

const getGlpChartApr = async (month = 3) => {
  const pastMonths = moment().subtract(month, "month").toDate();
  const pastDay = moment().subtract(1, "day").toDate();
  const groupPeriod = 86400;

  const from = Math.floor(+new Date(pastMonths) / 1000);
  const to = Math.floor(new Date(pastDay) / 1000);

  const params = { from, to, groupPeriod };

  const glpData = await getGlpData(params);
  const feesData = await getFeesData(params);

  return await getGlpPerformanceData(glpData, feesData, params);
};

const getGlpApy = async () => {
  const pastMonths = moment().subtract(1, "day").toDate();
  const groupPeriod = 86400;

  const from = Math.floor(+new Date(pastMonths) / 1000);
  const to = Math.floor(Date.now() / 1000);

  const params = { from, to, groupPeriod };

  const glpData = await getGlpData(params);
  const feesData = await getFeesData(params);

  const data = await getGlpPerformanceData(glpData, feesData, params);
  return data[0].glpApr;
};

export { getGlpChartApr, getGlpApy };
