<template>
  <div class="popup-wrap" v-if="isOpened" @click="closePopup">
    <div class="popup" @click.stop>
      <button class="close-btn" @click="closePopup">
        <img
          class="close-img"
          src="@/assets/images/close-popup.svg"
          alt="Close popup"
        />
      </button>
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
          <BaseLoader medium />
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
  </div>
</template>

<script>
import { utils } from "ethers";
import { mapGetters, mapActions } from "vuex";
import { useImage } from "@/helpers/useImage";
import { formatTokenBalance } from "@/helpers/filters";
import BaseLoader from "@/components/base/BaseLoader.vue";
import notification from "@/helpers/notification/notification";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";

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
    isOpened: {
      type: Boolean,
      default: false,
    },
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
    deleverageSuccessPayload: {},
    refundWeth: {},
    deleverageFromOrder: {},
    successLeverageCallback: {},
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
    isOpened(value) {
      document.documentElement.style.overflow = value ? "hidden" : "auto";
    },
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    provider() {
      return getEthersProvider(this.cauldronObject.config.chainId);
    },

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

    formatTokenBalance,

    closePopup() {
      this.$emit("closePopup");
    },
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 300;
  display: grid;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  overflow-y: auto;
  padding-top: 50px;
}

.popup {
  position: relative;

  width: 95vw;
  max-width: 480px;
  padding: 32px;

  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);

  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  gap: 24px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.close-btn {
  position: absolute;
  top: 41px;
  right: 32px;
  cursor: pointer;
  background-color: transparent;
  border: none;
}

.close-img {
  width: 18px;
  height: 18px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.popup-header {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;

  .cauldron-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    margin-right: 8px;
  }
}

.pending-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  max-height: 180px;
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

  .retry-btn {
    width: 100%;
    padding: 2px 24px;
    min-width: 84px;
    height: 48px;

    border-radius: 16px;
    margin: 3px 0;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7088cc;
    border: 2px solid #7088cc;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.01);
    cursor: pointer;

    &:hover {
      img {
        transform: rotate(360deg);
        margin-right: 10px;
      }
      border: 2px solid #86a2f1;
      background: rgba(255, 255, 255, 0.05);
    }

    &:disabled {
      color: #575c62;
      border: 2px solid #575c62;
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
  width: 100%;
  padding: 2px 24px;
  min-width: 84px;
  height: 48px;

  border-radius: 16px;
  margin: 3px 0;

  display: flex;
  align-items: center;
  justify-content: center;
  color: #7088cc;
  border: 2px solid #7088cc;
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
