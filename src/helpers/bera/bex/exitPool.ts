import { BERA_CHAIN_ID } from "@/constants/global";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import {
  type Address,
  encodeAbiParameters,
  parseAbi,
  keccak256,
  parseAbiParameters,
  numberToHex,
} from "viem";

import BexWeightedPoolAbi from "@/abis/tokensAbi/WeightedPool";

const BALANCE_STORAGE_SLOT = 0n;
const ALLOWANCE_STORAGE_SLOT = 1n;

import { BALANSER_QUERIES_ADDRESS } from "./constants";
import BalancerQueriesAbi from "@/abis/BalancerQueries";

const vaultAbi = parseAbi([
  "function getPoolTokens(bytes32 poolId) view returns (address[] tokens, uint256[] balances, uint256 lastChangeBlock)",
  "function queryExit(bytes32 poolId, address sender, address recipient, (address[] assets, uint256[] minAmountsOut, bytes userData, bool toInternalBalance) request) nonpayable",
]);

const exitPool = async (
  lpAddress: Address,
  amount: bigint,
  account: Address
) => {
  const publicClient = getPublicClient(BERA_CHAIN_ID);

  const [poolId, vault] = await publicClient.multicall({
    contracts: [
      {
        address: lpAddress,
        abi: BexWeightedPoolAbi,
        functionName: "getPoolId",
        args: [],
      },
      {
        address: lpAddress,
        abi: BexWeightedPoolAbi,
        functionName: "getVault",
        args: [],
      },
    ],
  });

  console.log("[exitPool] poolId: ", poolId);
  console.log("[exitPool] vault: ", vault);

  const poolTokens = await publicClient.readContract({
    address: vault.result,
    abi: vaultAbi,
    functionName: "getPoolTokens",
    args: [poolId.result],
  });
  console.log("[exitPool] poolTokens: ", poolTokens);

  const exitKind = 1n; // EXACT_LP_IN_FOR_TOKENS_OUT

  const userData = encodeAbiParameters(parseAbiParameters("uint256, uint256"), [
    exitKind,
    amount,
  ]);

  console.log("[exitPool] userData: ", userData);

  const assets = poolTokens[0];

  const exitPoolArgs = {
    poolId: poolId.result,
    sender: account,
    recipient: account,
    request: {
      assets,
      minAmountsOut: [0n, 0n],
      userData,
      toInternalBalance: false,
    },
  };

  console.log("[exitPool] exitPoolArgs: ", exitPoolArgs);

  const stateOverride = [
    {
      address: lpAddress,
      stateDiff: [
        {
          slot: getBalanceSlot(account),
          value: numberToHex(amount, { size: 32 }),
        },
        {
          slot: getAllowanceSlot(account, vault.result),
          value: numberToHex(amount, { size: 32 }),
        },
      ],
    },
  ];

  console.log("[exitPool] stateOverride: ", stateOverride);

  const tx = await publicClient.simulateContract({
    account: account,
    address: BALANSER_QUERIES_ADDRESS,
    abi: BalancerQueriesAbi,
    functionName: "queryExit",
    args: [
      exitPoolArgs.poolId,
      exitPoolArgs.sender,
      exitPoolArgs.recipient,
      [
        exitPoolArgs.request.assets,
        exitPoolArgs.request.minAmountsOut,
        exitPoolArgs.request.userData,
        exitPoolArgs.request.toInternalBalance,
      ],
    ],
    stateOverride,
  });

  console.log("[exitPool] tx: ", tx);

  const [token0AmountOut, token1AmountOut] = tx.result[1];

  return {
    token0Address: assets[0],
    token1Address: assets[1],
    token0AmountOut,
    token1AmountOut,
  };
};

const getBalanceSlot = (account: Address): `0x${string}` => {
  return keccak256(
    encodeAbiParameters(parseAbiParameters("address, uint256"), [
      account,
      BALANCE_STORAGE_SLOT,
    ])
  );
};

const getAllowanceSlot = (owner: Address, spender: Address): `0x${string}` => {
  const ownerSlot = keccak256(
    encodeAbiParameters(parseAbiParameters("address, uint256"), [
      owner,
      ALLOWANCE_STORAGE_SLOT,
    ])
  );

  return keccak256(
    encodeAbiParameters(parseAbiParameters("address, uint256"), [
      spender,
      //@ts-ignore
      ownerSlot,
    ])
  );
};

export default exitPool;
