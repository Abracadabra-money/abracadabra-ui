import { providers, Contract } from "ethers";
import {
  rewardReaderAddress,
  glpManagerAddress,
  traderJoeGmxAvaxPool,
  chainLinkAvaxAddress,
  vault,
  readerAddress,
  MagicGlpHarvestorAddress,
} from "./constants";
import RewardReader from "./abi/RewardReader.json";
import GlpManager from "./abi/GlpManager.json";
import JoePair from "./abi/JoePair.json";
import chainLinkAvax from "./abi/chainLinkAvax.json";
import Vault from "./abi/Vault.json";
import ReaderV2 from "./abi/ReaderV2.json";
import MagicGlpHarvestor from "./abi/MagicGlpHarvestor.json";

import { rpc } from "./constants";

const provider = new providers.StaticJsonRpcProvider(rpc);

export const getRewardReaderContract = () =>
  new Contract(rewardReaderAddress, RewardReader.abi, provider);

export const getGlpManagerContract = () =>
  new Contract(glpManagerAddress, GlpManager.abi, provider);

export const getPoolContract = () =>
  new Contract(traderJoeGmxAvaxPool, JoePair.abi, provider);

export const getChainLinkAvaxContract = () =>
  new Contract(chainLinkAvaxAddress, chainLinkAvax.abi, provider);

export const getVaultContract = () =>
  new Contract(vault, Vault.abi, provider);

export const getReaderContract = () =>
  new Contract(readerAddress, ReaderV2.abi, provider);

export const getMagicGlpHarvestorContract = () =>
  new Contract(MagicGlpHarvestorAddress, MagicGlpHarvestor.abi, provider);
