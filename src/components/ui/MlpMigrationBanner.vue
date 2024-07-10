<template>
  <div class="banner" v-if="showBanner && !isCloseBanner">
    <div class="banner-content">
      <img
        class="migration-icon"
        src="@/assets/images/blastLpMigration/migration-baner.png"
        alt=""
      />

      <div>
        <h3 class="title">
          <span class="mlp-icon-wrap">
            <img
              class="mlp-icon"
              src="@/assets/images/tokens/MIM-USDB.png"
              alt=""
            />MLP Migration
          </span>

          <span class="migrate-btn" @click="openPopup">
            Migrate
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M13.4375 5.0625V4.5625H12.9375H7.875C7.85842 4.5625 7.84253 4.55592 7.83081 4.54419C7.81908 4.53247 7.8125 4.51658 7.8125 4.5C7.8125 4.48342 7.81908 4.46753 7.83081 4.45581C7.84253 4.44408 7.85842 4.4375 7.875 4.4375H13.5C13.5166 4.4375 13.5325 4.44409 13.5442 4.45581C13.5559 4.46753 13.5625 4.48342 13.5625 4.5V10.125C13.5625 10.1416 13.5559 10.1575 13.5442 10.1692C13.5325 10.1809 13.5166 10.1875 13.5 10.1875C13.4834 10.1875 13.4675 10.1809 13.4558 10.1692C13.4441 10.1575 13.4375 10.1416 13.4375 10.125V5.0625Z"
                fill="white"
                stroke="white"
              />
              <path
                d="M13.544 4.45488L13.5449 4.45578C13.5507 4.46159 13.5553 4.46848 13.5585 4.47607L14.0198 4.28465L13.5585 4.47608C13.5616 4.48367 13.5632 4.49181 13.5632 4.50003C13.5632 4.50825 13.5616 4.51639 13.5585 4.52398L14.0203 4.71562L13.5585 4.52399C13.5553 4.53158 13.5507 4.53847 13.5449 4.54428L13.5444 4.54473L3.41943 14.6697L3.76986 15.0201L3.41943 14.6697C3.40758 14.6816 3.3915 14.6882 3.37473 14.6882C3.35797 14.6882 3.34189 14.6816 3.33004 14.6697L2.97648 15.0233L3.33004 14.6697C3.31818 14.6579 3.31152 14.6418 3.31152 14.625C3.31152 14.6083 3.31818 14.5922 3.33004 14.5803L13.455 4.45533L13.4555 4.45489C13.4613 4.44907 13.4682 4.44445 13.4758 4.4413C13.4834 4.43814 13.4915 4.43652 13.4997 4.43652C13.508 4.43652 13.5161 4.43815 13.5237 4.4413L13.7153 3.97948L13.5237 4.4413C13.5313 4.44445 13.5382 4.44907 13.544 4.45488Z"
                fill="white"
                stroke="white"
              />
            </svg>
          </span>
        </h3>
        <h4 class="subtitle">
          Attention Founders: Migrate your Magic LP tokens from Blast L2 to
          Arbitrum. Maintain your earnings and benefits
          <span class="mobile-migrate-btn" @click="openPopup">
            Migrate
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M13.4375 5.0625V4.5625H12.9375H7.875C7.85842 4.5625 7.84253 4.55592 7.83081 4.54419C7.81908 4.53247 7.8125 4.51658 7.8125 4.5C7.8125 4.48342 7.81908 4.46753 7.83081 4.45581C7.84253 4.44408 7.85842 4.4375 7.875 4.4375H13.5C13.5166 4.4375 13.5325 4.44409 13.5442 4.45581C13.5559 4.46753 13.5625 4.48342 13.5625 4.5V10.125C13.5625 10.1416 13.5559 10.1575 13.5442 10.1692C13.5325 10.1809 13.5166 10.1875 13.5 10.1875C13.4834 10.1875 13.4675 10.1809 13.4558 10.1692C13.4441 10.1575 13.4375 10.1416 13.4375 10.125V5.0625Z"
                fill="white"
                stroke="white"
              />
              <path
                d="M13.544 4.45488L13.5449 4.45578C13.5507 4.46159 13.5553 4.46848 13.5585 4.47607L14.0198 4.28465L13.5585 4.47608C13.5616 4.48367 13.5632 4.49181 13.5632 4.50003C13.5632 4.50825 13.5616 4.51639 13.5585 4.52398L14.0203 4.71562L13.5585 4.52399C13.5553 4.53158 13.5507 4.53847 13.5449 4.54428L13.5444 4.54473L3.41943 14.6697L3.76986 15.0201L3.41943 14.6697C3.40758 14.6816 3.3915 14.6882 3.37473 14.6882C3.35797 14.6882 3.34189 14.6816 3.33004 14.6697L2.97648 15.0233L3.33004 14.6697C3.31818 14.6579 3.31152 14.6418 3.31152 14.625C3.31152 14.6083 3.31818 14.5922 3.33004 14.5803L13.455 4.45533L13.4555 4.45489C13.4613 4.44907 13.4682 4.44445 13.4758 4.4413C13.4834 4.43814 13.4915 4.43652 13.4997 4.43652C13.508 4.43652 13.5161 4.43815 13.5237 4.4413L13.7153 3.97948L13.5237 4.4413C13.5313 4.44445 13.5382 4.44907 13.544 4.45488Z"
                fill="white"
                stroke="white"
              />
            </svg>
          </span>
        </h4>
      </div>
    </div>

    <div class="timer-wrap">
      <Timer
        class="timer"
        :endDateTimestamp="1721260800"
        small
        isLock
        padding="6px"
        background="rgba(0, 10, 35, 0.30)"
      />
      <div class="timer-text">Time left to migrate</div>
    </div>

    <img
      class="close-btn"
      src="@/assets/images/close.svg"
      @click="isCloseBanner = true"
      alt="Close"
    />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { mapGetters } from "vuex";
