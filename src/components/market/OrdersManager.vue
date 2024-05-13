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
import { defineAsyncComponent } from "vue";
import { ZERO_ADDRESS } from "@/constants/gm";
// @ts-ignore
import { getSavedOrders } from "@/helpers/gm/orders";

export default {
  name: "OrdersManager",
  props: {
    cauldronObject: {
      type: Object as any,
    },
    recoverLeverage: {
      type: Function || null,
    },
    deleverageFromOrder: {
      type: Function || null,
    },
  },
  data() {
    return {
      orders: [] as any,
      cauldronContract: null,
      cauldron: null,
    };
  },
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      provider: "getProvider",
      signer: "getSigner",
    }),
  },
  watch: {
    async cauldronObject() {
      await this.checkOrders();
    },
  },
  methods: {
    async checkOrders() {
      const cauldron =
        this.cauldronObject.contracts?.cauldron ||
        new Contract(
          this.cauldronObject.config.contract.address,
          this.cauldronObject.config.contract.abi,
          this.provider
        );

      this.cauldron = cauldron;

      const currentOrder: any = await cauldron.orders(this.account);

      const itsZero = currentOrder === ZERO_ADDRESS;

      if (itsZero) {
        this.orders = [];
        return false;
      }

      const savedOrders = getSavedOrders(this.account);

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

<style></style>
