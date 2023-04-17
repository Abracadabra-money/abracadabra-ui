import { providers, Contract } from "ethers";
import { rpc } from "./constants";

import GlpManager from "./abis/GlpManager.json";
import RewardReader from "./abis/RewardReader.json";
import ReaderV2 from "./abis/ReaderV2.json";
import UniPool from "./abis/UniPool.json";
import Vault from "./abis/Vault.json";
import AbraWsGlp from "./abis/AbraWsGlp.json";
import MagicGlpHarvestor from "./abis/MagicGlpHarvestor.json";

import {
  glpManagerAddress,
  rewardReaderAddress,
  readerAddress,
  uniswapGmxEthPool,
  vault,
  GmxGlpWrapperAddress,
  MagicGlpHarvestorAddress,
} from "./constants";

const provider = new providers.StaticJsonRpcProvider(rpc);

export const getGlpManagerContract = () =>
  new Contract(glpManagerAddress, GlpManager.abi, provider);
export const getRewardReaderContract = () =>
  new Contract(rewardReaderAddress, RewardReader.abi, provider);
export const getReaderContract = () =>
  new Contract(readerAddress, ReaderV2.abi, provider);
export const getPoolContract = () =>
  new Contract(uniswapGmxEthPool, UniPool.abi, provider);
export const getVaultContract = () => new Contract(vault, Vault.abi, provider);
export const getGmxGlpWrapperContract = () =>
  new Contract(GmxGlpWrapperAddress, AbraWsGlp.abi, provider);
export const getMagicGlpHarvestorContract = () =>
  new Contract(MagicGlpHarvestorAddress, MagicGlpHarvestor.abi, provider);
