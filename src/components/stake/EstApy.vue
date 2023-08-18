<template>
  <div class="est-apy-wrap" :style="{ background: config.color }">
    <div class="est-apy">
      <img class="est-apy-icon" :src="config.icon" alt="Icon" />
      <span class="est-apy-text">est. APY </span>
      <span class="est-apy-percent" :style="apyColor" v-if="apy"
        >{{ apy }}%</span
      >

      <BaseLoader v-else type="loader" :color="config.color" />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
export default {
  props: {
    apy: { type: String, required: true },
    config: {
      type: Object,
      default: () => {
        return {
          icon: useImage("assets/images/glp/chart-apr.png"),
          color: "linear-gradient(92.08deg, #63ff7b 0%, #6b9ef8 100%)",
        };
      },
    },
  },

  computed: {
    apyColor() {
      return `
      background: ${this.config.color};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;
      `;
    },
  },

  components: {
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.est-apy-wrap {
  width: 178px;
  height: 32px;
  background: linear-gradient(92.08deg, #63ff7b 0%, #6b9ef8 100%);
  display: flex;
  align-items: center;
  border-radius: 0px 30px 30px 0px;
}

.est-apy {
  width: 176px;
  height: 30px;
  background: #23212d;
  border-radius: 0px 30px 30px 0px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
}

.est-apy-icon {
  width: 44px;
  height: 44px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -22px;
}

.est-apy-text {
  line-height: 27px;
  margin-right: 10px;
}

.est-apy-percent {
  background: linear-gradient(92.08deg, #63ff7b 0%, #6b9ef8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
</style>
