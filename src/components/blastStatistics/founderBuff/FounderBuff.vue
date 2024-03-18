<template>
  <div class="founder-buff">
    <div class="info">
      <div class="text-wrap">
        <h2 class="title">Founder Buff</h2>

        <div class="description">
          <p class="description-paragraph">
            Thank you for participating in LLE by locking your MIM / USDB
            tokens. All tokens you've locked will be added to the MIM/USDB Pool
            on Abracadabra, serving as liquidity for traders.
          </p>

          <p class="description-paragraph">
            We're thrilled to reward all Founders of MIM Swap who locked their
            tokens with an exclusive Buff. To become a Founder, simply lock your
            MIM/USDB for 3 months.
          </p>

          <p class="description-paragraph">
            30% of all Blast Points that Abracadabra obtains will be distributed
            to Founders. The Buff is permanent and remains active even after the
            3-month locking period. The only way to lose the Buff is by removing
            your liquidity from the MIM / USDB Pool
          </p>
        </div>
      </div>

      <PoolCard class="pool-card" :stakeInfo="stakeInfo" isLocked />
    </div>

    <img class="founder-gif" src="@/assets/gifs/founder-buff.gif" />

    <button class="button-next" @click="$emit('openFounderPopup')">Next</button>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    stakeInfo: { type: Object },
  },

  components: {
    PoolCard: defineAsyncComponent(() =>
      import("@/components/blastStatistics/cards/PoolCard.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.founder-buff {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 150px 25px 60px 25px;
  width: 1280px;
  max-width: 100%;
  box-sizing: border-box;
}

.info {
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  gap: 45px;
  width: 100%;
}

.text-wrap {
  max-width: 789px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.description-paragraph {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.pool-card {
  max-width: 410px;
}

.button-next {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  gap: 10px;
  width: 330px;
  padding: 12px 24px;
  border-radius: 16px;
  border: none;
  background: #fcfd02;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.button-next:hover {
  background: #d4d402;
}

.founder-gif {
  max-width: 100%;
}
</style>
