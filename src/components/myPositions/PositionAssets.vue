<template>
  <div class="assets-wrap">
    <div class="assets-item" v-for="(asset, idx) in assetsInfo" :key="idx">
      <div class="assets-title">{{ asset.title }}</div>
      <div class="assets-desc">
        <div class="token-info">
          <BaseTokenIcon :name="asset.symbol" :icon="asset.icon" size="50px" />
          <p>{{ asset.symbol }}</p>
        </div>

        <div class="token-balance">
          <p class="token-amount">{{ asset.amount }}</p>
          <p class="token-price" v-if="asset.amountUsd">
            {{ asset.amountUsd }}
          </p>
        </div>
      </div>

      <div class="tokens-list" v-if="asset.tokensList">
        <div
          class="assets-desc"
          v-for="tokenInfo in asset.tokensList"
          :key="tokenInfo.name"
        >
          <div class="token-info">
            <BaseTokenIcon :name="tokenInfo.symbol" :icon="tokenInfo.icon" />
            <p>{{ tokenInfo.symbol }}</p>
          </div>

          <div class="token-balance">
            <p class="token-amount">{{ tokenInfo.amount }}</p>
            <p class="token-price">
              {{ tokenInfo.amountUsd }}
            </p>
          </div>
        </div>
      </div>

      <div class="button-wrap" v-if="asset.actions">
        <template v-if="asset.actions.link">
          <router-link
            class="button"
            v-if="asset.actions.visibility"
            :disabled="asset.actions.disabled"
            :to="{
              name: asset.actions.link,
              params: { id: asset.actions.id },
            }"
          >
            Withdraw
          </router-link>
        </template>

        <template v-else>
          <button
            class="button"
            v-if="asset.actions.visibility"
            :disabled="asset.actions.disabled"
            @click="$emits(asset.actions.event)"
          >
            {{ asset.actions.event }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
export default {
  props: {
    assetsInfo: {
      type: Object,
      required: true,
    },
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.assets-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 37px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px 12px;
}

.assets-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.assets-title {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
}

.assets-desc {
  display: flex;
  justify-content: space-between;
}

.token-info {
  display: flex;
  align-items: center;
  font-size: 18px;
}

.token-balance {
  text-align: right;
  color: rgba(255, 255, 255, 0.8);
}

.token-amount {
  font-size: 16px;
  line-height: 24px;
}
.token-price {
  font-size: 12px;
  line-height: 18px;
}

.tokens-list {
  display: grid;
  grid-template-rows: repeat(auto-fill, 1fr);
  grid-row-gap: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 0;
}

.tokens-list {
}

.button-wrap {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.button {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 7px 20px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  color: #fff;

  &:disabled {
    cursor: default;
    color: rgba(255, 255, 255, 0.6);
  }

  &:first-letter {
    text-transform: uppercase;
  }
}

@media (max-width: 1024px) {
  .assets-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
