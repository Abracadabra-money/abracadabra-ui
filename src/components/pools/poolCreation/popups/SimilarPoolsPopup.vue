<template>
  <div class="similar-pools-popup">
    <div class="popup-header">
      <p class="title">Filter</p>

      <img
        class="close-img"
        src="@/assets/images/cross.svg"
        alt="Close popup"
        @click="closePopup"
      />
    </div>

    <p class="description">
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </p>

    <div class="pools-wrap">
      <div class="similar" v-if="similarPoolsToRender.length > 0">
        <div class="title">Similar pools</div>
        <div class="pool-list">
          <PoolItem
            :pool="pool"
            :actionConfig="actionConfig"
            mobileMode
            v-for="(pool, index) in similarPoolsToRender"
            :key="index"
          />
        </div>
      </div>

      <div class="identical" v-if="identicalPool">
        <div class="title">Identical</div>
        <PoolItem
          :pool="identicalPool"
          :actionConfig="actionConfig"
          mobileMode
        />
      </div>
    </div>

    <div class="error-button-wrap">
      <Error v-if="identicalPool">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor
      </Error>
      <BaseButton :disabled="!!identicalPool" primary @click="createPool">
        Create
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { checkIdentity } from "@/helpers/pools/poolCreation/createSimilarPoolsInfo";

export default {
  props: {
    similarPools: {
      type: Array as PropType<MagicLPInfo[]>,
      default: () => [] as MagicLPInfo[],
    },
    actionConfig: {
      type: Object as PropType<ActionConfig>,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    identicalPool() {
      return this.similarPools.find((pool) =>
        checkIdentity(pool, this.actionConfig)
      );
    },

    similarPoolsToRender() {
      return this.similarPools.filter(
        (pool) => !checkIdentity(pool, this.actionConfig)
      );
    },
  },

  methods: {
    createPool() {
      if (this.identicalPool) return false;
      this.$emit("createPool");
      this.closePopup();
    },

    closePopup() {
      this.$emit("close");
    },
  },

  components: {
    PoolItem: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/similarPools/PoolItem.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    Error: defineAsyncComponent(() => import("@/components/ui/info/Error.vue")),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.similar-pools-popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 24px;
  padding: 20px 16px 40px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  overflow: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.close-img {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.title {
  font-weight: 500;
  font-size: 18px;
}

.pools-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.similar,
.identical {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pool-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.error-button-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
</style>
