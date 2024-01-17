<template>
  <div class="order-wrap">
    <div class="row">
      <div class="title-wrap">
        <h3 class="title">Acrive Order</h3>
        <SlippagePopup
          v-if="showSettingBtn"
          :amount="slippage"
          @updateSlippage="changeSlippage"
        />
      </div>

      <div :class="['order-status', activeStatusInfo.classes]">
        <img
          class="status-icon"
          v-if="activeStatusInfo.icon"
          :src="activeStatusInfo.icon"
          alt="Status icon"
        />
        {{ activeStatusInfo.name }}
      </div>
    </div>

    <div class="order-info">
      <p class="order-address">{{ orderText }}</p>
      <a class="order-link" :href="orderUrl" target="_blank">
        <img
          class="order-link-icon"
          src="@/assets/images/open-link.svg"
          alt="Link icon"
        />
      </a>
    </div>

    <div class="balances-info" v-if="balancesInfo.length">
      <p class="title">Orders balances:</p>
      <div class="balance-item" v-for="(info, idx) in balancesInfo" :key="idx">
        <img class="token-icon" img :src="info.icon" />
        <p>{{ info.balance }}</p>
      </div>
    </div>

    <div class="btns-wrap" v-if="!isPositionPage">
      <BaseButton
        primary
        v-if="!disableAction"
        :disabled="disableAction"
        @click="actionHandler"
        >{{ buttonText }}
      </BaseButton>

      <BaseButton
        v-if="showDeleverageButton"
        primary
        :disabled="disableAction"
        @click="deleverageHandler"
        >Deleverage
      </BaseButton>
    </div>

    <div class="btns-wrap" v-else>
      <BaseButton v-if="showToLeverageButton" primary @click="toMarket">
        Retry Order
      </BaseButton>
      <BaseButton primary @click="toMarket"> Retry Order </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
// @ts-ignore
import filters from "@/filters/index.js";
// @ts-ignore
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
  // @ts-ignore
} from "@/helpers/gm/orders";
import { getProviderByChainId } from "@/helpers/getProviderByChainId";

import FAIL_ICON from "@/assets/images/order-fail.svg";
import SUCCESS_ICON from "@/assets/images/order-success.svg";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
const DEFAULT_SLIPPAGE = utils.parseUnits("1", PERCENT_PRESITION);

export default {
  name: "OrderItem",
  emits: ["updateInfo"],
  props: {
    cauldronObject: {
      type: Object,
      required: true,
    },
    cauldron: {
      type: Object as any,
      required: true,
    },
    order: {
      type: String,
      required: true,
    },
    recoverLeverage: {
      type: Function as any,
    },
    deleverageFromOrder: {
      type: Function as any,
    },
  },
  data() {
    return {
      slippage: DEFAULT_SLIPPAGE,
      status: ORDER_PENDING,
      type: ORDER_TYPE_UNKNOWN,
      balances: null as any,
      statuses: {
        0: {
          name: "Pending...",
          icon: null,
          classes: [],
        },
        1: {
          name: "Order created",
          icon: SUCCESS_ICON,
          classes: ["created"],
        },
        2: {
          name: "Order failed",
          icon: FAIL_ICON,
          classes: ["failed"],
        },
      },
    };
  },

  watch: {
    status() {
      this.updateOrderInfo();
    },
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    provider() {
      return getProviderByChainId(this.cauldronObject.config.chainId);
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
      return this.statuses[this.status as keyof typeof this.statuses];
    },

    orderUrl() {
      return `https://arbiscan.io/address/${this.order}`;
    },

    buttonText() {
      if (this.type === ORDER_TYPE_LEVERAGE) {
        if (this.status === ORDER_FAIL) return "Retry Order";
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
      return this.type === ORDER_TYPE_LEVERAGE && this.status === ORDER_FAIL;
    },

    showToLeverageButton() {
      return this.type === ORDER_TYPE_LEVERAGE;
    },

    isPositionPage() {
      return this.$route.name === "MyPositions";
    },

    showSettingBtn() {
      return (
        (this.orderType === "Deleverage" || this.showDeleverageButton) &&
        !this.isPositionPage
      );
    },

    balancesInfo() {
      if (!this.balances) return [];

      const { balanceUSDC }: any = this.balances;

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
    formatTokenBalance(amount: any) {
      return filters.formatTokenBalance(amount);
    },

    changeSlippage(slippage: BigNumber) {
      this.slippage = slippage.isZero() ? DEFAULT_SLIPPAGE : slippage;
    },

    toMarket() {
      const { chainId, id } = this.cauldronObject.config.id;

      this.$router.push({
        name: "Market",
        params: { chainId, cauldronId: id },
      });
    },

    async updateOrderInfo() {
      this.balances = await getOrderBalances(this.order, this.provider);
      this.type = await getOrderType(this.order, this.provider);
    },

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

    async deleverageHandler() {
      const payload = {
        itsMax: false,
        slipage: utils.formatUnits(this.slippage, PERCENT_PRESITION),
        removeCollateralAmount: BigNumber.from(0),
        borrowAmount: BigNumber.from(0), // TODO share to min
      };

      await this.deleverageFromOrder(this.order, payload);
    },

    async fetchOrderInfo() {
      this.status = await monitorOrderStatus(
        this.order,
        this.cauldron,
        this.account,
        this.provider
      );
    },
  },

  async created() {
    this.fetchOrderInfo();
  },

  components: {
    SlippagePopup: defineAsyncComponent(
      () => import("@/components/popups/SlippagePopup.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.order-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.title-wrap {
  gap: 4px;
  display: flex;
  align-items: center;
}

.title {
  font-weight: 500;
  line-height: 150%;
}

.order-status {
  gap: 4px;
  display: flex;
  align-items: center;
  line-height: 150%;
}

.created {
  color: #67a069;
}

.failed {
  color: #8c4040;
}

.status-icon {
  width: 18px;
  height: 18px;
}

.order-info {
  width: 100%;
  gap: 4px;
  display: flex;
  align-items: center;
}

.order-address {
  line-height: 150%;
}

.order-link {
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-link-icon {
  width: 15px;
  height: 15px;
  object-fit: contain;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.balances-info {
  gap: 12px;
  display: flex;
  align-items: center;
}

.balance-item {
  gap: 4px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.btns-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}
</style>
