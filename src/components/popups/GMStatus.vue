<template>
  <div class="popup-wrap">
    <div class="popup-header">
      <h4 class="popup-title">GM Leverage/Deleverage</h4>
    </div>
    <div class="popup-content">
      <div class="status-wrap raw">
        <p>Status:</p>
        <p class="status-text">{{ stateText }}</p>
      </div>

      <div class="balances-info info-wrap" v-if="balancesInfo.length">
        <p class="title">Orders balances:</p>
        <div class="raw" v-for="(info, idx) in balancesInfo" :key="idx">
          <div class="token-info">
            <img class="token-icon" img :src="info.icon" />
            {{ info.name }}
          </div>
          <p>{{ info.balance }}</p>
        </div>
      </div>

      <div class="raw btns-wrap">
        <button :disabled="buttonDisable" class="btn">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useImage } from "@/helpers/useImage";
import filters from "@/filters/index.js";
import { mapGetters, mapActions, mapMutations } from "vuex";

import { utils } from "ethers";

import {
  ORDER_PENDING,
  ORDER_SUCCESS,
  ORDER_FAIL,
  ORDER_TYPE_LEVERAGE,
  ORDER_TYPE_DELEVERAGE,
  monitorOrderStatus,
  getOrderBalances,
} from "@/helpers/gm/orders";

const STATE_PENDING = 1;
const STATE_SUCCESS = 2;
const STATE_FAIL = 3;
const STATE_RECOVER = 5;
const STATE_DELEVERAGE = 6;
const STATE_REFUND = 7;
const STATE_CANCEL = 8;

const stateTitles = {
  [ORDER_TYPE_LEVERAGE]: {
    [STATE_PENDING]: "Order pending",
    [STATE_SUCCESS]: "Order successful",
    [STATE_FAIL]: "Order failure",
    [STATE_REFUND]: "WETH Refunding",
    [STATE_CANCEL]: "Cancel order",
    [STATE_RECOVER]: "New order creation",
  },
  [ORDER_TYPE_DELEVERAGE]: {
    [STATE_PENDING]: "Order pending",
    [STATE_SUCCESS]: "Order successful",
    [STATE_FAIL]: "Order failure",
    [STATE_DELEVERAGE]: "Deleverage from order",
    [STATE_CANCEL]: "Cancel order",
    [STATE_RECOVER]: "New order creation",
  },
};

