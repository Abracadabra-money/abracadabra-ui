const CONTRACT_ABI = [
  {
    inputs: [],
    name: "feePercent",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
];

export const getFeePercent = async (
  config: any,
  chainId: number,
  publicClient: any
) => {
  if (chainId === 42161 && config.id === 2) {
    return await publicClient.readContract({
      address: config.collateralInfo.address,
      abi: CONTRACT_ABI,
      functionName: "feePercent",
      args: [],
    });
  }

  return null;
};
