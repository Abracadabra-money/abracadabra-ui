import merkleProof from "./merkleProof.json";

export const checkAccount = (account: string): boolean => {
  const isAbleToMigrate = merkleProof.items.find(
    (item) => item.account.toLowerCase() === account.toLowerCase()
  );
  return !!isAbleToMigrate;
};
