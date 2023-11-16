<template>
  <div class="order-item">
    <div class="setting-button-wrap">
      <SettingsButton
        v-if="orderType === 'Deleverage'"
        @click="isSettingsOpen = true"
      />
    </div>
    <div class="order-info">
      <p class="order-address">{{ orderText }}</p>
      <MiniStatusTag v-if="orderType" :text="orderType" :rounded="true" />
      <p class="status-info">
        {{ activeStatusInfo.emoji }} {{ activeStatusInfo.name }}
      </p>
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
      <button :disabled="disableAction" @click="actionHandler" class="btn">
        {{ buttonText }}
      </button>
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
  deleteOrder
} from "@/helpers/gm/orders";

export default {
  name: "OrderItem",
  emits: ['updateInfo'],
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
          emoji: "🤖",
        },
        1: {
          name: "Success",
          emoji: "🏆",
        },
        2: {
          name: "Fail",
          emoji: "☠️",
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
    async actionHandler() {
      if (this.type === ORDER_TYPE_LEVERAGE) {
        if (this.status === ORDER_FAIL) {
          await this.recoverLeverage(this.order);
          this.$emit("updateInfo");
        }
      }

      if (this.type === ORDER_TYPE_DELEVERAGE) {
        if (this.status === ORDER_SUCCESS) return await this.deleverageHandler();
        this.$emit("updateInfo");
      }
    },
    async deleverageHandler() {
      const payload = {
        itsMax: false,
        slipage: this.slippage,
        removeCollateralAmount: BigNumber.from(0),
        borrowAmount: BigNumber.from(0)// TODO share to min
      }

      await this.deleverageFromOrder(this.order, payload)
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
    MiniStatusTag: defineAsyncComponent(() =>
      import("@/components/ui/MiniStatusTag.vue")
    ),
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
.setting-button-wrap {
  position: absolute;
  top: 0;
  right: 10px;
  display: flex;
  justify-content: flex-end;
}
.order-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 8px 0;
  padding: 10px 15px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 0;
}

.order-info {
  display: flex;
  align-items: center;

  .status-info {
    margin-left: auto;
  }
}

.raw {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 4px 0;
}

.btns-wrap {
  justify-content: flex-end;
}

.balances-info {
  font-size: 14px;

  .title {
    font-size: 16px;
    margin-bottom: 5px;
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
  margin-right: 5px;
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
