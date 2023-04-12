const { providers, Contract } = require("ethers");
const {
  rewardReaderAddress,
  glpManagerAddress,
  traderJoeGmxAvaxPool,
  chainLinkAvaxAddress,
  vault,
  readerAddress,
  MagicGlpHarvestorAddress,
} = require("./constants");
const RewardReader = require("./abi/RewardReader.json");
const GlpManager = require("./abi/GlpManager.json");
const JoePair = require("./abi/JoePair.json");
const chainLinkAvax = require("./abi/chainLinkAvax.json");
const Vault = require("./abi/Vault.json");
const ReaderV2 = require("./abi/ReaderV2.json");
const MagicGlpHarvestor = require("./abi/MagicGlpHarvestor.json");

const { rpc } = require("./constants");

const provider = new providers.StaticJsonRpcProvider(rpc);

module.exports.getRewardReaderContract = () =>
  new Contract(rewardReaderAddress, RewardReader.abi, provider);

module.exports.getGlpManagerContract = () =>
  new Contract(glpManagerAddress, GlpManager.abi, provider);

module.exports.getPoolContract = () =>
  new Contract(traderJoeGmxAvaxPool, JoePair.abi, provider);

module.exports.getChainLinkAvaxContract = () =>
  new Contract(chainLinkAvaxAddress, chainLinkAvax.abi, provider);

module.exports.getVaultContract = () =>
  new Contract(vault, Vault.abi, provider);

module.exports.getReaderContract = () =>
  new Contract(readerAddress, ReaderV2.abi, provider);

module.exports.getMagicGlpHarvestorContract = () =>
  new Contract(MagicGlpHarvestorAddress, MagicGlpHarvestor.abi, provider);
