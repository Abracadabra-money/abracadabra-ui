<template>
  <div class="founder-buff">
    <div class="info">
      <div class="text-wrap">
        <h2 class="title">Founder Buff</h2>

        <div class="description">
          <p class="description-paragraph">
            Thank you for joining the Liquidity Launch Event by locking your
            <img
              :src="stakeInfo.tokensInfo[0].config.icon"
              :alt="stakeInfo.tokensInfo[0].config.name"
              class="text-token-icon"
            />
            &
            <img
              :src="stakeInfo.tokensInfo[1].config.icon"
              :alt="stakeInfo.tokensInfo[1].config.name"
              class="text-token-icon"
            />
            ahead of <span class="highlight"> MIMswap </span> launch.
            <br />
            Your locked tokens contribute to the
            <span class="highlight"> MIM/USDB </span> Pool on Abracadabra,
            providing liquidity for traders. In return, you receive
            <span class="highlight"> MagicLPs </span> , representing your pool
            share.
          </p>

          <p class="description-paragraph">
            Participants in the LLE can now gain an exclusive Founder’s Boost by
            locking their MagicLP tokens for an additional 3 months. Founders
            receive <span class="highlight yellow"> 20% </span> of Abracadabra's
            Blast Points, and this boost remains even after the lock-in period
            ends. Removing liquidity from the
            <span class="highlight"> MIM/USDB </span> Pool forfeits the
            Founder’s Boost permanently.
          </p>
        </div>
      </div>

      <UsersLockedTokensCard class="pool-card" :stakeInfo="stakeInfo" />
    </div>

    <div class="founder-gif-wrap">
      <img
        class="blast-gif-corner top left"
        src="@/assets/images/blast/blast-gif-corner.svg"
      />
      <img
        class="blast-gif-corner top right"
        src="@/assets/images/blast/blast-gif-corner.svg"
      />
      <img class="founder-gif" src="@/assets/gifs/founder-buff.gif" />
      <img
        class="blast-gif-corner bottom left"
        src="@/assets/images/blast/blast-gif-corner.svg"
      />
      <img
        class="blast-gif-corner bottom right"
        src="@/assets/images/blast/blast-gif-corner.svg"
      />
    </div>

    <video class="mobile-animation" laysinline autoplay muted loop>
      <source src="@/assets/gifs/Preview_mob.webm" type="video/webm" />
    </video>

    <button class="button-next" @click="actionHandler">{{ btnText }}</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { switchNetwork } from "@/helpers/chains/switchNetwork";

export default {
  props: {
    stakeInfo: { type: Object },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    btnText() {
      if (this.chainId !== 81457) return "Switch to Blast";
      else return "Next";
    },
  },

  methods: {
    actionHandler() {
      if (this.chainId !== 81457) return switchNetwork(81457);
      else this.$emit("openFounderPopup");
    },
  },

  components: {
    UsersLockedTokensCard: defineAsyncComponent(() =>
      import("@/components/blastOnboarding/cards/UsersLockedTokensCard.vue")
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

.mobile-animation {
  display: none;
}

.info {
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  gap: 45px;
  width: 100%;
}

.text-wrap {
  max-width: 823px;
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

.text-token-icon {
  position: relative;
  top: 2px;
  width: 18px;
  height: 18px;
  margin: 0 3px;
}

.highlight {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.highlight.yellow {
  color: #fcfd02;
  font-size: 16px;
  font-weight: 600;
}

.pool-card {
  width: 411px;
}

.founder-gif-wrap {
  position: relative;
  margin: 20px 0;
}

.blast-gif-corner {
  position: absolute;
}

.top.left {
  top: 0;
  left: 0;
  transform: scaleX(-1);
}

.top.right {
  top: 0;
  right: 0;
}

.bottom.left {
  bottom: 0;
  left: 0;
  transform: rotate(180deg);
}

.bottom.right {
  bottom: 0;
  right: 0;
  transform: scaleX(-1) rotate(180deg);
}

.button-next {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  gap: 10px;
  width: 330px;
  margin-top: 20px;
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

@media (max-width: 600px) {
  .founder-buff {
    padding: 0 5px;
  }

  .info {
    gap: 20px;
  }

  .description-paragraph {
    font-size: 14px;
  }

  .founder-gif-wrap {
    display: none;
  }

  .mobile-animation {
    display: block;
    width: 100%;
    margin-top: 20px;
  }
}
</style>
