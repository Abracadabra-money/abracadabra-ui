export const getTotal = (cauldronsData: any, queryMethod: string) => {
  let total = 0;

  cauldronsData.forEach((network: any) => {
    network.data.map((cauldron: any) => (total += +cauldron[queryMethod]));
  });

  return total;
};