export default {
  name: "GMStatusPopup",
  props: {
    order: {
      type: String,
      required: true,
    },
    cauldronObject: {
      type: Object,
      required: true,
    },
    orderType: {
      type: Number,
      required: true,
      // default: 1
    },
    deleverageSuccessPayload: {
      type: Object,
    },
    refundWeth: {
      type: Function,
    },
    deleverageFromOrder: {
      type: Function,
    },
    recoverDeleverageOrder: {
      type: Function,
    },
  },
  data() {
    return {
      processState: STATE_PENDING, // by default
      balances: null,
    };
  },
  watch: {
    async order(order) {
      this.clearInfo();

      if (this.orderType === ORDER_TYPE_LEVERAGE)
        return await orderMonitorLeverage(
          order,
          this.cauldronObject,
          this.account,
          this.provider
        );

      if (this.orderType === ORDER_TYPE_DELEVERAGE)
        return await orderMonitorDeleverage(
          order,
          this.cauldronObject,
          this.account,
          this.provider,
          this.deleverageSuccessPayload
        );
    },
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),
    popupTitle() {
      if (this.orderType === ORDER_TYPE_LEVERAGE) return "GM Leverage";
      if (this.orderType === ORDER_TYPE_DELEVERAGE) return "GM Deleverage";

      return "GM transaction status";
    },
    stateText() {
      return stateTitles[ORDER_TYPE_LEVERAGE][this.processState]; // TODO this.orderType
    },
    buttonText() {
      if (this.orderType === ORDER_TYPE_LEVERAGE) {
        // if (this.processState === STATE_PENDING) return "Cancel";
        if (this.processState === STATE_SUCCESS) return "Refund WETH";
        if (this.processState === STATE_FAIL) return "Recover";
      }
      if (this.orderType === ORDER_TYPE_DELEVERAGE) {
        // if (this.processState === STATE_PENDING) return "Cancel";
        if (this.processState === STATE_FAIL) return "Recover";
      }

      return "...";
    },
    buttonDisable() {
      return this.buttonText === "...";
    },
    balancesInfo() {
      if (!this.balances) return [];

      const { balanceWETH, balanceUSDC, balanceGM } = this.balances;

      // const balanceWETH = utils.parseUnits("0.0000234");
      // const balanceUSDC = utils.parseUnits("444.124", 6);
      // const balanceGM = utils.parseUnits("435.1754");

      const balances = [];

      if (balanceUSDC.gt(0))
        balances.push({
          name: "USDC",
          icon: useImage(`assets/images/tokens/USDC.png`),
          balance: this.formatTokenBalance(utils.formatUnits(balanceUSDC, 6)),
        });

      if (balanceGM.gt(0))
        balances.push({
          name: "GM",
          icon: useImage(`assets/images/tokens/GLP.png`),
          balance: this.formatTokenBalance(utils.formatUnits(balanceGM)),
        });

      if (balanceWETH.gt(0))
        balances.push({
          name: "WETH",
          icon: useImage(`assets/images/tokens/WETH.png`),
          balance: this.formatTokenBalance(utils.formatUnits(balanceWETH)),
        });

      return balances;
    },
  },
  methods: {
    async actionHanlder() {
      if (this.orderType === ORDER_TYPE_LEVERAGE) {
        if (this.processState === STATE_PENDING) {
          this.$emit("cancelOrder");
          this.processState = STATE_CANCEL;
        }
        if (this.processState === STATE_SUCCESS) {
          this.processState = STATE_REFUND;
          await this.refundWeth();
        }
        if (this.processState === STATE_FAIL) {
          this.$emit("recoverLeverageOrder");
          this.processState = STATE_RECOVER;
        }
      }
      if (this.orderType === ORDER_TYPE_DELEVERAGE) {
        if (this.processState === STATE_PENDING) {
          this.$emit("cancelOrder");
          this.processState = STATE_CANCEL;
        }
        if (this.processState === STATE_FAIL) {
          this.recoverDeleverageOrder(this.order);
          this.processState = STATE_RECOVER;
        }
      }
    },
    async orderMonitorLeverage(order, cauldronObject, account, provider) {
      const { cauldron } = cauldronObject.contracts;
      const orderStatus = await monitorOrderStatus(
        order,
        cauldron,
        account,
        provider
      );

      if (orderStatus === ORDER_SUCCESS) {
        this.balances = getOrderBalances(order, provider);
        this.processState = STATE_SUCCESS;
      }

      if (orderStatus === ORDER_FAIL) {
        this.balances = getOrderBalances(order, provider);
        this.processState = STATE_FAIL;
      }
    },
    async orderMonitorDeleverage(
      order,
      cauldronObject,
      account,
      provider,
      successPayload
    ) {
      const { cauldron } = cauldronObject.contracts;

      const orderStatus = await monitorOrderStatus(
        order,
        cauldron,
        account,
        provider
      );

      if (orderStatus === ORDER_SUCCESS) {
        this.balances = getOrderBalances(order, provider);
        // this.processState = STATE_SUCCESS;
        // TODO add timeout

        this.processState = STATE_DELEVERAGE;
        await this.deleverageFromOrder(
          this.order,
          this.deleverageSuccessPayload
        );
      }

      if (orderStatus === ORDER_FAIL) {
        this.balances = getOrderBalances(order, provider);
        this.processState = ORDER_FAIL;
      }
    },
    formatTokenBalance(amount) {
      return filters.formatTokenBalance(amount);
    },
    clearInfo() {
      this.processState = STATE_PENDING;
      this.balances = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-wrap {
  display: grid;
  grid-template-rows: auto 1fr;
  width: 380px;
  max-width: 100%;
}

.popup-header {
  padding: 10px 10px 20px 10px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}

.popup-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  margin-bottom: 10px;
}

.popup-content {
  padding: 10px 10px 20px 10px;
}

.raw {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 4px 0;

  &.btns-wrap {
    justify-content: flex-end;
  }
}

.balances-info {
  font-size: 14px;

  .title {
    font-size: 16px;
    margin-bottom: 5px;
  }
}

.token-info {
  display: flex;
  align-items: center;

  .token-icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
    margin-right: 5px;
  }
}

.info-wrap,
.status-wrap {
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 0;
}

.btn {
  min-width: 84px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 3px 0;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
  }
}
</style>
