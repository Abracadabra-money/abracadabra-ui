<template>
  <div class="orders-manager" v-if="orders.length">
    <h4>Orders Manager</h4>
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
    activeOrder: {
      type: String,
    },
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
    async activeOrder() {
      this.orders = saveOrder(ZERO_ADDRESS, this.account);
    },
  },
  methods: {
    async checkOrders() {
      const { cauldron } = this.cauldronObject.contracts;
      const currentOrder = await cauldron.orders(this.account);
      this.orders = saveOrder(currentOrder, this.account);
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
