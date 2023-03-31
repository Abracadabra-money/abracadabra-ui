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
  MagicGlpHarvestorAddress
} from "./constants";

const provider = new providers.StaticJsonRpcProvider(rpc);

module.exports.getGlpManagerContract = () =>
  new Contract(glpManagerAddress, GlpManager.abi, provider);
module.exports.getRewardReaderContract = () =>
  new Contract(rewardReaderAddress, RewardReader.abi, provider);
module.exports.getReaderContract = () =>
  new Contract(readerAddress, ReaderV2.abi, provider);
module.exports.getPoolContract = () =>
  new Contract(uniswapGmxEthPool, UniPool.abi, provider);
module.exports.getVaultContract = () =>
  new Contract(vault, Vault.abi, provider);
module.exports.getGmxGlpWrapperContract = () =>
  new Contract(GmxGlpWrapperAddress, AbraWsGlp.abi, provider);
  module.exports.getMagicGlpHarvestorContract = () =>
  new Contract(MagicGlpHarvestorAddress, MagicGlpHarvestor.abi, provider);
