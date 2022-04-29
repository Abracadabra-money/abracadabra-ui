import farmPools from "@/utils/farmPools/pools";
import {
  getTokenPriceByAddress,
  numberWithCommas,
} from "@/helpers/priceHelper.js";
import { mapMutations } from "vuex";

import erc20Abi from "@/utils/farmPools/abi/erc20Abi";

export default {
  data() {
    return {
      /* prices: {
        spellPrice: null,
        mimPrice: null,
        icePrice: null,
        wethPrice: null,
        ohmPrice: null,
        timePrice: null,
      },*/
      tokenAddresses: {
        SPELL: "0x090185f2135308bad17527004364ebcc2d37e5f6",
        MIM: "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
        WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      },
      farmTokenPrices: null,
    };
  },
  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    signer() {
      return this.$store.getters.getSigner || this.$ethers.getDefaultProvider();
    },
    account() {
      return this.$store.getters.getAccount;
    },
    pools() {
      return this.$store.getters.getFarmPools;
    },
  },
  methods: {
    ...mapMutations({ setLoadingPoolsFarm: "setLoadingPoolsFarm" }),
    async updateTokenPrices() {
      console.log("get prices");
      const farmTokenPrices = {};
      try {
        for (const key of Object.keys(this.tokenAddresses)) {
          farmTokenPrices[key] = await getTokenPriceByAddress(
            1,
            this.tokenAddresses[key]
          );
        }
        this.farmTokenPrices = farmTokenPrices;
      } catch (e) {
        console.log("updateTokenPrices err", e);
      }
    },
    async createFarmPools() {
      if (!this.pools.length) {
        this.setLoadingPoolsFarm(true);
      }
      const chainPools = farmPools.filter(
        (pool) => pool.contractChain === this.chainId
      );

      try {
        if (!this.farmTokenPrices) await this.updateTokenPrices();

        const pools = await Promise.all(
          chainPools.map((pool) => this.createFarmPool(pool))
        );
        this.setLoadingPoolsFarm(false);

        console.log("FARMS:", pools);

        this.$store.commit("setFarmPools", pools);
      } catch (e) {
        console.log("createFarmPools err", e);
      }
    },
    async createFarmPool(farmPoolInfo) {
      const contractInstance = new this.$ethers.Contract(
        farmPoolInfo.contract.address,
        JSON.stringify(farmPoolInfo.contract.abi),
        this.signer
      );

      const poolInfo = await contractInstance.poolInfo(farmPoolInfo.poolId, {
        gasLimit: 600000,
      });

      const stakingTokenContract = new this.$ethers.Contract(
        poolInfo.stakingToken,
        JSON.stringify(farmPoolInfo.stakingTokenAbi),
        this.signer
      );

      const tokenPrice = this.farmTokenPrices["SPELL"];

      const { poolYield, lpPrice } = await this.getYieldAndLpPrice(
        stakingTokenContract,
        contractInstance,
        poolInfo,
        farmPoolInfo
      );

      const poolRoi = await this.getRoi(poolYield, tokenPrice);

      const poolTvl = await this.getTVL(
        poolInfo.stakingTokenTotalAmount,
        lpPrice
      );

      const farmPoolItem = {
        name: farmPoolInfo.name,
        icon: farmPoolInfo.icon,
        nameSubtitle: farmPoolInfo.nameSubtitle,
        stakingTokenLink: farmPoolInfo.stakingTokenLink,
        stakingTokenIcon: farmPoolInfo.stakingTokenIcon,
        id: farmPoolInfo.id,
        poolId: farmPoolInfo.poolId,
        contractInstance,
        stakingTokenName: farmPoolInfo.stakingTokenName,
        stakingTokenType: farmPoolInfo.stakingTokenType,
        lpPrice,
        depositedBalance: farmPoolInfo.depositedBalance,
        contractAddress: farmPoolInfo.contract.address,
        poolInfo,
        stakingTokenContract,
        tokenPrice,
        poolYield,
        poolRoi,
        poolTvl,
        tokenName: farmPoolInfo.earnedToken.name,
      };

      if (this.account) {
        farmPoolItem.accountInfo = await this.getFarmUserInfo(farmPoolItem);
      }

      return farmPoolItem;
    },
    async getFarmUserInfo(farmPoolItem) {
      const allowance = await this.getAllowance(
        farmPoolItem.stakingTokenContract,
        farmPoolItem.contractInstance.address
      );

      const userInfo = await farmPoolItem.contractInstance.userInfo(
        farmPoolItem.poolId,
        this.account
      );

      const userReward = await farmPoolItem.contractInstance.pendingIce(
        farmPoolItem.poolId,
        this.account
      );

      const tokensBalanceInfo = farmPoolItem.depositedBalance
        ? await this.getSLPBalances(farmPoolItem, userInfo)
        : null;

      const accountBalance = await farmPoolItem.stakingTokenContract.balanceOf(
        this.account,
        { gasLimit: 5000000 }
      );

      const balance = this.$ethers.utils.formatEther(accountBalance.toString());

      const deposited = await farmPoolItem.contractInstance.userInfo(
        farmPoolItem.poolId,
        this.account
      );

      const depositedBalance = this.$ethers.utils.formatEther(
        deposited?.amount.toString()
      );

      return {
        allowance,
        userInfo,
        userReward,
        tokensBalanceInfo,
        balance,
        depositedBalance,
      };
    },
    async getSLPBalances(farmPoolItem, userInfo) {
      const { _reserve0, _reserve1 } =
        await farmPoolItem.stakingTokenContract.getReserves();

      //MIM or SPELL
      const token0Price =
        this.farmTokenPrices[farmPoolItem.depositedBalance.token0.name];

      // ETH always
      const token1Price = this.farmTokenPrices["WETH"];

      const token0Amount = this.$ethers.utils.formatUnits(_reserve0, 18);

      const token1Amount = this.$ethers.utils.formatUnits(_reserve1, 18);

      const token0Usd = token0Amount * token0Price;
      const token1Usd = token1Amount * token1Price;

      const tokensSum = token0Usd + token1Usd;

      const token0Percent = (token0Usd / tokensSum) * 100;
      const token1Percent = (token1Usd / tokensSum) * 100;

      const userRewardParsed = this.$ethers.utils.formatUnits(
        userInfo.amount,
        18
      );

      const userRewardInUsd = userRewardParsed * farmPoolItem.lpPrice;

      const token0UserAmount =
        ((userRewardInUsd / 100) * token0Percent) / token0Price;
      const token1UserAmount =
        ((userRewardInUsd / 100) * token1Percent) / token1Price;

      return {
        token0: {
          name: farmPoolItem.depositedBalance.token0.name,
          amount: token0UserAmount,
          amountInUsd: token0UserAmount * token0Price,
        },
        token1: {
          name: farmPoolItem.depositedBalance.token1.name,
          amount: token1UserAmount,
          amountInUsd: token1UserAmount * token1Price,
        },
      };
    },
    async getYieldAndLpPrice(
      stakingTokenContract,
      contractInstance,
      poolInfo,
      farmPoolInfo
    ) {
      if (farmPoolInfo.id === 1 || farmPoolInfo.id === 2) {
        const mimPrice = this.farmTokenPrices["MIM"];
        const spellPrice = this.farmTokenPrices["SPELL"];

        const mimTokenContract = new this.$ethers.Contract(
          this.tokenAddresses["MIM"],
          JSON.stringify(erc20Abi),
          this.signer
        );

        const spellTokenContract = new this.$ethers.Contract(
          this.tokenAddresses["SPELL"],
          JSON.stringify(erc20Abi),
          this.signer
        );

        const { lpYield, lpPrice } = await this.getLPYield(
          poolInfo.stakingToken,
          farmPoolInfo.id === 1 ? mimTokenContract : spellTokenContract,
          stakingTokenContract,
          farmPoolInfo.id === 1 ? mimPrice : spellPrice
        );

        const poolYield = await this.getYield(
          contractInstance,
          lpYield,
          poolInfo.stakingTokenTotalAmount,
          poolInfo.allocPoint,
          poolInfo.accIcePerShare
        );

        return {
          lpPrice,
          poolYield,
        };
      }

      if (farmPoolInfo.id === 3) {
        try {
          const price = await stakingTokenContract.get_virtual_price();

          const lpPrice = this.$ethers.utils.formatEther(price.toString());
          const poolYield = await this.getYield(
            contractInstance,
            1000,
            poolInfo.stakingTokenTotalAmount,
            poolInfo.allocPoint,
            poolInfo.accIcePerShare
          );

          return {
            lpPrice,
            poolYield,
          };
        } catch (e) {
          console.log("get price err:", e);

          return {
            lpPrice: 0,
            poolYield: 0,
          };
        }
      }

      return {
        lpPrice: 0,
        poolYield: 0,
      };
    },
    async getYield(
      contractInstance,
      amount = 1000,
      stakingTokenTotalAmount,
      allocPoint,
      accIcePerShare
    ) {
      try {
        const divide =
          +this.$ethers.utils.formatEther(stakingTokenTotalAmount.toString()) +
          amount;

        const multiplier = 86400;

        const icePerSecondResp = await contractInstance.icePerSecond();
        const icePerSecond = +icePerSecondResp;

        const totalAllocPointResp = await contractInstance.totalAllocPoint();
        const totalAllocPoint = +totalAllocPointResp;

        let iceReward =
          (+multiplier * +icePerSecond * +allocPoint) / +totalAllocPoint;

        let loacalAccIcePerShare =
          +accIcePerShare + (+iceReward * Math.pow(10, 12)) / +divide;

        const accIcePerShareConst =
          +loacalAccIcePerShare + (+iceReward * Math.pow(10, 12)) / +divide;

        const rewardDebt = (+amount * +loacalAccIcePerShare) / Math.pow(10, 12);

        const pending =
          (+amount * +accIcePerShareConst) / Math.pow(10, 12) - +rewardDebt;

        return parseFloat(
          this.$ethers.utils.formatUnits(
            pending.toLocaleString("fullwide", { useGrouping: false })
          )
        ).toFixed(2);
      } catch (error) {
        console.log("getYield", error);
        return 0;
      }
    },
    async getLPYield(stakingToken, iceInstance, erc20, tokenPrice) {
      try {
        let IceInSlpTotal = await iceInstance.balanceOf(stakingToken);
        let totalTokensSLPMinted = await erc20.totalSupply();

        let icePerLp;
        if (+IceInSlpTotal > 0) {
          icePerLp = +totalTokensSLPMinted / +IceInSlpTotal;
        }
        if (+IceInSlpTotal === 0) {
          icePerLp = 0;
        }
        const lpPrice =
          (+IceInSlpTotal / +totalTokensSLPMinted) * +tokenPrice * 2;

        let IcePer1000Bucks;
        if (+tokenPrice > 0) IcePer1000Bucks = 1000 / +tokenPrice;
        if (+tokenPrice === 0) IcePer1000Bucks = 0;

        let res = (+IcePer1000Bucks * +icePerLp) / 2; // for LP pool

        return { lpYield: res, lpPrice };
      } catch (error) {
        console.log(error);
      }
    },
    async getRoi(value, price) {
      try {
        const dollarPerDay =
          ((parseFloat(value) * parseFloat(price) * 100) / 1000) * 365;

        return parseFloat(dollarPerDay).toFixed(2);
      } catch (error) {
        console.log("getRoi", error);
      }
    },
    async getTVL(stakingTokenTotalAmount, price) {
      try {
        const ttl = parseFloat(
          this.$ethers.utils.formatEther(stakingTokenTotalAmount.toString())
        ).toFixed(2);

        const tvl = parseFloat(ttl.toString()) * parseFloat(price.toString());

        return numberWithCommas(parseInt(tvl));
      } catch (error) {
        console.log(error);
      }
    },
    async getAllowance(contractInstance, allowAddrr) {
      try {
        const result = await contractInstance.allowance(
          this.account,
          allowAddrr,
          { gasLimit: 3000000 }
        );

        return +result > 0;
      } catch (error) {
        console.log("getAllowance:", error);
      }
    } /*
    async getTokenPrice(token) {
      if (token === "CRV") {
        const priceResp = await farmTokenPrices(["curve-dao-token"]);
        return priceResp["curve-dao-token"];
      }

      if (token === "CVX") {
        const priceResp = await farmTokenPrices(["convex-finance"]);
        return priceResp["convex-finance"];
      }

      if (token === "ICE") {
        if (this.prices.icePrice) return this.prices.icePrice;

        const priceResp = await farmTokenPrices(["ice"]);
        this.prices.icePrice = priceResp.ice;
        return priceResp.ice;
      }

      if (token === "MIM") {
        if (this.prices.mimPrice) return this.prices.mimPrice;

        const priceResp = await farmTokenPrices(["mim"]);

        this.prices.mimPrice = priceResp.mim;
        return priceResp.mim;
      }

      if (token === "Spell" || token === "SPELL") {
        if (this.prices.spellPrice) return this.prices.spellPrice;

        const priceResp = await farmTokenPrices(["spell"]);

        this.prices.spellPrice = priceResp.spell;
        return priceResp.spell;
      }

      if (token === "WETH") {
        if (this.prices.wethPrice) return this.prices.wethPrice;
        const priceResp = await farmTokenPrices(["weth"]);
        this.prices.wethPrice = priceResp.weth;
        return priceResp.weth;
      }

      if (token === "OHM") {
        if (this.prices.ohmPrice) return this.prices.ohmPrice;

        const priceResp = await farmTokenPrices(["olympus"]);
        this.prices.ohmPrice = priceResp.olympus;
        return priceResp.olympus;
      }

      if (token === "TIME") {
        if (this.prices.timePrice) return this.prices.timePrice;

        const priceResp = await farmTokenPrices(["wonderland"]);
        this.prices.timePrice = priceResp.wonderland;
        return priceResp.wonderland;
      }

      // if (token === "MIM") {
      //   return 1;
      // }
    },*/,
  },
};
