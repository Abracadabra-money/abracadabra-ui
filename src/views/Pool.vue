<template>
  <div class="pool-view">
    <div class="pool" v-if="pool">
      <PoolActionBlock
        :pool="pool"
        :isUserPositionOpen="isUserPositionOpen"
        @getPoolInfo="getPoolInfo"
        @openPositionPopup="isMyPositionPopupOpened = true"
      />

      <PoolComposition :pool="this.pool" />

      <PoolPosition
        :pool="pool"
        :isMyPositionPopupOpened="isMyPositionPopupOpened"
        @closePopup="isMyPositionPopupOpened = false"
        v-if="isUserPositionOpen && account"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";

export default {
  props: {
    id: { type: String },
    poolChainId: { type: String },
  },

  data() {
    return {
      pool: null,
      isMyPositionPopupOpened: false,
      poolsTimer: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    isUserPositionOpen() {
      return this.pool?.userInfo?.balance > 0n;
    },
  },

  watch: {
    account: {
      immediate: true,
      async handler() {
        await this.getPoolInfo();
      },
    },

    chainId: {
      immediate: true,
      async handler() {
        await this.getPoolInfo();
      },
    },
  },

  methods: {
    async getPoolInfo() {
      this.pool = await getPoolInfo(
        Number(this.poolChainId),
        Number(this.id),
        this.account
      );
    },
  },

  async created() {
    await this.getPoolInfo();

    this.poolsTimer = setInterval(async () => {
      await this.getPoolInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.poolsTimer);
  },

  components: {
    PoolActionBlock: defineAsyncComponent(() =>
      import("@/components/pools/pool/PoolActionBlock.vue")
    ),
    PoolComposition: defineAsyncComponent(() =>
      import("@/components/pools/pool/PoolComposition.vue")
    ),
    PoolPosition: defineAsyncComponent(() =>
      import("@/components/pools/pool/PoolPosition.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-view {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  min-height: 100vh;
  padding: 100px 0 40px 0;
  margin: 0 auto;
}

.pool {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 30px;
  width: 593px;
}

@media (max-width: 1300px) {
  .pool {
    position: static;
  }
}

@media (max-width: 600px) {
  .pool-wrap {
    padding: 30px;
  }

  .pool {
    padding: 0 15px;
    width: 100% !important;
  }
}
</style>
