<template>
  <div class="banner" v-if="showBanner && !isCloseBanner">
    <button @click="openPopup">Get Bonus</button>

    <img
      class="banner-close"
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

const MIM_USDB_POOL_ID = 1;

export default {
  data() {
    return {
      isCloseBanner: false,
      userInfo: null as any,
      poolInfo: null,
      updateInterval: null as any,
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

      store.commit("setPopupData", {
        userInfo: this.userInfo,
        poolInfo: this.poolInfo,
      });
    },
  },

  async mounted() {
    await this.createInfo();

    this.updateInterval = setInterval(async () => {
      await this.createInfo();
    }, 10000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
  },
};
</script>

<style lang="scss" scoped>
.banner {
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
  padding: 18px 22px;

  position: fixed;
  top: 100px;
  left: 50%;
  right: 0;
  z-index: 10;
  transform: translateX(-50%);
}

.banner-text,
.banner-link {
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.035em;
  color: rgba(255, 255, 255, 0.8);
}

.banner-text {
  text-align: center;
}

.banner-link {
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  position: relative;
}

.banner-link::after {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
}

.banner-close {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}

.banner-img {
  max-width: 55px;
}
</style>
