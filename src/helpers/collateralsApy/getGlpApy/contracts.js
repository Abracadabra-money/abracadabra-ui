const { providers, Contract } = require("ethers");
const { rpc } = require("./constants");

const GlpManager = require("./abis/GlpManager.json");
const RewardReader = require("./abis/RewardReader.json");
const ReaderV2 = require("./abis/ReaderV2.json");
const UniPool = require("./abis/UniPool.json");
const Vault = require("./abis/Vault.json");
const AbraWsGlp = require("./abis/AbraWsGlp.json");
const MagicGlpHarvestor = require("./abis/MagicGlpHarvestor.json");

const {
  glpManagerAddress,
  rewardReaderAddress,
  readerAddress,
  uniswapGmxEthPool,
  vault,
  GmxGlpWrapperAddress,
  MagicGlpHarvestorAddress
} = require("./constants");

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
