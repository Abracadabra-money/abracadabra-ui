import { mapGetters } from "vuex";
import { Contract, utils } from "ethers";

import cauldronsConfig from "@/utils/borrowPools/pools";
import bentoBoxAbi from "@/utils/abi/bentoBox";

import { getInterest } from "@/helpers/cauldron/interest";
import {
  getMimCauldronBalance,
  getBorrowlimit,
  getMIMsLeftToBorrow,
} from "@/helpers/cauldron/borrowLimits";
import { getTotalBorrow } from "@/helpers/cauldron/totalBorrow";
import { getMaxWithdrawableAmount } from "@/helpers/cauldron/maxWithdrawableAmount";
import { getCauldronOracleRates } from "@/helpers/cauldron/exchangeRates";
import {
  getUserCollateralAmount,
  getUserBorrowPart,
  getLiquidationPrice,
} from "@/helpers/cauldron/position";

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
    async initCauldrons() {
      const filteredByChain = cauldronsConfig.filter(
        (config) => config.contractChain === +this.chainId
      );

      const user = this.account;

      const cauldrons = await Promise.all(
        filteredByChain.map((cauldron) =>
          this.createCauldronItem(cauldron, user)
        )
      );

      console.log("init new cauldrons", cauldrons);
    },
    async createCauldronItem(config, user = null) {
      const contracts = await this.createContracts(config);
      const mainParams = await this.getMainParams(config, contracts);

      const userPosition = user
        ? await this.getUserPosition(config, contracts, user)
        : null;

      const userTokensInfo = user
        ? await this.getUserTokensInfo(contracts, user)
        : null;

      return {
        config,
        contracts,
        mainParams,
        userPosition,
        userTokensInfo,
      };
    },
    async createContracts(config) {
      try {
        const cauldron = new Contract(
          config.contract.address,
          config.contract.abi,
          this.contractProvider
        );

        const bentoBoxAddress = await cauldron.bentoBox();

        const bentoBox = new Contract(
          bentoBoxAddress,
          bentoBoxAbi,
          this.contractProvider
        );

        const collateral = new Contract(
          config.token.address,
          config.token.abi,
          this.contractProvider
        );

        const mim = new Contract(
          config.pairToken.address,
          config.pairToken.abi,
          this.contractProvider
        );

        const leverageSwapper = config.swapContractInfo
          ? new Contract(
              config.swapContractInfo.address,
              config.swapContractInfo.abi,
              this.contractProvider
            )
          : null;

        const liquidationSwapper = config.reverseSwapContractInfo
          ? new Contract(
              config.reverseSwapContractInfo.address,
              config.reverseSwapContractInfo.abi,
              this.contractProvider
            )
          : null;

        const wrapper = config.lpLogic?.tokenWrapper
          ? new Contract(
              config.lpLogic.tokenWrapper,
              config.lpLogic.tokenWrapperAbi,
              this.contractProvider
            )
          : null;

        const unwrappedToken = config.lpLogic?.tokenWrapper
          ? new Contract(
              config.lpLogic.lpAddress,
              config.lpLogic.lpAbi,
              this.contractProvider
            )
          : null;

        return {
          cauldron,
          bentoBox,
          collateral,
          mim,
          leverageSwapper,
          liquidationSwapper,
          unwrappedToken,
          wrapper,
        };
      } catch (error) {
        console.log("createContracts error:", error);
      }
    },
    async getMainParams(config, contracts) {
      try {
        const interest = await getInterest(config, contracts.cauldron);

        const totalCollateralShare =
          await contracts.cauldron.totalCollateralShare();

        const totalCollateralAmount = await contracts.bentoBox.toAmount(
          config.token.address,
          totalCollateralShare,
          false
        );

        const exchangeRates = await getCauldronOracleRates(
          contracts.cauldron,
          this.contractProvider
        );

        const tvl = totalCollateralAmount.div(exchangeRates.oracleRate);

        const totalBorrowed = await getTotalBorrow(contracts.cauldron);

        const cauldronMIMBalance = await getMimCauldronBalance(
          contracts.bentoBox,
          config.contract.address,
          config.pairToken.address
        );

        const borrowLimit = await getBorrowlimit(contracts.cauldron);

        const MIMsLeftToBorrow = await getMIMsLeftToBorrow(
          cauldronMIMBalance,
          borrowLimit,
          totalBorrowed,
          config
        );

        const maxWithdrawableAmount = await getMaxWithdrawableAmount(
          config,
          contracts.collateral,
          contracts.bentoBox.address
        );

        return {
          interest,
          exchangeRates,
          tvl,
          MIMsLeftToBorrow,
          borrowLimit,
          maxWithdrawableAmount,
        };
      } catch (error) {
        console.log("getMainCauldronParams error:", error);
      }
    },
    async getUserPosition(config, contracts, user) {
      try {
        const collateralAmount = await getUserCollateralAmount(
          user,
          contracts.bentoBox,
          contracts.cauldron,
          config.token.address
        );

        const borrowPart = await getUserBorrowPart(contracts.cauldron, user);

        const liquidationPrice = getLiquidationPrice(
          utils.formatUnits(collateralAmount, config.token.decimals),
          utils.formatUnits(borrowPart.userBorrowPart),
          config.ltv
        );

        return {
          collateralAmount,
          borrowPart,
          liquidationPrice,
        };
      } catch (error) {
        console.log("getUserPosition error:", error);
      }
    },
    async getUserTokensInfo(contracts, user) {
      try {
        const collateralBalance = await contracts.collateral.balanceOf(user);
        const mimBalance = await contracts.mim.balanceOf(user);
        const nativeTokenBalance = await this.contractProvider.getBalance();

        const unwrappedTokenBalance = contracts.unwrappedToken
          ? await contracts.unwrappedToken.balanceOf(user)
          : null;
        const unwrappedTokenAllowance = contracts.unwrappedToken
          ? await contracts.unwrappedToken.allowance(
              user,
              contracts.bentoBox.address
            )
          : null;

        const collateralAllowance = await contracts.collateral.allowance(
          user,
          contracts.bentoBox.address
        );

        const mimAllowance = await contracts.mim.allowance(
          user,
          contracts.bentoBox.address
        );

        return {
          collateralBalance,
          mimBalance,
          nativeTokenBalance,
          collateralAllowance,
          mimAllowance,
          unwrappedTokenBalance,
          unwrappedTokenAllowance,
        };
      } catch (error) {
        console.log("getUserTokensInfo error:", error);
      }
    },
  },
};
