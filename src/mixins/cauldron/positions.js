import { mapGetters } from "vuex";
import { Contract, utils, BigNumber } from "ethers";

import cauldronsConfig from "@/utils/cauldronsConfig";
import bentoBoxAbi from "@/utils/abi/bentoBox";

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
    async checkCauldronPositions() {
      const filteredByChain = cauldronsConfig.filter(
        (config) => config.chainId === +this.chainId
      );

      const cauldrons = await Promise.all(
        filteredByChain.map((cauldron) =>
          this.checkIndividualPosition(cauldron)
        )
      );

      const positions = cauldrons.filter((info) => {
        return (
          info.collateralAmount.gt(0) ||
          info.borrowPart.contractBorrowPart.gt(0)
        );
      });

      const statistics = this.getUserStatistics(positions);

      console.log("userPositions", positions);
      console.log("statistics", statistics);

      return positions;
    },
    getUserStatistics(positions) {
      const collateralDeposited = positions.reduce((accumulator, position) => {
        const collateralValue = position.collateralAmount
          .mul(1e2)
          .div(position.oracleRate);
        return accumulator.add(collateralValue);
      }, BigNumber.from(0));

      const mimBorrowed = positions.reduce((accumulator, position) => {
        return accumulator.add(position.borrowPart.userBorrowPart);
      }, BigNumber.from(0));

      return {
        collateralDepositedInUsd: utils.formatUnits(collateralDeposited, 2),
        mimBorrowed: utils.formatUnits(mimBorrowed),
      };
    },
    async checkIndividualPosition(config) {
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

      const { oracleRate } = await getCauldronOracleRates(
        cauldron,
        this.contractProvider
      );

      const collateralAmount = await getUserCollateralAmount(
        this.account,
        bentoBox,
        cauldron,
        config.collateralInfo.address
      );

      const borrowPart = await getUserBorrowPart(cauldron, this.account);

      const liquidationPrice = getLiquidationPrice(
        utils.formatUnits(collateralAmount, config.collateralInfo.decimals),
        utils.formatUnits(borrowPart.userBorrowPart),
        config.mcr
      );

      return {
        config,
        oracleRate,
        collateralAmount,
        borrowPart,
        liquidationPrice,
      };
    },
  },
};
