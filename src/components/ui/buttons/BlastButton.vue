<template>
  <router-link :class="classes" :to="{ name: toRouteName }">
    <span class="popup-link" v-if="isMobile">
      <img src="@/assets/images/blast/blast-icon.png" alt="" />
      <span> Blast</span>
    </span>

    <img v-else src="@/assets/images/blast-text.svg" alt="" />
  </router-link>
</template>

<script>
import { mapGetters } from "vuex";
import { getStakeInfo } from "@/helpers/blast/stake/getStakeInfo";

export default {
  name: "BlastButton",
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stakeInfo: null,
    };
  },
  computed: {
    ...mapGetters({ account: "getAccount" }),
    classes() {
      return {
        "blast-link": !this.isMobile,
        "header-link": !this.isMobile,
      };
    },
    hasPostition() {
      if (!this.account || this.stakeInfo === null) return false;
      const { tokensInfo } = this.stakeInfo;

      const hasBalance = tokensInfo.some(
        (tokenInfo) => tokenInfo.userInfo.balances.total > 0n
      );

      return hasBalance;
    },
    toRouteName() {
      if (!this.account) return "Blast";

      return this.hasPostition ? "Blast" : "PointsDashboard";
    },
  },
  watch: {
    account() {
      this.createStakeInfo();
    },
  },
  methods: {
    async createStakeInfo() {
      this.stakeInfo = await getStakeInfo(this.account);
    },
  },
  async created() {
    await this.createStakeInfo();
  },
};
</script>

<style lang="scss" scoped>
.header-link {
  display: flex;
  padding: 10px 6px;
  align-items: center;
  gap: 10px;
  height: 50px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  cursor: pointer;

  &.blast-link {
    height: 40px;
    background-color: #fcfc06;
    img {
      width: 77px;
      height: auto;
    }

    &:hover {
      background: #fcfc06;
      opacity: 0.9;
    }
  }
}

.header-link:hover {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
}

.popup-link {
  gap: 6px;
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 500;

  &:hover {
    opacity: 0.7;
  }
}

@media (max-width: 1110px) {
  .header-link {
    display: none;
  }
}
</style>
