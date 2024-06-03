<template>
  <div class="orders-manager" v-if="orders.length">
    <OrderItem
      @updateInfo="checkOrders"
      :deleverageFromOrder="deleverageFromOrder"
      :recoverLeverage="recoverLeverage"
      :cauldronObject="cauldronObject"
      :cauldron="cauldron"
      :order="order"
      v-for="order in orders"
      :key="order"
    />
  </div>
</template>

<script lang="ts">
import { Contract } from "ethers";
import { mapGetters } from "vuex";
import { ZERO_ADDRESS } from "@/constants/gm";
// @ts-ignore
import { getSavedOrders } from "@/helpers/gm/orders";
import { defineAsyncComponent, type PropType } from "vue";
import type { CauldronInfo } from "@/helpers/cauldron/types";

export default {
  props: {
    cauldronObject: {
      type: Object as PropType<CauldronInfo>,
      required: true,
    },
    recoverLeverage: {
      type: Function,
      required: true,
    },
    deleverageFromOrder: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      orders: [] as string[],
      cauldron: null as any,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      provider: "getProvider",
    }),
  },

  watch: {
    async cauldronObject() {
      await this.checkOrders();
    },
  },

  methods: {
    async checkOrders() {
      const cauldron: Contract =
        this.cauldronObject.contracts?.cauldron ||
        new Contract(
          this.cauldronObject.config.contract.address,
          this.cauldronObject.config.contract.abi,
          this.provider
        );

      this.cauldron = cauldron;

      const currentOrder: string = await cauldron.orders(this.account);

      const itsZero = currentOrder === ZERO_ADDRESS;

      if (itsZero) {
        this.orders = [];
        return false;
      }

      const savedOrders: string[] = getSavedOrders(this.account);

      const isActiveSaved = savedOrders.indexOf(currentOrder) !== -1;

      // the order has been saved as successful, but the cauldron has not yet been updated
      if (isActiveSaved) {
        this.orders = [];
        return false;
      }

      this.orders = [currentOrder];
    },
  },

  async created() {
    await this.checkOrders();
  },

  components: {
    OrderItem: defineAsyncComponent(
      () => import("@/components/market/OrderItem.vue")
    ),
  },
};
</script>

<style lang="scss" scoped></style>
