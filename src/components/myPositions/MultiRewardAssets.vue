<template>
  <div class="assets-wrap">
    <div class="assets-item" v-for="(asset, idx) in assetsInfo" :key="idx">
      <div class="assets-title-wrap">
        <span class="assets-title">{{ asset.title }}</span>
        <div class="action-wrap" v-if="asset.actions">
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

          <button
            class="button"
            v-if="asset.actions.visibility"
            :disabled="asset.actions.disabled"
            @click="$emit(asset.actions.event)"
          >
            {{ asset.actions.event }}
          </button>
          <GetLpLink v-else-if="!asset.isDepreciated" :link="asset.lpLink" />
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

      <div class="assets-desc" v-else>
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
    </div>
  </div>
</template>

<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import GetLpLink from "@/components/ui/GetLpLink.vue";
export default {
  props: {
    assetsInfo: {
      type: Object,
      required: true,
    },
  },

  components: {
    BaseTokenIcon,
    GetLpLink,
  },
};
</script>

<style lang="scss" scoped>
.assets-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 37px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px 12px;
}

.assets-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
}

.assets-title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
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

.action-wrap {
  display: flex;
  justify-content: flex-end;
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

.get-lp {
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

@media (max-width: 500px) {
  .assets-wrap {
    flex-wrap: wrap;
  }
}
</style>