import { BLAST_CHAIN_ID } from "@/constants/global";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { getUserInfo } from "@/helpers/blastLpMigration/getUserInfo";
import { checkAccount } from "@/helpers/blastLpMigration/checkAccount";
import { defineAsyncComponent } from "vue";

const MIM_USDB_POOL_ID = 1;

export default {
  data() {
    return {
      isCloseBanner: false,
      userInfo: null as any,
      poolInfo: null,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    showBanner() {
      if (!this.account) return false;
      return checkAccount(this.account);
    },
  },

  watch: {
    async account() {
      await this.createInfo();
    },
  },

  methods: {
    openPopup() {
      store.commit("setPopupState", {
        type: "mlp-migration",
        isShow: true,
        data: {
          userInfo: this.userInfo,
          poolInfo: this.poolInfo,
        },
      });
    },

    async createInfo() {
      if (!this.account) return;

      this.userInfo = await getUserInfo(this.account);

      this.poolInfo = await getPoolInfo(
        BLAST_CHAIN_ID,
        MIM_USDB_POOL_ID,
        this.account
      );
    },
  },

  async mounted() {
    await this.createInfo();
  },

  components: {
    Timer: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.banner {
  gap: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--Primary-Gradient, #2d4a96);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.52) 0%,
    rgba(116, 92, 210, 0.52) 100%
  );
  backdrop-filter: blur(19px);
  padding: 7px 50px 7px 20px;
  position: relative;
  top: 100px;
  left: 50%;
  right: 0;
  z-index: 10;
  transform: translateX(-50%);
}

.banner-content {
  gap: 20px;
  display: flex;
  align-items: center;
}

.migration-icon {
  max-width: 222px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mlp-icon-wrap {
  gap: 4px;
  display: flex;
  align-items: center;
}

.mlp-icon {
  width: 28px;
  height: 28px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
}

.migrate-btn,
.mobile-migrate-btn {
  background: transparent;
  outline: transparent;
  border: transparent;
  color: #fff;
  font-weight: 400;
  line-height: normal;
  gap: 4px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.mobile-migrate-btn {
  display: none;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
}

.timer-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}

@media screen and (max-width: 1024px) {
  .migration-icon {
    max-width: 25%;
  }
}

@media screen and (max-width: 768px) {
  .banner {
    padding: 12px;
    flex-direction: column;
    gap: 24px;
  }

  .migrate-btn {
    display: none;
  }

  .mobile-migrate-btn {
    display: inline-flex;
  }

  .migration-icon {
    max-width: 100%;
  }

  .banner-content {
    gap: 10px;
    flex-direction: column-reverse;
  }

  .title {
    font-size: 16px;
  }

  .subtitle {
    flex-direction: column;
  }

  .migration-icon {
    max-width: 80%;
  }

  .close-btn {
    top: 8px;
    right: 8px;
  }
}
</style>
