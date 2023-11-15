<template>
  <div class="orders-manager" v-if="orders.length">
    <h4>Active Order</h4>
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
import { saveOrder } from "@/helpers/gm/orders";
import { ZERO_ADDRESS } from "@/constants/gm";
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

      if (itsZero) return false;
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
