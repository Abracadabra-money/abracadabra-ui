<template>
  <div class="add-liquidity-block">
    <h2>Select Pool</h2>
    <InputDropdown
      :destinationAddress="poolInfo?.address"
      :dropdownList="poolList"
      :isDisabled="false"
      placeholder="Enter the Pool address or select from the list"
      @changeTokenAddress="changeTokenAddress"
      @update-input="updateTokenAddress"
    />

    <div class="action-block" v-if="poolInfo && pool">
      <BaseTokenInput
        class="base-input"
        :name="pool.tokens.baseToken.config.name"
        :icon="pool.tokens.baseToken.config.icon"
        :decimals="pool.tokens.baseToken.config.decimals"
        :max="pool.tokens.baseToken.userInfo.balance"
        :tokenPrice="pool.tokens.baseToken.price"
        :value="baseInputValue"
        @updateInputValue="updateValue($event, true)"
      />

      <BaseTokenInput
        class="quote-input"
        :name="pool.tokens.quoteToken.config.name"
        :icon="pool.tokens.quoteToken.config.icon"
        :decimals="pool.tokens.quoteToken.config.decimals"
        :max="pool.tokens.quoteToken.userInfo.balance"
        :tokenPrice="pool.tokens.quoteToken.price"
        :value="quoteInputValue"
        @updateInputValue="updateValue($event)"
      />

      <BaseButton primary @click="actionHandler" :disabled="isButtonDisabled">
        {{ buttonText }}
      </BaseButton>

      <PoolComposition :pool="pool" />
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { Contract } from "ethers";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { formatUnits, parseUnits } from "viem";
import poolsConfig from "@/configs/pools/pools";
import { approveToken } from "@/helpers/approval";
import { formatToFixed } from "@/helpers/filters";
import { trimZeroDecimals } from "@/helpers/numbers";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { mapActions, mapGetters, mapMutations } from "vuex";
// @ts-ignore
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter.js";
import notification from "@/helpers/notification/notification";
import { previewAddLiquidity } from "@/helpers/pools/swap/liquidity";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";
// @ts-ignore
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export default {
  data() {
    return {
      baseInputAmount: 0n,
      baseInputValue: "",
      quoteInputAmount: 0n,
      quoteInputValue: "",
      poolInfo: null as any,
      slippage: 100n,
      deadline: 100n,
      pool: null as any,
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      userSigner: "getSigner",
    }),

    isProperNetwork() {
      return this.chainId == this.pool.chainId;
    },

    error() {
      if (this.baseInputAmount > this.baseToken.userInfo?.balance)
        return `Insufficient ${this.baseToken.config.name} balance`;

      if (this.quoteInputAmount > this.quoteToken.userInfo?.balance)
        return `Insufficient ${this.quoteToken.config.name} balance`;

      return null;
    },

    isBaseTokenApproved() {
      return (
        this.pool.tokens.baseToken.userInfo.allowance >=
        this.previewAddLiquidityResult.baseAdjustedInAmount
      );
    },

    isQuoteTokenApproved() {
      return (
        this.pool.tokens.quoteToken.userInfo.allowance >=
        this.previewAddLiquidityResult.quoteAdjustedInAmount
      );
    },

    isValid() {
      return !!this.baseInputAmount && !!this.quoteInputAmount;
    },

    isButtonDisabled() {
      return (
        (!this.isValid || !!this.error || this.isActionProcessing) &&
        this.isProperNetwork &&
        !!this.account
      );
    },

    poolList() {
      const filteredPools = poolsConfig.filter(
        (config) => config.chainId === +this.chainId
      );

      return filteredPools.map((config) => {
        return {
          chainId: config.chainId,
          id: config.id,
          name: config.name,
          address: config.contract.address,
          icon: config.icon,
          baseToken: config.baseToken,
          quoteToken: config.quoteToken,
        };
      });
    },

    previewAddLiquidityResult() {
      const previewAddLiquidityResult = previewAddLiquidity(
        this.baseInputAmount,
        this.quoteInputAmount,
        this.pool
      );

      previewAddLiquidityResult.shares = applySlippageToMinOutBigInt(
        this.slippage,
        previewAddLiquidityResult.shares
      );

      return previewAddLiquidityResult;
    },

    baseToken() {
      return this.pool.tokens.baseToken;
    },
    quoteToken() {
      return this.pool.tokens.quoteToken;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect wallet";
      if (this.error) return this.error;
      if (this.baseInputValue == "" || this.quoteInputValue == "")
        return `Enter amount`;

      if (this.isActionProcessing) return "Processing...";

      if (!this.isBaseTokenApproved)
        return `Approve ${this.pool.tokens.baseToken.config.name}`;
      if (!this.isQuoteTokenApproved)
        return `Approve ${this.pool.tokens.quoteToken.config.name}`;

      return "Deposit";
    },
  },

  watch: {
    async poolInfo() {
      await this.getPoolInfo();
    },
  },

  methods: {
    formatUnits,
    formatToFixed,
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    changeTokenAddress(poolInfo: any) {
      this.poolInfo = poolInfo;
    },

    updateTokenAddress(address: string) {
      this.poolInfo = {
        icon: useImage("assets/images/base_select_icon.png"),
        address: address,
        name: "",
      };
    },

    clearData() {
      this.baseInputAmount = 0n;
      this.quoteInputAmount = 0n;
      this.baseInputValue = "";
      this.quoteInputValue = "";
    },

    createDepositPayload() {
      const { baseAdjustedInAmount, quoteAdjustedInAmount, shares } =
        this.previewAddLiquidityResult;
      const deadline = moment().unix() + Number(this.deadline);

      return {
        lp: this.pool?.contract?.address,
        to: this.account,
        baseInAmount: baseAdjustedInAmount,
        quoteInAmount: quoteAdjustedInAmount,
        minimumShares: shares,
        deadline,
      };
    },

    updateValue(value: any, fromBase = false) {
      if (value === null) {
        this.clearData();
        return false;
      }

      const otherTokenCurrentAmount = fromBase
        ? this.quoteInputAmount
        : this.baseInputAmount;

      const adjustmendResults = this.calculateAdjustmentAmounts(
        value,
        otherTokenCurrentAmount,
        fromBase
      );

      this.updateTokenInputs(adjustmendResults);
    },

    updateTokenInputs(adjustmendResults: any) {
      this.baseInputAmount = adjustmendResults.baseAdjustedInAmount;
      this.quoteInputAmount = adjustmendResults.quoteAdjustedInAmount;
      this.quoteInputValue = trimZeroDecimals(
        formatUnits(
          adjustmendResults.quoteAdjustedInAmount,
          this.quoteToken.config.decimals
        )
      );
      this.baseInputValue = trimZeroDecimals(
        formatUnits(
          adjustmendResults.baseAdjustedInAmount,
          this.baseToken.config.decimals
        )
      );
    },

    calculateAdjustmentAmounts(
      fromTokenAmount: any,
      currentToTokenAmount = 0n,
      fromBase = false
    ) {
      if (currentToTokenAmount !== 0n) {
        const baseTokenAmount = fromBase
          ? fromTokenAmount
          : currentToTokenAmount;
        const quoteTokenAmount = fromBase
          ? currentToTokenAmount
          : fromTokenAmount;
        const initialResults = previewAddLiquidity(
          baseTokenAmount,
          quoteTokenAmount,
          this.pool
        );

        if (
          initialResults.baseAdjustedInAmount === baseTokenAmount &&
          initialResults.quoteAdjustedInAmount === quoteTokenAmount
        ) {
          return initialResults;
        }
      }

      const deviationFactor = 120n;
      const ratePresicion = parseUnits("1", 18);

      const fromToken = {
        tokenReserve: fromBase
          ? this.pool.vaultReserve[0]
          : this.pool.vaultReserve[1],
        tokenInfo: fromBase ? this.baseToken : this.quoteToken,
      };

      const toToken = {
        tokenReserve: fromBase
          ? this.pool.vaultReserve[1]
          : this.pool.vaultReserve[0],
        tokenInfo: fromBase ? this.quoteToken : this.baseToken,
      };

      const fromTokenPrice = fromToken.tokenInfo.price;
      const toTokenPrice = toToken.tokenInfo.price;

      const fromTokenValue =
        fromToken.tokenReserve * parseUnits(fromTokenPrice.toString(), 18);

      const toTokenValue =
        toToken.tokenReserve * parseUnits(toTokenPrice.toString(), 18);
      const rate = (fromTokenValue * ratePresicion) / toTokenValue;

      const toTokenAmount = (fromTokenAmount * ratePresicion) / rate;

      const toTokenUpdated = fromBase
        ? (toTokenAmount * deviationFactor) / 100n
        : (toTokenAmount * deviationFactor) / 100n;

      const baseTokenAmount = fromBase ? fromTokenAmount : toTokenUpdated;
      const quoteTokenAmount = fromBase ? toTokenUpdated : fromTokenAmount;

      const previewAddLiquidityResults = previewAddLiquidity(
        baseTokenAmount,
        quoteTokenAmount,
        this.pool
      );

      return previewAddLiquidityResults;
    },

    async getPoolInfo() {
      this.pool = await getPoolInfo(
        Number(this.poolInfo.chainId),
        Number(this.poolInfo.id),
        this.account
      );
    },

    async approveHandler() {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      let tokenContract;

      if (!this.isBaseTokenApproved) {
        const { address, abi } = this.pool.tokens.baseToken.config.contract;
        tokenContract = new Contract(address, abi, this.userSigner);
      } else {
        const { address, abi } = this.pool.tokens.quoteToken.config.contract;
        tokenContract = new Contract(address, abi, this.userSigner);
      }

      try {
        await approveToken(tokenContract, this.pool.swapRouter);
        await this.getPoolInfo();
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      } catch (error) {
        console.log("Approve Handler Err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
      this.isActionProcessing = false;
    },

    async depositHandler() {
      this.isActionProcessing = true;
      const notificationId = await this.createNotification(
        notification.pending
      );

      try {
        await this.addLiquidity();
        await this.getPoolInfo();
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
        this.clearData();
      } catch (error) {
        console.log("Add Liquidity Err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }

      this.isActionProcessing = false;
    },

    async addLiquidity() {
      const contract = new Contract(
        this.pool!.swapRouter,
        BlastMIMSwapRouterAbi,
        this.userSigner
      );

      const { lp, to, baseInAmount, quoteInAmount, minimumShares, deadline } =
        this.createDepositPayload();

      const estimateGas = await contract.estimateGas.addLiquidity(
        lp,
        to,
        baseInAmount,
        quoteInAmount,
        minimumShares,
        deadline
      );

      const gasLimit = 1000 + +estimateGas.toString();

      const tx = await contract.addLiquidity(
        lp,
        to,
        baseInAmount,
        quoteInAmount,
        minimumShares,
        deadline,
        {
          gasLimit,
        }
      );

      return await tx.wait();
    },

    actionHandler() {
      if (this.isActionProcessing) return false;

      if (!this.isBaseTokenApproved || !this.isQuoteTokenApproved) {
        return this.approveHandler();
      }

      this.depositHandler();
    },
  },

  components: {
    InputDropdown: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/ui/inputs/InputDropdown.vue")
    ),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    PoolComposition: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/pools/pool/PoolComposition.vue")
    ),
  },
};
</script>

<style scoped>
.add-liquidity-block {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.action-block {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.token-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-icon {
  width: 24px;
  height: 24px;
}
</style>
