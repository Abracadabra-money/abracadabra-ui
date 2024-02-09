<template>
  <div class="special-info-block">
    <div class="row">
      <h4 class="title">Simply deposit your KLP</h4>

      <div class="links-wrap">
        <GetTokenLink
          :href="`${trancheLinks[activeToken]}/buy`"
          text="Buy LVL"
          :icon="useImage(`assets/images/get-lp-icons/lvl.svg`)"
        />

        <GetTokenLink
          :href="`${trancheLinks[activeToken]}/sell`"
          text="Sell LVL"
          :icon="useImage(`assets/images/get-lp-icons/lvl.svg`)"
        />
      </div>
    </div>

    <div>
      <p class="text">
        Enjoy the benefits of compounding without having to worry about the
        tedious work! Simply deposit your Level Tranches into Magic Level and
        let it do its magic!
      </p>
      <p class="text">Note: A 1% protocol fee is taken on the yields.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    activeToken: {
      type: String,
      default: "senior",
    },
  },

  data() {
    return {
      trancheLinks: {
        junior: "https://app.level.finance/liquidity/junior-tranche",
        mezzanine: "https://app.level.finance/liquidity/mezzanine-tranche",
        senior: "https://app.level.finance/liquidity/senior-tranche",
      } as any,
    };
  },

  methods: {
    useImage,
  },

  components: {
    GetTokenLink: defineAsyncComponent(
      () => import("@/components/ui/links/GetTokenLink.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.special-info-block {
  padding: 14px 20px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid #4f53b2;
  border-radius: 30px;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.32) 0%,
      rgba(116, 92, 210, 0.32) 100%
    ),
    url("@/assets/images/stake/lvl-bg.png");
  background-repeat: no-repeat;
  background-position: center right;
}

.row {
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.links-wrap {
  gap: 10px;
  display: flex;
  align-items: center;
}

.text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 150%;
}

@media screen and (max-width: 600px) {
  .row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
