import farmPools from "@/utils/farmPools/pools";
import { getTokenPriceByAddress } from "../helpers/priceHelper";
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters({
      userSigner: "getSigner",
      defaultProvider: "getProvider",
    }),
    chainId() {
      return this.$store.getters.getChainId;
    },
    signer() {
      return this.userSigner ? this.userSigner : this.defaultProvider;
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
    getFarmAddressByName(name) {
      const exceptPriceAddresses = {
        SPELL: "0x090185f2135308bad17527004364ebcc2d37e5f6",
        MIM: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
        WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      };
      const exceptAddress = exceptPriceAddresses[name.toUpperCase()];
      if (exceptAddress) return exceptAddress;
      return (
        farmPools.find(({ name: poolName }) => poolName === name)?.address ||
        null
      );
    },
    async priceByName(name) {
      return await getTokenPriceByAddress(this.chainId, [
        this.getFarmAddressByName(name),
      ]);
    },
    async createFarmPools() {
      if (!this.pools.length) {
        this.setLoadingPoolsFarm(true);
      }
      const chainPools = farmPools.filter(
        (pool) => pool.contractChain === this.chainId
      );

      try {
        const pools = await Promise.all(
          chainPools.map((pool) => this.createFarmPool(pool))
        );
        this.setLoadingPoolsFarm(false);

        this.$store.commit("setFarmPools", pools);
      } catch (e) {
        console.log("createFarmPools err", e);
      }
    },
    async getFarmPoolUserData({
      erc20ContractInstance,
      farmPoolInfo,
      contractInstance,
      lpPrice,
    }) {
      let tokensBalanceInfo = null;

      const allowance = await this.getAllowance(
        erc20ContractInstance,
        farmPoolInfo.contract.address
      );

      const userInfo = await contractInstance.userInfo(
        farmPoolInfo.poolId,
        this.account
      );

      const userReward = await contractInstance.pendingIce(
        farmPoolInfo.poolId,
        this.account
      );

      if (farmPoolInfo.depositedBalance) {
        const { _reserve0, _reserve1 } =
          await erc20ContractInstance.getReserves();

        //MIM or SPELL
        let token0Price = await this.priceByName(
          farmPoolInfo.depositedBalance.token0.name
        );

        // ETH always
        let token1Price = await this.priceByName("WETH");

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

        const userRewardInUsd = userRewardParsed * lpPrice;

        const token0UserAmount =
          ((userRewardInUsd / 100) * token0Percent) / token0Price;
        const token1UserAmount =
          ((userRewardInUsd / 100) * token1Percent) / token1Price;

        tokensBalanceInfo = {
          token0: {
            name: farmPoolInfo.depositedBalance.token0.name,
            amount: token0UserAmount,
            amountInUsd: token0UserAmount * token0Price,
          },
          token1: {
            name: farmPoolInfo.depositedBalance.token1.name,
            amount: token1UserAmount,
            amountInUsd: token1UserAmount * token1Price,
          },
        };
      }

      const accountBalance = await erc20ContractInstance.balanceOf(
        this.account
      );

      const balance = this.$ethers.utils.formatEther(accountBalance.toString());

      return {
        userInfo,
        userReward,
        allowance,
        tokensBalanceInfo,
        balance,
      };
    },
    async createFarmPool(farmPoolInfo) {
      const contractInstance = new this.$ethers.Contract(
        farmPoolInfo.contract.address,
        JSON.stringify(farmPoolInfo.contract.abi),
        this.signer
      );

      let poolInfo;

      try {
        poolInfo = await contractInstance.poolInfo(farmPoolInfo.poolId, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("pool infi err:", e);
      }

      const erc20ContractInstance = new this.$ethers.Contract(
        poolInfo.stakingToken,
        JSON.stringify(farmPoolInfo.erc20Abi),
        this.signer
      );

      let tokenContractInstance = new this.$ethers.Contract(
        farmPoolInfo.token.address,
        JSON.stringify(farmPoolInfo.erc20Abi),
        this.signer
      );

      let tokenPrice = await this.priceByName(
        farmPoolInfo.id === 3 || (this.account && farmPoolInfo.id === 1)
          ? "Spell"
          : farmPoolInfo.id === 1
          ? "MIM"
          : farmPoolInfo.token.name
      );

      let spellPrice = await this.priceByName("Spell");

      let { lpYield, lpPrice } = await this.getLPYield(
        poolInfo.stakingToken,
        tokenContractInstance,
        erc20ContractInstance,
        tokenPrice
      );

      let poolYield = await this.getYield(
        contractInstance,
        lpYield,
        poolInfo.stakingTokenTotalAmount,
        poolInfo.allocPoint,
        poolInfo.accIcePerShare
      );

      if (farmPoolInfo.id === 3) {
        const stakingTokenContract = new this.$ethers.Contract(
          poolInfo.stakingToken,
          JSON.stringify(farmPoolInfo.stakingTokenAbi),
          this.signer
        );

        try {
          const price = await stakingTokenContract.get_virtual_price();

          const parsedPrice = this.$ethers.utils.formatEther(price.toString());

          if (parsedPrice) lpPrice = parsedPrice;
        } catch (e) {
          console.log("get price err:", e);
        }

        poolYield = await this.getYield(
          contractInstance,
          1000,
          poolInfo.stakingTokenTotalAmount,
          poolInfo.allocPoint,
          poolInfo.accIcePerShare
        );
      }

      let poolRoi = await this.getRoi(
        poolYield,
        farmPoolInfo.id === 1 ? spellPrice : tokenPrice
      );

      const poolTvl = await this.getTVL(
        poolInfo.stakingTokenTotalAmount,
        lpPrice
      );

      const userData = this.account
        ? await this.getFarmPoolUserData({
            erc20ContractInstance,
            farmPoolInfo,
            contractInstance,
            lpPrice,
          })
        : null;

      return {
        name: farmPoolInfo.name,
        iconName: farmPoolInfo.iconName,
        nameSubtitle: farmPoolInfo.nameSubtitle,
        stakingTokenLink: farmPoolInfo.stakingTokenLink,
        stakingTokenIcon: farmPoolInfo.stakingTokenIcon,
        id: farmPoolInfo.id,
        poolId: farmPoolInfo.poolId,
        contractInstance,
        stakingTokenName: farmPoolInfo.stakingTokenName,
        stakingTokenType: farmPoolInfo.stakingTokenType,
        lpPrice,
        contractAddress: farmPoolInfo.contract.address,
        poolInfo,
        erc20ContractInstance,
        tokenPrice,
        poolYield,
        poolRoi,
        poolTvl,
        tokenName: farmPoolInfo.token.name,
        userData,
      };
    },
    async getFarmPoolYield() {
      try {
        const poolYield = (await this.getYield()) / this.icePrice;
        this.yieldPerDollar = parseFloat(poolYield).toFixed(2);
        await this.getRoi(poolYield);
      } catch (e) {
        console.log("getFarmPoolYield err:", e);
      }
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

        return parseInt(tvl)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } catch (error) {
        console.log(error);
      }
    },
    async getAllowance(contractInstance, allowAddrr) {
      try {
        const result = await contractInstance.allowance(
          this.account,
          allowAddrr
        );

        return +result > 0;
      } catch (error) {
        console.log("getAllowance:", error);
      }
    },
  },
};
