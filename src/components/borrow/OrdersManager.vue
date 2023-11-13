<template>
  <div class="orders-manager" v-if="orders.length">
    <h4>Orders Manager</h4>
    <OrderItem @update="checkOrders" :refundWeth="refundWeth" :recoverLeverage="recoverLeverage" :cauldronObject="cauldronObject" :order="order" v-for="order in orders" :key="order" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { saveOrder } from "@/helpers/gm/orders";

export default {
  name: "OrdersManager",
  props: {
    cauldronObject: {
      type: Object,
      required: true,
    },
    refundWeth: {
      type: Function,
    },
    recoverLeverage: {
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
