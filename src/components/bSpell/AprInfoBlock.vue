<template>
  <div class="reward-info" v-if="aprInfo">
    <div class="apr-info">
      <div class="row">
        <img
          class="reward-icon"
          src="@/assets/images/stake/staking-apr.png"
          alt="Staking apr icon"
        />
        <span class="apr-title">Staking APR</span>
      </div>

      <div class="tokens-info-wrap">
        <div class="tokens-info">
          <img
            class="token-icon"
            :src="tokenInfo.icon"
            v-for="tokenInfo in aprInfo.tokensApr"
            :key="tokenInfo.name"
            :alt="`${tokenInfo.name} icon`"
          />
        </div>
        <span class="apr-percent">{{ aprInfo.totalApr }}%</span>
      </div>
    </div>

    <div class="tokens-apr-info">
      <div
        class="token-apr-info"
        v-for="tokenInfo in aprInfo.tokensApr"
        :key="tokenInfo.name"
      >
        <div class="token-info">
          <img
            class="token-apr-icon"
            :src="tokenInfo.icon"
            :alt="`${tokenInfo.name} icon`"
          />

          <span>{{ tokenInfo.name }}</span>
        </div>
        <div class="token-apr-percent">{{ tokenInfo.apr }}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { AprInfo } from "@/helpers/bSpell/types";

export default {
  props: {
    aprInfo: {
      type: Object as PropType<AprInfo | null>,
      required: true,
    },
  },
};
</script>

<style scoped>
.reward-info {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.apr-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.row {
  gap: 12px;
  display: flex;
  align-items: center;
}

.reward-icon {
  width: 48px;
  height: 48px;
}

.apr-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}

.tokens-info-wrap {
  gap: 4px;
  display: flex;
  align-items: center;
}

.tokens-info {
  display: flex;
  align-items: center;
}

.token-icon {
  width: 24px;
  height: 24px;

  &:not(:first-child) {
    margin-left: -4px;
  }
}

.apr-percent {
  color: #fff;
  text-shadow: 0px 0px 16px #ab5de8;
  font-size: 23px;
  font-weight: 600;
  line-height: normal;
}

.tokens-apr-info {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.token-apr-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-info {
  gap: 12px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}

.token-apr-icon {
  width: 24px;
  height: 24px;
}

.token-apr-percent {
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
}

@media screen and (max-width: 600px) {
  .apr-info {
    margin-bottom: 8px;
  }

  .reward-icon {
    width: 40px;
    height: 40px;
  }

  .apr-percent {
    font-size: 20px;
  }

  .tokens-apr-info {
    gap: 8px;
  }

  .apr-title,
  .token-info,
  .token-apr-percent {
    font-size: 16px;
  }
}
</style>
