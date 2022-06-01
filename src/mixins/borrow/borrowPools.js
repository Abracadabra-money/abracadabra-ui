import { mapGetters, mapMutations } from "vuex";
import moment from "moment";
import axios from "axios";

import poolsInfo from "@/utils/borrowPools/pools";
import bentoBoxAbi from "@/utils/abi/bentoBox";
import degenBoxAbi from "@/utils/abi/degenBox";
import oracleAbi from "@/utils/abi/oracle";
import whitelisterAbi from "@/utils/abi/Whitelister";
import yvcrvSTETHWhitelistLocal from "@/utils/yvcrvSTETHWhitelist";

import { getTokensArrayPrices } from "@/helpers/priceHelper.js";

export default {
  data() {
    return {
      tokenPrices: null,
    };
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      userSigner: "getSigner",
      defaultProvider: "getProvider",
      account: "getAccount",
    }),

    contractProvider() {
      return this.userSigner ? this.userSigner : this.defaultProvider;
    },
  },
  methods: {
    ...mapMutations({
      setLoadingPoolsBorrow: "setLoadingPoolsBorrow",
      setCreatingPoolsBorrow: "setCreatingPoolsBorrow",
    }),
    async createPools() {
      const chainPools = poolsInfo.filter(
        (pool) => pool.contractChain === +this.chainId
      );

      this.tokenPrices = await this.fetchTokensPrice(chainPools);

      const pools = await Promise.all(
        chainPools.map((pool) => this.createPool(pool))
      );

      console.log("pools", pools);

      this.$store.commit("setPools", pools);
      this.setLoadingPoolsBorrow(false);
      this.setCreatingPoolsBorrow(true);
    },

    createContract(address, abi) {
      return new this.$ethers.Contract(
        address,
        JSON.stringify(abi),
        this.contractProvider
      );
    },

    async getOracleExchangeRate(contract, customOracleAddress = null) {
      let oracleAddress = await contract.oracle();
      let oracleData = await contract.oracleData();
      const oracleContract = this.createContract(
        customOracleAddress ? customOracleAddress : oracleAddress,
        oracleAbi
      );

      try {
        const rate = await oracleContract.peekSpot(oracleData, {
          gasLimit: 300000,
        });

        return rate;
      } catch (e) {
        console.log("getOracleExchangeRate err:", e);
      }
    },

    async getContractExchangeRate(contract) {
      try {
        const rate = await contract.exchangeRate({
          gasLimit: 300000,
        });

        return rate;
      } catch (e) {
        console.log("getContractExchangeRate err:", e);
      }
    },

    async getMaxBorrow(bentoContract, poolAddr, tokenAddr) {
      try {
        const poolBalance = await bentoContract.balanceOf(tokenAddr, poolAddr, {
          gasLimit: 1000000,
        });

        const toAmount = await bentoContract.toAmount(
          tokenAddr,
          poolBalance,
          false
        );

        const parsedAmount = this.$ethers.utils.formatUnits(toAmount, 18);
        return parsedAmount;
      } catch (e) {
        console.log("getMaxBorrow err:", e);
        return false;
      }
    },

    async getUserBalance(tokenContract) {
      let userBalance;
      try {
        userBalance = await tokenContract.balanceOf(this.account, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("userBalance Err:", e);
      }

      return userBalance;
    },

    async getUserPairBalance(pairTokenContract) {
      let userPairBalance;
      try {
        userPairBalance = await pairTokenContract.balanceOf(this.account, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("userBalance Err:", e);
      }
      return userPairBalance;
    },

    async getClaimableReward(contractInstance, decimals) {
      try {
        const reward = await contractInstance.cvx_claimable_reward(
          this.account,
          {
            gasLimit: 1000000,
          }
        );

        const parsedReward = this.$ethers.utils.formatUnits(reward, decimals);

        return parsedReward;
      } catch (e) {
        console.log("getClaimableReward err: ", e);
      }
    },

    parseTotalCollateralToUsd(
      totalCollateralShare,
      oracleExchangeRate,
      decimals
    ) {
      const tokenPrice =
        1 / this.$ethers.utils.formatUnits(oracleExchangeRate, decimals);

      const parsedCollateral = this.$ethers.utils.formatUnits(
        totalCollateralShare,
        decimals
      );

      return parsedCollateral * tokenPrice;
    },

    async getUserCollateralShare(
      masterContract,
      poolContract,
      decimals,
      tokenAddr
    ) {
      try {
        const userCollateralShare = await poolContract.userCollateralShare(
          this.account
        );

        const toShare = await masterContract.toAmount(
          tokenAddr,
          userCollateralShare,
          false
        );

        const parsedCollateral = this.$ethers.utils.formatUnits(
          toShare.toString(),
          decimals
        );

        return parsedCollateral;
      } catch (e) {
        console.log("getUserCollateralShare err:", e);
      }
    },

    getLiquidationPrice(userCollateralShare, userBorrowPart, ltv) {
      const liquidationMultiplier = ltv / 100;

      const liquidationPrice =
        userBorrowPart / userCollateralShare / liquidationMultiplier || 0;

      return liquidationPrice;
    },

    async checkIsUserCollateralLocked(tokenContractInstance) {
      try {
        const infoResp = await tokenContractInstance.users(this.account, {
          gasLimit: 1000000,
        });

        const lockTimestamp = infoResp.lockedUntil.toString();
        const currentTimestamp = moment().unix().toString();

        if (lockTimestamp && lockTimestamp > currentTimestamp)
          return lockTimestamp;
        return false;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },

    async getUserBorrowPart(poolContract) {
      try {
        const userBorrowPart = await poolContract.userBorrowPart(this.account);

        // return this.$ethers.utils.formatUnits(userBorrowPart.toString());

        const totalBorrowInfo = await poolContract.totalBorrow();

        if (totalBorrowInfo.elastic.isZero() || totalBorrowInfo.base.isZero()) {
          return {
            contractBorrowPart: userBorrowPart,
            userBorrowPart: this.$ethers.utils.formatUnits(
              userBorrowPart.toString()
            ),
          };
        }

        const multiplyer = totalBorrowInfo.elastic / totalBorrowInfo.base;

        const userBorrowFixed = userBorrowPart * multiplyer;

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (0 || -1) + `})?`
        );
        const userBorrowMultiply = userBorrowFixed
          .toLocaleString("fullwide", {
            useGrouping: false,
          })
          .toString()
          .match(re)[0];

        // return this.$ethers.utils.formatUnits(userBorrowMultiply.toString());

        const accrueInfo = await poolContract.accrueInfo();
        const poolInterest = accrueInfo.INTEREST_PER_SECOND;

        if (!poolInterest) {
          return {
            contractBorrowPart: userBorrowPart,
            userBorrowPart: this.$ethers.utils.formatUnits(
              userBorrowMultiply.toString()
            ),
          };
        }

        const secondsInYear = 31536000;

        const interestPercent = (poolInterest * secondsInYear) / 1e16;

        const mimPerSecond =
          ((+userBorrowMultiply / 100) * interestPercent) / 365 / 24 / 60 / 60;

        const lastAccrued = accrueInfo.lastAccrued;

        if (!lastAccrued) {
          return {
            contractBorrowPart: userBorrowPart,
            userBorrowPart: this.$ethers.utils.formatUnits(
              userBorrowMultiply.toString()
            ),
          };
        }

        let startTimestamp = moment.unix(lastAccrued);
        let currentTimestamp = moment.unix(new Date().getTime() / 1000);

        let duration = moment
          .duration(currentTimestamp.diff(startTimestamp))
          .asSeconds();

        if (!duration) {
          return {
            contractBorrowPart: userBorrowPart,
            userBorrowPart: this.$ethers.utils.formatUnits(
              userBorrowMultiply.toString()
            ),
          };
        }

        const mimFromLastAccrue = mimPerSecond * duration;

        const mimFromLastAccrueToInt = mimFromLastAccrue
          .toString()
          .match(re)[0];

        const parsedBorrowed = this.$ethers.utils.formatUnits(
          this.$ethers.BigNumber.from(userBorrowMultiply).add(
            this.$ethers.BigNumber.from(
              mimFromLastAccrueToInt.toLocaleString("fullwide", {
                useGrouping: false,
              })
            )
          )
        );

        return {
          contractBorrowPart: userBorrowPart,
          userBorrowPart: parsedBorrowed,
        };
      } catch (e) {
        console.log("getuserBorrowPartNonce err:", e);
      }
    },

    async isTokenApprow(tokenContract, spenderAddress) {
      try {
        const addressApprowed = await tokenContract.allowance(
          this.account,
          spenderAddress,
          {
            gasLimit: 1000000,
          }
        );

        return addressApprowed.toString() > 0;
      } catch (e) {
        console.log("isTokenApprow err:", e);
        return false;
      }
    },

    async createPool(pool) {
      const poolContract = this.createContract(
        pool.contract.address,
        pool.contract.abi
      );

      let bentoBoxAddress = await poolContract.bentoBox();
      let masterContractAbi = pool.cauldronSettings.isDegenBox
        ? degenBoxAbi
        : bentoBoxAbi;

      if (!bentoBoxAddress) {
        console.log("No master Contract");
        return false;
      }

      const masterContract = this.createContract(
        bentoBoxAddress,
        masterContractAbi
      );

      const tokenContract = this.createContract(
        pool.token.address,
        pool.token.abi
      );

      const pairTokenContract = this.createContract(
        pool.pairToken.address,
        pool.token.abi
      );

      let swapContract = pool.swapContractInfo
        ? this.createContract(
            pool.swapContractInfo.address,
            pool.swapContractInfo.abi
          )
        : null;

      let reverseSwapContract = pool.reverseSwapContractInfo
        ? this.createContract(
            pool.reverseSwapContractInfo.address,
            pool.reverseSwapContractInfo.abi
          )
        : null;

      let oracleExchangeRate = await this.getOracleExchangeRate(
        poolContract,
        pool.oracleAddress
      );

      const contractExchangeRate = await this.getContractExchangeRate(
        poolContract
      );

      const { isTokenApprove, isPairTokenApprove } = await this.getTokenApprove(
        tokenContract,
        pairTokenContract,
        masterContract
      );

      const pairToken = { ...pool.pairToken, isPairTokenApprove };

      const { isTokenToSwapApprove, isTokenToReverseSwapApprove } =
        await this.getSwapContractApprove(pool, tokenContract);

      const { tokenPairRate, askUpdatePrice } = this.getTokenPairRate(
        oracleExchangeRate,
        contractExchangeRate
      );

      const totalCollateralShare = await poolContract.totalCollateralShare();

      const totalBorrowResp = await poolContract.totalBorrow();

      const totalBorrow = this.$ethers.utils.formatUnits(
        totalBorrowResp.base,
        pool.pairToken.decimals
      );

      const { borrowlimit } = await this.getBorrowlimit(pool, poolContract);

      const { dynamicBorrowAmount } = await this.getDynamicBorrowAmount(
        pool,
        masterContract,
        borrowlimit
      );

      const tokenPairPrice = 1;

      let oracleDecimals = pool.token.decimals;

      if (pool.token.oracleDatas?.data && pool.token.oracleDatas?.decimals)
        oracleDecimals = pool.token.oracleDatas?.decimals;

      const tokenPrice = Number(
        this.$ethers.utils.formatUnits(tokenPairRate, oracleDecimals)
      );

      const tokenOraclePrice = Number(
        this.$ethers.utils.formatUnits(oracleExchangeRate, oracleDecimals)
      );

      const tvl = this.parseTotalCollateralToUsd(
        totalCollateralShare,
        tokenPairRate,
        pool.token.decimals
      );

      const price = this.tokenPrices.find(
        (priceItem) => priceItem.address === pool.token.address.toLowerCase()
      )?.price;

      const { maxWithdrawAmount } = await this.getMaxWithdrawAmount(
        pool,
        tokenContract,
        bentoBoxAddress
      );

      let poolData = {
        name: pool.name,
        icon: pool.icon,
        id: pool.id,
        bentoBoxAddress,
        isSwappersActive: pool.isSwappersActive,
        cauldronSettings: pool.cauldronSettings,
        contractInstance: poolContract,
        masterContractInstance: masterContract,
        totalCollateralShare,
        totalBorrow,
        stabilityFee: pool.stabilityFee,
        interest: pool.interest,
        ltv: pool.ltv,
        tvl,
        borrowFee: pool.borrowFee,
        askUpdatePrice,
        pairToken: pairToken,
        pairTokenContract,
        tokenPairPrice,
        tokenPrice,
        price,
        dynamicBorrowAmount,
        borrowlimit,
        tokenOraclePrice,
        joeInfo: pool.joeInfo,
        token: {
          contract: tokenContract,
          name: pool.token.name,
          address: pool.token.address,
          decimals: pool.token.decimals,
          oracleExchangeRate: tokenPairRate,
          isTokenApprove,
          additionalLogic: pool.token.additionalLogic,
        },
        maxWithdrawAmount,
        userInfo: null,
        swapContract,
        isTokenToSwapApprove,
        reverseSwapContract,
        isTokenToReverseSwapApprove,
      };

      if (this.account) {
        return await this.getUserInfo(poolData, poolContract);
      } else {
        return poolData;
      }
    },
    // fetch
    async getUserInfo(pool, poolContract) {
      const { userBorrowPart, contractBorrowPart } =
        await this.getUserBorrowPart(pool.contractInstance);

      let userBalance = await this.getUserBalance(pool.token.contract);

      let userPairBalance = await this.getUserPairBalance(
        pool.pairTokenContract
      );

      const networkBalance = await this.contractProvider.getBalance();

      let claimableReward;

      if (this.chainId === 1 && pool.cauldronSettings.isCollateralClaimable) {
        claimableReward = await this.getClaimableReward(
          pool.token.contract,
          pool.token.decimals
        );
      }

      const userCollateralShare = await this.getUserCollateralShare(
        pool.masterContractInstance,
        pool.contractInstance,
        pool.token.decimals,
        pool.token.address
      );

      const liquidationPrice = this.getLiquidationPrice(
        userCollateralShare,
        userBorrowPart,
        pool.ltv
      );

      let collateralLockTimestamp = null;

      if ((pool.id === 11 || pool.id === 22) && this.chainId === 1) {
        collateralLockTimestamp = await this.checkIsUserCollateralLocked(
          pool.token.contract
        );
      }

      let balanceUsd =
        this.$ethers.utils.formatUnits(userBalance, pool.token.decimals) /
        pool.tokenPrice;

      let whitelistedInfo;
      if (pool.id === 33 && this.chainId === 1) {
        whitelistedInfo = await this.checkPoolWhitelised(poolContract);
        console.log("whitelistedInfo", whitelistedInfo);
      }

      pool.userInfo = {
        userBorrowPart,
        contractBorrowPart,
        userBalance,
        userPairBalance,
        networkBalance,
        claimableReward,
        userCollateralShare,
        liquidationPrice,
        userLockedTimestamp: collateralLockTimestamp,
        contractBorrowPartParsed: this.$ethers.utils.formatUnits(
          contractBorrowPart.toString()
        ),
        balanceUsd,
        whitelistedInfo,
      };

      return pool;
    },

    async fetchTokensPrice(pools) {
      const tokensArray = [];

      pools.forEach((pool) => {
        const tokenAddr = pool.token.address;
        if (tokensArray.indexOf(tokenAddr) === -1) tokensArray.push(tokenAddr);
      });

      const tokenPrices = await getTokensArrayPrices(this.chainId, tokensArray);

      return tokenPrices;
    },

    async fetchWhitelist(url) {
      try {
        // const url =
        //   "https://bafybeicgmg5jh3gbrgzfjypljgtgm4o5ka7ocws2xcltk6ckazpuaiuddy.ipfs.infura-ipfs.io/";
        const response = await axios.get(url);

        return response.data;
      } catch (error) {
        console.log("fetchWhitelist", error);
        return false;
      }
    },

    async checkPoolWhitelised(cauldronContract) {
      try {
        const userAddress = this.account;

        const whitelisterAddress = await cauldronContract.whitelister();
        const whitelisterContract = new this.$ethers.Contract(
          whitelisterAddress,
          JSON.stringify(whitelisterAbi),
          this.signer
        );

        const amountAllowed = await whitelisterContract.amountAllowed(
          userAddress,
          { gasLimit: 5000000 }
        );

        console.log("amountAllowed", amountAllowed);

        const fetchingUrl = await whitelisterContract.ipfsMerkleProofs({
          gasLimit: 5000000,
        });

        const whitelist = await this.fetchWhitelist(fetchingUrl);
        console.log("FETCHHH WHITLIST fetchingUrl", fetchingUrl);

        const yvcrvSTETHWhitelist = whitelist
          ? whitelist
          : yvcrvSTETHWhitelistLocal;

        let userWhitelistedInfo = null;

        Object.keys(yvcrvSTETHWhitelist).forEach(function (key) {
          if (key.toLocaleLowerCase() === userAddress.toLocaleLowerCase()) {
            userWhitelistedInfo = yvcrvSTETHWhitelist[key];
          }
        });

        console.log("userWhitelistedInfo", userWhitelistedInfo);

        if (!userWhitelistedInfo)
          return {
            isUserWhitelisted: false,
          };

        const amountAllowedParsed = this.$ethers.utils.formatUnits(
          amountAllowed,
          18
        );
        const userBorrowPart = this.$ethers.utils.formatUnits(
          userWhitelistedInfo.userBorrowPart,
          18
        );

        return {
          isUserWhitelisted: true,
          amountAllowedParsed,
          userBorrowPart,
          userWhitelistedInfo,
          whitelisterContract,
        };
      } catch (e) {
        console.log("checkPoolWhitelised", e);
        return {
          isUserWhitelisted: false,
        };
      }
    },

    getTokenPairRate(oracleExchangeRate, contractExchangeRate) {
      let tokenPairRate;
      let askUpdatePrice = false;

      if (
        oracleExchangeRate.toString() > contractExchangeRate.toString() &&
        !contractExchangeRate.eq(0)
      ) {
        tokenPairRate = contractExchangeRate;
        askUpdatePrice = true;
      } else if (contractExchangeRate.eq(0)) {
        tokenPairRate = oracleExchangeRate;
        askUpdatePrice = true;
      } else if (
        oracleExchangeRate.toString() !== contractExchangeRate.toString()
      ) {
        tokenPairRate = oracleExchangeRate;
      } else {
        tokenPairRate = oracleExchangeRate;
      }

      return { tokenPairRate, askUpdatePrice };
    },

    async getMaxWithdrawAmount(pool, tokenContract, bentoBoxAddress) {
      let maxWithdrawAmount = -1;

      if (pool.cauldronSettings.hasWithdrawableLimit) {
        const tokenWithdrawAmount = await tokenContract.balanceOf(
          bentoBoxAddress,
          { gasLimit: 5000000 }
        );

        maxWithdrawAmount = this.$ethers.utils.formatUnits(
          tokenWithdrawAmount,
          pool.token.decimals
        );
      }

      return { maxWithdrawAmount };
    },

    async getBorrowlimit(pool, poolContract) {
      let borrowlimit = null;

      if (pool.cauldronSettings.hasAccountBorrowLimit) {
        const borrowLimitResp = await poolContract.borrowLimit();

        borrowlimit = this.$ethers.utils.formatUnits(
          borrowLimitResp.borrowPartPerAddress.toString(),
          pool.pairToken.decimals
        );
      }

      return { borrowlimit };
    },

    async getDynamicBorrowAmount(pool, masterContract, borrowlimit) {
      let dynamicBorrowAmount = await this.getMaxBorrow(
        masterContract,
        pool.contract.address,
        pool.pairToken.address
      );

      if (
        pool.cauldronSettings.dynamicBorrowAmountLimit &&
        pool.cauldronSettings.dynamicBorrowAmountLimit < dynamicBorrowAmount
      )
        dynamicBorrowAmount = pool.cauldronSettings.dynamicBorrowAmountLimit;

      if (
        pool.cauldronSettings.hasAccountBorrowLimit &&
        dynamicBorrowAmount > borrowlimit
      )
        dynamicBorrowAmount = borrowlimit;

      if (pool.cauldronSettings.isDepreciated) dynamicBorrowAmount = 0;

      return { dynamicBorrowAmount };
    },

    async getTokenApprove(tokenContract, pairTokenContract, masterContract) {
      let isTokenApprove = false,
        isPairTokenApprove = false;

      if (this.account) {
        isTokenApprove = await this.isTokenApprow(
          tokenContract,
          masterContract.address
        );

        isPairTokenApprove = await this.isTokenApprow(
          pairTokenContract,
          masterContract.address
        );
      }

      return {
        isTokenApprove,
        isPairTokenApprove,
      };
    },

    async getSwapContractApprove(pool, tokenContract) {
      let isTokenToSwapApprove = false,
        isTokenToReverseSwapApprove = false;

      if (pool?.swapContractInfo?.address && this.account) {
        isTokenToSwapApprove = await this.isTokenApprow(
          tokenContract,
          pool.swapContractInfo.address
        );
      }

      if (pool?.reverseSwapContractInfo?.address && this.account) {
        isTokenToReverseSwapApprove = await this.isTokenApprow(
          tokenContract,
          pool.reverseSwapContractInfo.address
        );
      }

      return {
        isTokenToSwapApprove,
        isTokenToReverseSwapApprove,
      };
    },
  },

  created() {
    this.createPools();
  },
};
