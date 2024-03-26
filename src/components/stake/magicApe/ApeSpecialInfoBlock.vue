<template>
  <div class="special-info-block">
    <h4 class="title">
      Magic
      <img class="icon" src="@/assets/images/ape/ape.png" alt="Ape icon" />
      Ape
    </h4>

    <p class="text">
      Enjoy the benefits of compounding without having to worry about the
      tedious work! Simply deposit your APE into MagicAPE and let it do its
      magic! Note: A 1% protocol fee is taken on the yields.
    </p>
    <div class="btns-wrap">
      <button class="button" @click="routeTo">
        <img
          class="button-icon"
          src="@/assets/images/ape/ape.b.png"
          alt="Ape icon"
        />

        Borrow against MAGIC APE
      </button>

      <button class="button" @click="routeTo">
        Leverage your yield (up to {{ expectedLeverageApy }}%)
        <ArrowTopRight :width="14" :height="14" fill="#7088CC" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      multiplier: 16,
      percentMultiplier: 0.7,
      expectedLeverageApy: 0,
    };
  },

  methods: {
    routeTo() {
      this.$router.push({
        name: "Market",
        params: { chainId: 1, cauldronId: 39 },
      });
    },
  },

  async created() {
    const expectedLevearage =
      (1 - Math.pow(this.percentMultiplier, this.multiplier + 1)) /
      (1 - this.percentMultiplier);

    const apy = await getMagicApeApy(1);
    this.expectedLeverageApy = Math.floor(expectedLevearage * apy);
  },

  components: {
    ArrowTopRight: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowTopRightIcon.vue")
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
    url("@/assets/images/stake/ape-bg.png");
  background-repeat: no-repeat;
  background-position: center right;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  align-items: center;
  text-transform: uppercase;
}

.icon {
  width: 26px;
  height: 26px;
  margin: 0 4px;
}

.text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 150%;
}

.btns-wrap {
  gap: 16px;
  display: flex;
  align-items: center;
}

.button {
  max-width: 330px;
  width: 100%;
  padding: 7px 14px;
  color: #7088cc;
  line-height: 150%;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.button-icon {
  width: 22px;
  height: 22px;
}

@media screen and (max-width: 768px) {
  .btns-wrap {
    flex-direction: column;
  }
}

@media screen and (max-width: 600px) {
  .special-info-block {
    padding: 14px;
  }

  .button {
    font-size: 14px;
  }
}
</style>
