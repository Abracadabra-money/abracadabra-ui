<template>
  <div class="popup-wrap">
    <div class="popup-header">
      <img :src="cauldronObject.config.icon" alt="" class="cauldron-icon" />
      <h4 class="popup-title">{{ popupTitle }}</h4>
    </div>
    <div class="popup-content">
      <div class="failed-wrap" v-if="isFailedLeverage">
        <img src="@/assets/images/order-fail.svg" alt="" class="status-img" />
        <p class="status-text">Failed due to the slippage error</p>

        <div class="balance-info" v-if="balancesInfo.length">
          <p class="balance-title">Order balance:</p>
          <div
            class="token-info"
            v-for="(info, idx) in balancesInfo"
            :key="idx"
          >
            <img class="token-icon" :src="info.icon" />
            {{ info.balance }}
          </div>
        </div>
      </div>

      <div class="proccess-wrap" v-else-if="isCreatedDeleverage">
        <div class="step-wrap">
          <div class="indecator-wrap">
            <img :src="successIcon" alt="" class="status-icon" />
            <div class="line success"></div>
          </div>
          <div class="info-wrap">
            <p class="info-title">Order created</p>
            <div class="balance-info" v-if="balancesInfo.length">
              <p class="balance-title">Order balance:</p>
              <div
                class="token-info"
                v-for="(info, idx) in balancesInfo"
                :key="idx"
              >
                <img class="token-icon" :src="info.icon" />
                {{ info.balance }}
              </div>
            </div>
          </div>
        </div>

        <div class="step-wrap">
          <div class="indecator-wrap">
            <div
              class="line"
              :class="{
                failed: isFailedDeleverage,
              }"
            ></div>
            <img
              :src="isFailedDeleverage ? failedIcon : pendingIcon"
              alt=""
              class="status-icon"
            />
          </div>
          <div class="info-wrap second-step">
            <p class="info-title">Deleverage</p>
            <p v-if="isFailedDeleverage" class="info-subtitle">
              Transaction rejected
            </p>
            <p v-else class="info-subtitle">
              Confirm transaction in your wallet
            </p>
          </div>
        </div>
      </div>

      <div class="pending-wrap" v-else>
        <BaseLoader />
      </div>
    </div>

    <div class="btns-wrap" v-if="!buttonDisable">
      <button
        class="retry-btn"
        @click="actionHandler"
        :disabled="buttonDisable"
      >
        <img src="@/assets/images/retry-btn.svg" alt="" />
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import BaseLoader from "@/components/base/BaseLoader.vue";
import { useImage } from "@/helpers/useImage";
import filters from "@/filters/index.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification.js";
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

const STATE_PENDING = 0;
const STATE_SUCCESS = 1;
const STATE_FAIL = 2;
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

import FAIL_ICON from "@/assets/images/order-fail.svg";
import SUCCESS_ICON from "@/assets/images/order-success.svg";
import PENDING_ICON from "@/assets/images/order-pending.svg";

