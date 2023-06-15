<template>
  <div class="wraper">
    <h1 class="title">Transaction overview</h1>
    <SendFromBlock :config="config" :mimToUsd="mimToUsd" />
    <SendToBlock :config="config" :mimToUsd="mimToUsd" />
    <TransactionProgressBlock :config="config" />
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { getMimPrice } from "@/helpers/prices/getMimPrice.ts";
import SendFromBlock from "@/components/beam/successPopup/SendFromBlock.vue";
import SendToBlock from "@/components/beam/successPopup/SendToBlock.vue";
import TransactionProgressBlock from "@/components/beam/successPopup/TransactionProgressBlock.vue";

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      mimToUsd: 0,
    };
  },

  async created() {
    const mimToUsd = (await getMimPrice()) || 1;
    this.mimToUsd = filters.formatUSD(+this.config.mimAmount * +mimToUsd);
  },

  components: {
    SendFromBlock,
    SendToBlock,
    TransactionProgressBlock,
  },
};
</script>

<style lang="scss" scoped>
.wraper {
  padding: 10px 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  padding-bottom: 19px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.025em;
  color: #fff;
}

@media (max-width: 400px) {
  .wraper {
    padding: 10px 0;
  }
}
</style>
