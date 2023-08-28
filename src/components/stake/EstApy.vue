<template>
  <div class="est-apy-wrap">
    <div class="est-apy">
      <img
        class="est-apy-icon"
        src="@/assets/images/glp/chart-apr.png"
        alt="Icon"
      />
      <span class="est-apy-text">est. APY </span>
      <span class="est-apy-percent" v-if="apy">{{ apy }}%</span>

      <BaseLoader
        v-else
        type="loader"
        color="linear-gradient(92.08deg, #63ff7b 0%, #6b9ef8 100%)"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  props: {
    apy: { type: String, required: true },
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
