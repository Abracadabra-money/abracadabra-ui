<template>
  <div class="special-info-block">
    <h3 class="title">{{ title }}</h3>

    <div>
      <p class="text" v-for="(info, idx) in specialInfo" :key="idx">
        {{ info.text }}
        <a
          class="info-link"
          v-if="info.link"
          :href="info.link"
          target="_blank"
          rel="noopener noreferrer"
          >here!</a
        >
        {{ info.subText }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    specialInfo: {
      type: Array as any,
    },
    title: {
      type: String,
      default: "Make SPELL work for you",
    },
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
    url("@/assets/images/stake/spell-bg.png");
  background-repeat: no-repeat;
  background-position: center right;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.text {
  color: rgba(255, 255, 255, 0.6);
  line-height: 150%;
}

.info-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration-line: underline;
}
</style>
