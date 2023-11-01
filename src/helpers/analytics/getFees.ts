export const getFees = (cauldronsData: any, queryMethod: string) => {
  let total = 0;

  cauldronsData.forEach((network: any) => {
    network.data.map((cauldron: any) => {
      cauldron.dailySnapshots.map(
        (snapShot: any) => (total += +snapShot[queryMethod])
      );
    });
  });

  return total;
};
