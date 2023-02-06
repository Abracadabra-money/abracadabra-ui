import { mapGetters, mapMutations } from "vuex";
import moment from "moment";
import axios from "axios";
import { Contract } from "ethers";

import poolsInfo from "@/utils/borrowPools/pools";
import bentoBoxAbi from "@/utils/abi/bentoBox";
import degenBoxAbi from "@/utils/abi/degenBox";
import oracleAbi from "@/utils/abi/oracle";
import whitelisterAbi from "@/utils/abi/Whitelister";
import yvcrvSTETHWhitelistLocal from "@/utils/yvcrvSTETHWhitelist";

import { getTokensArrayPrices } from "@/helpers/priceHelper.js";
import abraWsGlp from "@/utils/abi/tokensAbi/abraWsGlp";
import { getInterest } from "@/helpers/getInterest";
import { getTotalBorrow } from "@/helpers/getTotalBorrow";

export default {
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

      const pools = await Promise.all(
        chainPools.map((pool) => this.createPool(pool))
      );

      this.$store.commit("setPools", pools);
      this.setLoadingPoolsBorrow(false);
      this.setCreatingPoolsBorrow(true);
    },

    async getOracleExchangeRate(contract, customOracleAddress = null) {
      let oracleAddress = await contract.oracle();
      let oracleData = await contract.oracleData();

      const oracleContract = new Contract(
        customOracleAddress ? customOracleAddress : oracleAddress,
        oracleAbi,
        this.contractProvider
      );

      try {
        const rate = await oracleContract.peekSpot(oracleData);

        return rate;
      } catch (e) {
        console.log("getOracleExchangeRate err:", e);
      }
    },

    async getContractExchangeRate(contract) {
      try {
        const rate = await contract.exchangeRate();

        return rate;
      } catch (e) {
        console.log("getContractExchangeRate err:", e);
      }
    },

    async getMimCauldronBalance(bentoContract, poolAddr, tokenAddr) {
      try {
        const poolBalance = await bentoContract.balanceOf(tokenAddr, poolAddr);

        const toAmount = await bentoContract.toAmount(
          tokenAddr,
          poolBalance,
          false
        );

        const parsedAmount = this.$ethers.utils.formatUnits(toAmount, 18);
        return parsedAmount;
      } catch (e) {
        console.log("Get Mim Cauldron Balance Error:", e);
        return false;
      }
    },

    async getUserTokenBalance(contract, decimals) {
      try {
        return await contract.balanceOf(this.account);
      } catch (e) {
        console.log("userBalance Err:", e);
        return this.$ethers.utils.parseUnits("0", decimals);
      }
    },

    async getUserPairBalance(tokenBorrowContract) {
      let userPairBalance;
      try {
        userPairBalance = await tokenBorrowContract.balanceOf(this.account);
      } catch (e) {
        console.log("getUserPairBalance Err:", e);
      }
      return userPairBalance;
    },

    async getClaimableReward(contractInstance, decimals) {
      try {
        const reward = await contractInstance.cvx_claimable_reward(
          this.account
        );

        const parsedReward = this.$ethers.utils.formatUnits(reward, decimals);

        return parsedReward;
      } catch (e) {
        console.log("getClaimableReward err: ", e);
      }
    },

    async parseCollatealTokenToBorrowToken(
      totalCollateralShare,
      oracleExchangeRate,
      decimals,
      bentoBox,
      tokenAddr
    ) {
      const exchangeRate =
        1 / this.$ethers.utils.formatUnits(oracleExchangeRate, decimals);

      const collateralAmount = await bentoBox.toAmount(
        tokenAddr,
        totalCollateralShare,
        false
      );

      const parsedCollateral = this.$ethers.utils.formatUnits(
        collateralAmount,
        decimals
      );

      return parsedCollateral * exchangeRate;
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

    async checkIsUserCollateralLocked(contractInstance) {
      try {
        const infoResp = await contractInstance.users(this.account);

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

    async isTokenApprow(contract, spenderAddress) {
      try {
        const addressApprowed = await contract.allowance(
          this.account,
          spenderAddress
        );

        return addressApprowed.toString() > 0;
      } catch (e) {
        console.log("isTokenApprow err:", e);
        return false;
      }
    },

    async createPool(pool) {
      const poolContract = new Contract(
        pool.contract.address,
        pool.contract.abi,
        this.contractProvider
      );

      let bentoBoxAddress = await poolContract.bentoBox();
      let masterContractAbi = pool.cauldronSettings.isDegenBox
        ? degenBoxAbi
        : bentoBoxAbi;

      if (!bentoBoxAddress) {
        console.log("No master Contract");
        return false;
      }

      const masterContract = new Contract(
        bentoBoxAddress,
        masterContractAbi,
        this.contractProvider
      );

      const tokenCollateralContract = new Contract(
        pool.token.address,
        pool.token.abi,
        this.contractProvider
      );

      const tokenBorrowContract = new Contract(
        pool.pairToken.address,
        pool.token.abi,
        this.contractProvider
      );

      const levSwapperContract = pool.swapContractInfo
        ? new Contract(
            pool.swapContractInfo.address,
            pool.swapContractInfo.abi,
            this.contractProvider
          )
        : null;

      const liqSwapperContract = pool.reverseSwapContractInfo
        ? new Contract(
            pool.reverseSwapContractInfo.address,
            pool.reverseSwapContractInfo.abi,
            this.contractProvider
          )
        : null;

      let oracleExchangeRate = await this.getOracleExchangeRate(
        poolContract,
        pool.oracleAddress
      );

      const contractExchangeRate = await this.getContractExchangeRate(
        poolContract
      );
      const { borrowTokenRate, askUpdatePrice } = this.getBorrowTokenRate(
        oracleExchangeRate,
        contractExchangeRate
      );

      const totalCollateralShare = await poolContract.totalCollateralShare();

      const totalBorrow = await getTotalBorrow(
        poolContract,
        pool.pairToken.decimals
      );

      const { borrowPartPerAddress, totalBorrowlimit } =
        await this.getBorrowlimit(pool, poolContract);

      const mimCauldronBalance = await this.getMimCauldronBalance(
        masterContract,
        pool.contract.address,
        pool.pairToken.address
      );

      const { dynamicBorrowAmountLimit, hasAccountBorrowLimit, isDepreciated } =
        pool.cauldronSettings;

      const dynamicBorrowAmount = await this.getMIMsLeftToBorrow(
        borrowPartPerAddress,
        totalBorrow,
        totalBorrowlimit,
        mimCauldronBalance,
        dynamicBorrowAmountLimit,
        hasAccountBorrowLimit,
        isDepreciated
      );

      let oracleDecimals = pool.token.decimals;

      if (pool.token.oracleDatas?.data && pool.token.oracleDatas?.decimals)
        oracleDecimals = pool.token.oracleDatas?.decimals;

      const tokenBorrowPrice = 1;

      const borrowTokenExchangeRate = Number(
        this.$ethers.utils.formatUnits(borrowTokenRate, oracleDecimals)
      );

      const tokenOraclePrice = this.$ethers.utils.formatUnits(
        oracleExchangeRate,
        oracleDecimals
      );

      const tvl = await this.parseCollatealTokenToBorrowToken(
        totalCollateralShare,
        oracleExchangeRate,
        pool.token.decimals,
        masterContract,
        pool.token.address
      );

      const { maxWithdrawAmount } = await this.getMaxWithdrawAmount(
        pool,
        tokenCollateralContract,
        bentoBoxAddress
      );

      const lpLogic = pool.lpLogic ? await this.getLpLogic(pool) : null;

      let token0 = null;
      let token1 = null;
      let chainLinksContract = null;

      if (pool.lpLogic && pool?.token0 && pool?.token1) {
        const token0Contract = new this.$ethers.Contract(
          pool.token0.address,
          JSON.stringify(pool.token0.abi),
          this.contractProvider
        );

        const token1Contract = new this.$ethers.Contract(
          pool.token1.address,
          JSON.stringify(pool.token0.abi),
          this.contractProvider
        );

        token0 = {
          contract: token0Contract,
        };

        token1 = {
          contract: token1Contract,
        };

        if (pool?.chainlinks) {
          let mimChainlink = null;

          if (pool.chainlinks.mim) {
            mimChainlink = new this.$ethers.Contract(
              pool.chainlinks.mim,
              JSON.stringify(pool.chainlinks.abi),
              this.contractProvider
            );
          }

          const token0Chainlink = new this.$ethers.Contract(
            pool.chainlinks.token0,
            JSON.stringify(pool.chainlinks.abi),
            this.contractProvider
          );

          const token1Chainlink = new this.$ethers.Contract(
            pool.chainlinks.token1,
            JSON.stringify(pool.chainlinks.abi),
            this.contractProvider
          );

          chainLinksContract = {
            mim: mimChainlink,
            token0: token0Chainlink,
            token1: token1Chainlink,
          };
        }
      }

      let interest = 0;
      const poolInterest = await getInterest(poolContract);
      if (poolInterest) interest = poolInterest;
      if (!poolInterest && pool?.interest) interest = pool?.interest;

      let poolData = {
        name: pool.name,
        icon: pool.icon,
        id: pool.id,
        bentoBoxAddress,
        isSwappersActive: pool.isSwappersActive,
        is0xSwap: pool.is0xSwap,
        executionPrice: pool.executionPrice,
        cauldronSettings: pool.cauldronSettings,
        contractInstance: poolContract,
        masterContractInstance: masterContract,
        totalCollateralShare,
        totalBorrow,
        stabilityFee: pool.stabilityFee,
        interest,
        ltv: pool.ltv,
        tvl,
        borrowFee: pool.borrowFee,
        askUpdatePrice,
        borrowToken: {
          ...pool.pairToken,
          contract: tokenBorrowContract,
          price: tokenBorrowPrice,
          exchangeRate: borrowTokenExchangeRate,
        },
        dynamicBorrowAmount,
        borrowlimit: borrowPartPerAddress,
        tokenOraclePrice,
        joeInfo: pool.joeInfo,
        collateralToken: {
          contract: tokenCollateralContract,
          name: pool.token.name,
          address: pool.token.address,
          decimals: pool.token.decimals,
          oracleExchangeRate: borrowTokenRate,
          additionalLogic: pool.token.additionalLogic,
        },
        maxWithdrawAmount,
        userInfo: null,
        levSwapperContract,
        liqSwapperContract,
        lpLogic,
        token0,
        token1,
        chainlinks: chainLinksContract,
      };

      if (this.account) {
        return await this.getUserInfo(poolData, poolContract);
      } else {
        return poolData;
      }
    },

    async getUserInfo(pool, poolContract) {
      const { userBorrowPart, contractBorrowPart } =
        await this.getUserBorrowPart(pool.contractInstance);

      let userBalance = await this.getUserTokenBalance(
        pool.collateralToken.contract,
        pool.collateralToken.decimals
      );

      let userPairBalance = await this.getUserTokenBalance(
        pool.borrowToken.contract,
        pool.borrowToken.decimals
      );

      const networkBalance = await this.contractProvider.getBalance();

      let claimableReward;

      if (this.chainId === 1 && pool.cauldronSettings.isCollateralClaimable) {
        claimableReward = await this.getClaimableReward(
          pool.collateralToken.contract,
          pool.collateralToken.decimals
        );
      }

      const userCollateralShare = await this.getUserCollateralShare(
        pool.masterContractInstance,
        pool.contractInstance,
        pool.collateralToken.decimals,
        pool.collateralToken.address
      );

      const liquidationPrice = this.getLiquidationPrice(
        userCollateralShare,
        userBorrowPart,
        pool.ltv
      );

      let collateralLockTimestamp = null;

      if ((pool.id === 11 || pool.id === 22) && this.chainId === 1) {
        collateralLockTimestamp = await this.checkIsUserCollateralLocked(
          pool.collateralToken.contract
        );
      }

      let balanceUsd =
        this.$ethers.utils.formatUnits(
          userBalance,
          pool.collateralToken.decimals
        ) / pool.borrowToken.exchangeRate;

      let whitelistedInfo;
      if (pool.id === 33 && this.chainId === 1) {
        whitelistedInfo = await this.checkPoolWhitelised(poolContract);
      }

      const isApproveTokenCollateral = await this.isTokenApprow(
        pool.collateralToken.contract,
        pool.masterContractInstance.address
      );

      const isApproveTokenBorrow = await this.isTokenApprow(
        pool.borrowToken.contract,
        pool.masterContractInstance.address
      );

      const lpInfo = pool.lpLogic ? await this.getLpInfo(pool) : null;

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
        isApproveTokenCollateral,
        isApproveTokenBorrow,
        lpInfo,
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
          userAddress
        );

        const yvcrvSTETHWhitelist = yvcrvSTETHWhitelistLocal;

        let userWhitelistedInfo = null;

        Object.keys(yvcrvSTETHWhitelist).forEach(function (key) {
          if (key.toLocaleLowerCase() === userAddress.toLocaleLowerCase()) {
            userWhitelistedInfo = yvcrvSTETHWhitelist[key];
          }
        });

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

    getBorrowTokenRate(oracleExchangeRate, contractExchangeRate) {
      let borrowTokenRate;
      let askUpdatePrice = false;

      if (
        oracleExchangeRate.gt(contractExchangeRate) &&
        !contractExchangeRate.eq(0)
      ) {
        borrowTokenRate = contractExchangeRate;
        askUpdatePrice = true;
      } else if (contractExchangeRate.eq(0)) {
        borrowTokenRate = oracleExchangeRate;
        askUpdatePrice = true;
      } else {
        borrowTokenRate = oracleExchangeRate;
      }

      return { borrowTokenRate, askUpdatePrice };
    },

    async getMaxWithdrawAmount(pool, contract, bentoBoxAddress) {
      let maxWithdrawAmount = -1;

      if (pool.cauldronSettings.hasWithdrawableLimit) {
        const tokenWithdrawAmount = await contract.balanceOf(bentoBoxAddress);

        maxWithdrawAmount = this.$ethers.utils.formatUnits(
          tokenWithdrawAmount,
          pool.token.decimals
        );
      }

      return { maxWithdrawAmount };
    },

    async getBorrowlimit(pool, poolContract) {
      let borrowPartPerAddress = null;
      let totalBorrowlimit = null;

      if (pool.cauldronSettings.hasAccountBorrowLimit) {
        const borrowLimitResp = await poolContract.borrowLimit();

        borrowPartPerAddress = this.$ethers.utils.formatUnits(
          borrowLimitResp.borrowPartPerAddress.toString(),
          pool.pairToken.decimals
        );

        totalBorrowlimit = this.$ethers.utils.formatUnits(
          borrowLimitResp.total.toString(),
          pool.pairToken.decimals
        );
      }

      return { borrowPartPerAddress, totalBorrowlimit };
    },

    async getMIMsLeftToBorrow(
      borrowPartPerAddress,
      totalBorrow,
      totalBorrowlimit,
      mimCauldronBalance,
      dynamicBorrowAmountLimit,
      hasAccountBorrowLimit,
      isDepreciated
    ) {
      if (dynamicBorrowAmountLimit === 0 || isDepreciated) return 0;

      const values = [];

      values.push(+mimCauldronBalance);

      if (dynamicBorrowAmountLimit) values.push(+dynamicBorrowAmountLimit);

      if (hasAccountBorrowLimit) {
        values.push(+borrowPartPerAddress);
        values.push(+totalBorrowlimit);

        const availableLimit = +totalBorrowlimit - +totalBorrow;
        if (availableLimit < 1000) return 0;
        values.push(availableLimit);
      }

      return Math.min(...values);
    },

    async getLpLogic(pool) {
      const {
        tokenWrapper,
        tokenWrapperAbi,
        lpAddress,
        lpAbi,
        name,
        defaultToken,
      } = pool.lpLogic;

      const tokenWrapperContract = new Contract(
        tokenWrapper,
        tokenWrapperAbi,
        this.contractProvider
      );

      const lpContract = new Contract(lpAddress, lpAbi, this.contractProvider);

      const lpDecimals = await lpContract.decimals();

      let feePercent = null;
      if (this.chainId === 42161 && pool.id === 2) {
        const constract = new Contract(
          pool.token.address,
          abraWsGlp,
          this.contractProvider
        );

        feePercent = await constract.feePercent();
      }

      return {
        tokenWrapperContract,
        lpContract,
        lpDecimals,
        lpAddress,
        tokenWrapper,
        name,
        defaultToken,
        feePercent,
      };
    },

    async getLpInfo(pool) {
      const isApprove = await this.isTokenApprow(
        pool.lpLogic.lpContract,
        pool.masterContractInstance.address
      );
      const balance = await this.getUserTokenBalance(pool.lpLogic.lpContract);

      let balanceUsd =
        balance > 0
          ? this.$ethers.utils.formatUnits(
              balance,
              pool.collateralToken.decimals
            ) / pool.borrowToken.exchangeRate
          : "0.0";

      if (pool.id === 3 && this.chainId === 42161) {
        const rate = await this.getTokensRate(
          pool.collateralToken.contract,
          pool.lpLogic.lpContract
        );

        balanceUsd = +balanceUsd > 0 ? balanceUsd / rate : "0.0";
      }

      return {
        isApprove,
        balance,
        balanceUsd,
      };
    },
    async getTokensRate(mainTokenInstance, stakeTokenInstance) {
      const mGlpBalance = await stakeTokenInstance.balanceOf(
        mainTokenInstance.address
      );
      const totalSupply = await mainTokenInstance.totalSupply();

      const parsedBalance = this.$ethers.utils.formatEther(
        mGlpBalance.toString()
      );
      const parsedTotalSupply = this.$ethers.utils.formatEther(totalSupply);

      const tokenRate = parsedBalance / parsedTotalSupply;

      return tokenRate;
    },
  },
  created() {
    this.createPools();
  },
};
