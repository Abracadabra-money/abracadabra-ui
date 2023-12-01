<template>
  <div class="order-item">
    <div class="title-wrap">
      <p class="title">Active Order</p>
      <div class="setting-button-wrap">
        <SettingsButton
          v-if="orderType === 'Deleverage' || showDeleverageButton"
          @click="isSettingsOpen = true"
        />
      </div>
    </div>

    <div class="order-info">
      <p class="order-address">{{ orderText }}</p>
      <a class="open-link" :href="orderUrl" target="_blank"
        ><img src="@/assets/images/open-link.svg" alt=""
      /></a>
      <p class="status-info">
        <img v-if="activeStatusInfo.icon" :src="activeStatusInfo.icon" alt="" />
        {{ activeStatusInfo.name }}
      </p>
    </div>

    <div class="raw" v-if="balancesInfo.length">
      <div class="balances-info" v-if="balancesInfo.length">
        <p class="title">Orders balances:</p>
        <div
          class="balance-item"
          v-for="(info, idx) in balancesInfo"
          :key="idx"
        >
          <div class="token-info">
            <img class="token-icon" img :src="info.icon" />
            <p>{{ info.balance }}</p>
          </div>
        </div>
      </div>
      <div class="btns-wrap">
        <button :disabled="disableAction" @click="actionHandler" class="btn">
          {{ buttonText }}
        </button>
        <button v-if="showDeleverageButton" :disabled="disableAction" @click="deleverageHandler" class="btn">
          Deleverage
        </button>
      </div>

    </div>
  </div>

  <LocalPopupWrap
    :isOpened="isSettingsOpen"
    @closePopup="isSettingsOpen = false"
  >
    <SettingsPopup :slippage="slippage" @saveSettings="changeSlippage"
  /></LocalPopupWrap>
</template>

<script>
import { defineAsyncComponent } from "vue";
import filters from "@/filters/index.js";
import { useImage } from "@/helpers/useImage";
import { mapGetters } from "vuex";
import { utils, BigNumber } from "ethers";
import {
  ORDER_PENDING,
  ORDER_SUCCESS,
  ORDER_FAIL,
  ORDER_TYPE_UNKNOWN,
  ORDER_TYPE_LEVERAGE,
  ORDER_TYPE_DELEVERAGE,
  monitorOrderStatus,
  getOrderBalances,
  getOrderType,
} from "@/helpers/gm/orders";

import FAIL_ICON from "@/assets/images/order-fail.svg";
import SUCCESS_ICON from "@/assets/images/order-success.svg";

