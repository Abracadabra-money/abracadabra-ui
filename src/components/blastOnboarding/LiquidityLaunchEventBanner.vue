<template>
  <div class="banner" v-if="showBanner">
    <div class="banner-info">
      <div class="icons">
        <img
          class="blast icon"
          src="@/assets/images/points-dashboard/blast.png"
          alt=""
        />
        <img
          class="gold-points icon"
          src="@/assets/images/points-dashboard/gold-points.svg"
          alt=""
        />
        <img
          class="potion icon"
          src="@/assets/images/points-dashboard/potion.png"
          alt=""
        />
      </div>

      <div class="title-desc">
        <h4 class="title">
          Secure Your Founder's Bonus by locking liquidity in the MIM/USDB Pool
        </h4>
        <p class="description">
          Founders earn <span class="highlight yellow"> 20% </span>of all
          Points, Gold, and Potions acquired by protocol.
          <span class="bonus-link" @click="goToPool">
            Get Bonus
            <img class="link-image" src="@/assets/images/link-arrow.svg" />
          </span>
        </p>
      </div>
    </div>

    <div class="timer-wrap">
      <Timer class="timer" :endDateTimestamp="1712364937" small medium />
      <p class="timer-description">Time left to lock</p>
    </div>

    <img
      class="close"
      src="@/assets/images/close.svg"
      alt="close"
      @click="showBanner = false"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

const BLAST_CHAIN_ID = 81457;
const MIM_USDB_POOL_ID = 1;

export default {
  data() {
    return {
      showBanner: true,
    };
  },

  methods: {
    goToPool() {
      this.$router.push({
        name: "Pool",
        params: { id: MIM_USDB_POOL_ID, poolChainId: BLAST_CHAIN_ID },
      });
    },
  },

  components: {
    Timer: defineAsyncComponent(() =>
      import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
  top: 100px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1280px;
  margin: auto;
  padding: 16px 60px 16px 22px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: url("../../assets/images/blast/launch-banner-background.png"),
    linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.52) 0%,
      rgba(116, 92, 210, 0.52) 100%
    );
  backdrop-filter: blur(19.600000381469727px);
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
}

.icons {
  display: flex;
  align-items: center;
}

.icon {
  height: 44px;
  width: 44px;
  margin-left: -14px;
  border: 2px solid #000;
  border-radius: 50px;
  transition: transform 0.1s ease-in;
}

.icon:hover {
  transform: translateY(-4px);
  z-index: 1;
}

.blast {
  margin-left: 0;
}

.banner-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.title-desc {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.title {
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.bonus-link {
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
}

.link-image {
  height: 18px;
  width: 18px;
}

.timer-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
}

.timer-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 400;
}

.timer {
  gap: 4px !important;
}

.timer::v-deep(.time-block) {
  background: rgba(0, 10, 35, 0.3) !important;
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.close:hover {
  opacity: 0.7;
}

.highlight.yellow {
  color: #fcfc06;
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 1400px) {
  .banner {
    width: calc(100% - 30px);
  }
}

@media (max-width: 1100px) {
  .banner {
    padding-right: 22px;
  }
}

@media (max-width: 600px) {
  .banner {
    background: url("../../assets/images/blast/launch-banner-background-mobile.png"),
      linear-gradient(
        90deg,
        rgba(45, 74, 150, 0.52) 0%,
        rgba(116, 92, 210, 0.52) 100%
      );

    background-repeat: no-repeat;
    background-size: cover;
  }

  .banner-info {
    flex-direction: column-reverse;
    align-items: start;
    gap: 13px;
  }

  .title-desc {
    max-width: 320px;
  }

  .bonus-link {
    display: flex;
    margin-top: 5px;
  }

  .timer-wrap {
    position: absolute;
    right: 12px;
    bottom: 10px;
  }
}
</style>
