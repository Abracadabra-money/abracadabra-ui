import { mapGetters } from "vuex";
import { Contract } from "ethers";

import cauldronsConfig from "@/utils/cauldronsConfig";
import bentoBoxAbi from "@/utils/abi/bentoBox";

import { getInterest } from "@/helpers/cauldron/interest";
import {
  getMimCauldronBalance,
  getBorrowlimit,
  getMIMsLeftToBorrow,
} from "@/helpers/cauldron/borrowLimits";
import { getTotalBorrow } from "@/helpers/cauldron/totalBorrow";
import { getCauldronOracleRates } from "@/helpers/cauldron/exchangeRates";

export default {
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      userSigner: "getSigner",
      defaultProvider: "getProvider",
    }),

    contractProvider() {
      return this.userSigner ? this.userSigner : this.defaultProvider;
    },
  },
  methods: {
    async initCauldronsList() {
      const filteredByChain = cauldronsConfig.filter(
        (config) => config.chainId === +this.chainId
      );

      const cauldrons = await Promise.all(
        filteredByChain.map((cauldron) => this.createCauldronItem(cauldron))
      );

      console.log("cauldrons", cauldrons);

      return cauldrons;
    },
    async createCauldronItem(config) {
      const cauldron = new Contract(
        config.contract.address,
        config.contract.abi,
        this.contractProvider
      );

      const interest = await getInterest(config, cauldron);

      const bentoBoxAddress = await cauldron.bentoBox();

      const bentoBox = new Contract(
        bentoBoxAddress,
        bentoBoxAbi,
        this.contractProvider
      );

      const totalCollateralShare = await cauldron.totalCollateralShare();
      const totalCollateralAmount = await bentoBox.toAmount(
        config.collateralInfo.address,
        totalCollateralShare,
        false
      );

      const { oracleRate } = await getCauldronOracleRates(
        cauldron,
        this.contractProvider
      );

      const tvl = totalCollateralAmount.div(oracleRate);

      const totalBorrowed = await getTotalBorrow(cauldron);

      const cauldronMIMBalance = await getMimCauldronBalance(
        bentoBox,
        config.contract.address,
        config.mimInfo.address
      );
      const borrowLimit = await getBorrowlimit(cauldron);

      const MIMsLeftToBorrow = await getMIMsLeftToBorrow(
        cauldronMIMBalance,
        borrowLimit,
        totalBorrowed,
        config.cauldronSettings
      );

      return {
        config,
        interest: interest.toString(),
        tvl: tvl.toString(),
        totalBorrowed,
        MIMsLeftToBorrow: MIMsLeftToBorrow.toString(),
      };
    },
  },
};
