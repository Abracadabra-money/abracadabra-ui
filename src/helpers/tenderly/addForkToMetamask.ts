import { toHex } from "viem";
import { TENDERLY_FORK_URL } from "@/constants/tenderly";

const chainHelper = {
  1: {
    label: "Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://etherscan.io/"],
  },
};

export const addForkToMetamask = async (forkData: any) => {
  try {
    const { forkChainId, forkId } = forkData;
    const { nativeCurrency, blockExplorerUrls, label } =
      chainHelper[forkChainId as keyof typeof chainHelper];

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: toHex(forkChainId),
          rpcUrls: [`${TENDERLY_FORK_URL}${forkId}`],
          chainName: `Fork (${label}) - ${forkId}`,
          nativeCurrency,
          blockExplorerUrls,
        },
      ],
    });
  } catch (error) {
    console.log("Add Fork To Metamask Error:", error);
  }
};
