import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export const createRandomAccount = () => {
    const privateKey = generatePrivateKey();
    return privateKeyToAccount(privateKey);
}

export const getRandomWalletAddress = () => {
    return createRandomAccount().address;
}