import { markRaw } from "vue";
import mimTokenInfo from "@/utils/contracts/mimToken";
import bentoContractsInfo from "@/utils/contracts/master";
import degenBoxInfo from "@/utils/contracts/degenBox";
import tokensInfo from "@/utils/tokens/addedTokens.js";
import { tokensChainLink } from "@/utils/chainLink/config";
import { getTokenPriceByChain } from "@/helpers/getTokenPriceByChain";

export default {
  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAccount;
    },
    mimInfo() {
      let id = this.chainId || 1;

      return tokensInfo.find(
        (token) => token.name === "MIM" && token.chain === id
      );
    },
  },
  methods: {
    async createMimBentoInfo() {
      const currentMim = mimTokenInfo.find(
        (token) => token.chainId === this.chainId
      );

      const currentBento = bentoContractsInfo.find(
        (contract) => contract.chainId === this.chainId
      );

      const currentDegen = degenBoxInfo.find(
        (contract) => contract.chainId === this.chainId
      );

      if (!currentMim) {
        return false;
      }

      let degenBoxContract = null;
      let mimInDegenBalance = null;

      if (currentDegen) {
        degenBoxContract = new this.$ethers.Contract(
          currentDegen.address,
          JSON.stringify(currentDegen.abi),
          this.signer
        );

        const mimInDegenBalanceShare = await degenBoxContract.balanceOf(
          currentMim.address,
          this.account
        );

        mimInDegenBalance = await degenBoxContract.toAmount(
          currentMim.address,
          mimInDegenBalanceShare,
          false
        );
      }

      let bentoBoxContract = null;
      let mimInBentoBalance = null;

      if (currentBento) {
        bentoBoxContract = new this.$ethers.Contract(
          currentBento.address,
          JSON.stringify(currentBento.abi),
          this.signer
        );

        const mimInBentoShare = await bentoBoxContract?.balanceOf(
          currentMim.address,
          this.account
        );

        mimInBentoBalance = await bentoBoxContract?.toAmount(
          currentMim.address,
          mimInBentoShare,
          false
        );
      }

      const mimContract = new this.$ethers.Contract(
        currentMim.address,
        JSON.stringify(currentMim.abi),
        this.signer
      );

      const mimBalance = await mimContract.balanceOf(this.account);

      const mimPrice = await getTokenPriceByChain(
        tokensChainLink.mim.chainId,
        tokensChainLink.mim.address
      );

      const bentoBalance = await bentoBoxContract?.balanceOf(
        currentMim.address,
        this.account
      );
      const bentoExactBalance = bentoBalance?.toString();

      const degenBalance = await degenBoxContract?.balanceOf(
        currentMim.address,
        this.account
      );
      const degenExactBalance = degenBalance?.toString();

      const bentoAddressApproved = bentoBoxContract
        ? await mimContract.allowance(this.account, bentoBoxContract.address)
        : null;
      const bentoAllowance = bentoBoxContract
        ? parseFloat(bentoAddressApproved.toString()) > 0
        : false;

      const degenAddressApproved = degenBoxContract
        ? await mimContract.allowance(this.account, degenBoxContract.address)
        : null;
      const degenAllowance = degenBoxContract
        ? parseFloat(degenAddressApproved.toString()) > 0
        : false;

      const mimOnBentoDeposit = {
        mimBalance,
        mimPrice,
        mimInBentoBalance,
        bentoBoxContract,
        degenBoxContract,
        mimInDegenBalance,
        mimContract,
        tokenInfo: currentMim,
        bentoExactBalance,
        degenExactBalance,
        bentoAllowance,
        degenAllowance,
      };

      this.$store.commit(
        "setMimInBentoDepositObject",
        markRaw(mimOnBentoDeposit)
      );
    },
  },
};
