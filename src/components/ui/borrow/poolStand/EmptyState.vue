<template>
  <div class="empty-wrap">
    <img :src="emptyData.img" v-if="emptyData.img" alt="info" />
    <div class="empty-text">
      <p v-if="emptyData.text">
        {{ emptyData.text }}
      </p>
      <p class="empty-bottom" v-if="emptyData.bottom">
        {{ emptyData.bottom }}
        <a
          class="empty-link"
          :href="emptyData.link"
          v-if="emptyData.link"
          target="_blank"
          >here</a
        >
      </p>
    </div>
  </div>
</template>
<script>
import { useImage } from "@/helpers/useImage";
export default {
  props: {},
  data() {
    return {
      emptyDataConfig: {
        BorrowTest: {
          img: useImage(`assets/images/empty_borrow.png`),
          text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Borrow",
          bottom: "If you want to learn more read our docs",
          link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
        },
        Repay: {
          img: useImage(`assets/images/empty_borrow.png`),
          text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Repay",
          bottom: "If you want to learn more read our docs",
          link: "https://abracadabramoney.gitbook.io/",
          glpPoolsId: [2, 3],
        },
        Leverage: {
          img: useImage(`assets/images/empty_leverage.png`),
          text: "Leverage up your selected asset using our built in function. Remember you will not receive any MIMs.",
          bottom: "Read more about it",
          link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
        },
        Deleverage: {
          img: useImage(`assets/images/empty_leverage.png`),
          text: "Deleverage your position using our built-in Flash repay function.",
          bottom: "Read more about it",
          link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
        },
      },
    };
  },
  computed: {
    emptyData() {
      const pageIdentifier = this.$route.name;
      return this.emptyDataConfig[pageIdentifier];
    },
  },
  mounted() {
    console.log("route", this.$route);
  },
};
</script>
<style lang="scss" scoped>
.empty-wrap {
  background: #2b2b3c;
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(100px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  padding: 23px 65px;
  min-height: 280px;
}

.empty-wrap img {
  max-width: 160px;
  width: 90%;
  height: auto;
}

.empty-bottom {
  margin-top: 15px;
}

.empty-text {
  font-size: 18px;
  line-height: 27px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-link {
  color: #759ffa;
}
</style>
