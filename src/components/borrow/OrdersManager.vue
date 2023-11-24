<template>
  <div class="orders-manager" v-if="orders.length">
    <OrderItem
      @updateInfo="checkOrders"
      :deleverageFromOrder="deleverageFromOrder"
      :recoverLeverage="recoverLeverage"
      :cauldronObject="cauldronObject"
      :order="order"
      v-for="order in orders"
      :key="order"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { ZERO_ADDRESS } from "@/constants/gm";
import { getSavedOrders } from "@/helpers/gm/orders";
export default {
  name: "OrdersManager",
  props: {
    cauldronObject: {
      type: Object,
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
      orders: [],
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
      const { cauldron } = this.cauldronObject.contracts;
      const currentOrder = await cauldron.orders(this.account);

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
    OrderItem: defineAsyncComponent(() =>
      import("@/components/borrow/OrderItem.vue")
    ),
  },
};
</script>

<style>
.orders-manager {
  margin-top: 20px;
}
</style>