export default {
  name: "GMStatusPopup",
  props: {
    order: {
      required: true,
    },
    cauldronObject: {
      type: Object,
      required: true,
    },
    orderType: {
      type: Number,
      required: true,
    },
    deleverageSuccessPayload: {
    },
    refundWeth: {
    },
    deleverageFromOrder: {
    },
    successLeverageCallback: {
    },
  },
  data() {
    return {
      processState: STATE_PENDING, // by default
      balances: null,
      deleverageinProgress: false,
      successIcon: SUCCESS_ICON,
      failedIcon: FAIL_ICON,
      pendingIcon: PENDING_ICON,
    };
  },
  watch: {
    async order(order) {
      await this.monitoringHandler(order);
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
    isFailedDeleverage() {
      return this.processState === 6 && this.deleverageinProgress === false;
    },
    isCreatedDeleverage() {
      return this.orderType === 2 && this.processState !== 0;
    },
    isFailedLeverage() {
      return this.orderType === 1 && this.processState === 2;
    },
    stateText() {
      return stateTitles[this.orderType][this.processState];
    },
    buttonText() {
      if (this.orderType === ORDER_TYPE_LEVERAGE) {
        if (this.processState === STATE_FAIL) return "Retry Leverage";
      }
      if (this.orderType === ORDER_TYPE_DELEVERAGE) {
        if (
          this.processState === STATE_DELEVERAGE &&
          this.deleverageinProgress === false
        )
          return "Retry Deleverage";
      }

      return "...";
    },
    buttonDisable() {
      return this.buttonText === "...";
    },
    balancesInfo() {
      if (!this.balances) return [];

      const { balanceWETH, balanceUSDC } = this.balances;

      const balances = [];

      if (balanceUSDC.gt(0))
        balances.push({
          name: "USDC",
          icon: useImage(`assets/images/tokens/USDC.png`),
          balance: this.formatTokenBalance(utils.formatUnits(balanceUSDC, 6)),
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
    ...mapActions({ createNotification: "notifications/new" }),
    async actionHandler() {
      if (this.orderType === ORDER_TYPE_LEVERAGE) {
        if (this.processState === STATE_FAIL) {
          this.$emit("recoverLeverageOrder");
          this.processState = STATE_RECOVER;
        }
      }

      if (this.orderType === ORDER_TYPE_DELEVERAGE) {
        if (
          this.processState === STATE_DELEVERAGE &&
          this.deleverageinProgress === false
        )
          return await this.runDeleverage();
      }
    },
    async monitoringHandler(order) {
      this.clearInfo();

      if (this.orderType === ORDER_TYPE_LEVERAGE)
        return await this.orderMonitorLeverage(
          order,
          this.cauldronObject,
          this.account,
          this.provider
        );

      if (this.orderType === ORDER_TYPE_DELEVERAGE)
        return await this.orderMonitorDeleverage(
          order,
          this.cauldronObject,
          this.account,
          this.provider,
          this.deleverageSuccessPayload
        );
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
        this.processState = STATE_SUCCESS;
        await this.successLeverageCallback(order);
      }

      if (orderStatus === ORDER_FAIL) {
        await this.createNotification(notification.gmLeverageOrderFailes);
        const balances = await getOrderBalances(order, provider);
        this.balances = balances;
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
        this.balances = await getOrderBalances(order, provider);
        this.processState = STATE_DELEVERAGE;
        await this.runDeleverage();
      }

      if (orderStatus === ORDER_FAIL) {
        await this.createNotification(notification.gmDeleverageFailedOrder);
        this.processState = ORDER_FAIL;
      }
    },
    async runDeleverage() {
      this.deleverageinProgress = true;
      await this.deleverageFromOrder(this.order, this.deleverageSuccessPayload);
      this.deleverageinProgress = false;
    },
    formatTokenBalance(amount) {
      return filters.formatTokenBalance(amount);
    },
    clearInfo() {
      this.processState = STATE_PENDING;
      this.balances = null;
    },
  },
  created() {
    this.monitoringHandler(this.order);
  },
  components: {
    BaseLoader,
  },
};
</script>

<style lang="scss" scoped>
.popup-wrap {
  display: grid;
  grid-template-rows: auto 1fr;
  width: 320px;
  max-width: 100%;
  padding: 8px 10px 2px;
}

.popup-header {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  margin-bottom: 32px;

  .cauldron-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    margin-right: 8px;
  }
}

.popup-content {
}

.pending-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
}

.failed-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .status-img {
    width: 44px;
    height: 44px;
    object-fit: contain;
    margin-bottom: 8px;
  }

  .status-text {
    font-size: 18px;
    font-weight: 400;
    max-width: 230px;
    text-align: center;
    padding-bottom: 20px;
  }

  .balance-info {
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .balance-title {
      font-size: 14px;
    }

    .token-info {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-left: 20px;

      .token-icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        margin-right: 3px;
      }
    }
  }
}

.proccess-wrap {
  width: 100%;
  padding-bottom: 10px;

  .step-wrap {
    display: flex;

    .indecator-wrap {
      width: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .status-icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }

      .line {
        display: block;
        height: calc(100% - 20px);
        border-left: 1px dashed #fff;

        &.success {
          border-left: 1px dashed #63ff7b;
        }

        &.failed {
          border-left: 1px dashed #d94844;
        }
      }
    }

    .info-wrap {
      padding-left: 12px;

      &.second-step {
        padding-top: 10px;
      }

      .info-title {
        font-size: 16px;
        font-weight: 400;
        line-height: normal;
      }

      .info-subtitle {
        font-size: 12px;
      }

      .balance-info {
        padding-bottom: 10px;
        .balance-title {
          font-size: 14px;
        }

        .token-info {
          display: flex;
          align-items: center;
          font-size: 14px;
          padding-top: 3px;

          .token-icon {
            width: 20px;
            height: 20px;
            object-fit: contain;
            margin-right: 3px;
          }
        }
      }
    }
  }
}

.btns-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 13px 20px;

  .retry-btn {
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    display: flex;
    align-items: center;

    background: linear-gradient(108deg, #5282fd -3.19%, #76c3f5 101.2%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    &:hover {
      img {
        transform: rotate(360deg);
        margin-right: 10px;
      }
    }

    img {
      width: 20px;
      height: 20px;
      object-fit: cover;
      margin-right: 6px;
      transition: all 0.6s ease;
    }
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