export default {
  name: "OrderItem",
  emits: ["updateInfo"],
  props: {
    cauldronObject: {
      type: Object,
      required: true,
    },
    order: {
      type: String,
      required: true,
    },
    recoverLeverage: {
      type: Function,
    },
    deleverageFromOrder: {
      type: Function,
    },
  },
  data() {
    return {
      isSettingsOpen: false,
      slippage: 1,
      status: ORDER_PENDING,
      type: ORDER_TYPE_UNKNOWN,
      balances: null,
      statuses: {
        0: {
          name: "Pending...",
        },
        1: {
          name: "Order created",
          icon: SUCCESS_ICON,
        },
        2: {
          name: "Order failed",
          icon: FAIL_ICON,
        },
      },
    };
  },
  watch: {
    status(newValue) {
      this.updateOrderInfo(newValue);
    },
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),
    currentPageType() {
      const isLeverage = this.$route.name === "LeverageId";
      const isDeleverage = this.$route.name === "Deleverage";

      if (isLeverage) return ORDER_TYPE_LEVERAGE;
      if (isDeleverage) return ORDER_TYPE_DELEVERAGE;
    },
    orderType() {
      if (this.type === ORDER_TYPE_UNKNOWN) return null;
      if (this.type === ORDER_TYPE_LEVERAGE) return "Leverage";
      if (this.type === ORDER_TYPE_DELEVERAGE) return "Deleverage";

      return null;
    },
    orderText() {
      return `${this.order.slice(0, 6)}...${this.order.slice(-6)}`;
    },
    activeStatusInfo() {
      return this.statuses[this.status];
    },
    orderUrl() {
      return `https://arbiscan.io/address/${this.order}`
    },
    buttonText() {
      if (this.type === ORDER_TYPE_LEVERAGE) {
        if (this.status === ORDER_FAIL) return "Recover";
      }

      if (this.type === ORDER_TYPE_DELEVERAGE) {
        if (this.status === ORDER_SUCCESS) return "Deleverage";
      }

      return "...";
    },
    disableAction() {
      return this.buttonText === "...";
    },
    showDeleverageButton() {
      return this.type === ORDER_TYPE_LEVERAGE && this.status === ORDER_FAIL
    },
    balancesInfo() {
      if (!this.balances) return [];

      const { balanceUSDC } = this.balances;

      const balances = [];

      if (balanceUSDC.gt(0))
        balances.push({
          name: "USDC",
          icon: useImage(`assets/images/tokens/USDC.png`),
          balance: this.formatTokenBalance(utils.formatUnits(balanceUSDC, 6)),
        });

      // if (balanceWETH.gt(0))
      //   balances.push({
      //     name: "WETH",
      //     icon: useImage(`assets/images/tokens/WETH.png`),
      //     balance: this.formatTokenBalance(utils.formatUnits(balanceWETH)),
      //   });

      return balances;
    },
  },
  methods: {
    async actionHandler() {
      if (this.type === ORDER_TYPE_LEVERAGE) {
        if (this.status === ORDER_FAIL) {
          await this.recoverLeverage(this.order);
          this.$emit("updateInfo");
        }
      }

      if (this.type === ORDER_TYPE_DELEVERAGE) {
        if (this.status === ORDER_SUCCESS)
          return await this.deleverageHandler();
        this.$emit("updateInfo");
      }
    },
    toDeleverage() {
      const currentID = this.$route.params.id;
      this.$router.push({ name: "DeleverageId", params: { id: currentID } });
    },
    async deleverageHandler() {
      const payload = {
        itsMax: false,
        slipage: this.slippage,
        removeCollateralAmount: BigNumber.from(0),
        borrowAmount: BigNumber.from(0), // TODO share to min
      };

      await this.deleverageFromOrder(this.order, payload);
    },
    changeSlippage(slippage) {
      if (!slippage) this.slippage = 1;
      else this.slippage = slippage;

      this.isSettingsOpen = false;
    },
    formatTokenBalance(amount) {
      return filters.formatTokenBalance(amount);
    },
    async updateOrderInfo(status) {
      this.balances = await getOrderBalances(this.order, this.provider);
      this.type = await getOrderType(this.order, this.provider);
    },
    async fetchOrderInfo() {
      const { cauldron } = this.cauldronObject.contracts;
      this.status = await monitorOrderStatus(
        this.order,
        cauldron,
        this.account,
        this.provider
      );
    },
  },
  async created() {
    this.fetchOrderInfo();
  },
  components: {
    LocalPopupWrap: defineAsyncComponent(() =>
      import("@/components/popups/LocalPopupWrap.vue")
    ),
    SettingsPopup: defineAsyncComponent(() =>
      import("@/components/borrow/SettingsPopup.vue")
    ),
    SettingsButton: defineAsyncComponent(() =>
      import("@/components/ui/buttons/SettingsButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>

.btns-wrap {
  display: grid;
  gap: 5px 0;
}
.order-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 8px 0;
  padding: 16px;

  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: #2b2b3c;
  box-shadow: 0px 1px 10px 0px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(50px);
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;

  .title {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.45px;
  }
}

.open-link {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;

  img {
    width: 15px;
    height: 15px;
    object-fit: contain;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.token-info {
  display: flex;
  align-items: center;

  .token-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    margin-right: 4px;
  }
}

.order-address,
.status-info {
  margin-top: 4px;
}

.order-address {
  margin-right: 5px;
}

.info-wrap,
.order-info {
  width: 100%;
}

.order-info {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  .status-info {
    margin-left: auto;
    display: flex;
    align-items: center;

    img {
      width: 18px;
      height: 18px;
      object-fit: contain;
      margin-right: 4px;
    }
  }
}

.raw {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 4px 0;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.balances-info {
  font-size: 14px;
  display: flex;
  align-items: center;

  .title {
    font-size: 16px;
  }

  .balance-item {
    display: flex;
    align-items: center;
    margin-left: 12px;
  }
}

.btn {
  min-width: 84px;
  height: 32px;
  background: linear-gradient(108deg, #5552fd -3.19%, #76c3f5 101.2%);
  border-radius: 20px;
  padding: 6px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #7c82fd 0%, #8ec2f9 100%);
  }

  &.disabled {
    background: #40557e;
    background: linear-gradient(107.5deg, #393b80 -3.19%, #435e7e 101.2%);
    pointer-events: none;
  }
}
</style>
