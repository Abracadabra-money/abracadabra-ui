<template>
  <a
    class="default-button"
    :class="[{ active: isActive }, type]"
    @click="toggleButton"
  >
    <img :src="btnIcon" class="tranche-icon" />

    <img
      src="@/assets/images/stake/check-icon.svg"
      class="check-icon"
      v-if="isActive"
    />
    <div class="button-content">
      <p class="button-title" :class="type">{{ type }} Tranches</p>
      <p class="apr">200.59% <span>APR</span></p>
    </div>
  </a>
</template>
<script>
export default {
  name: "TrancheButton",
  props: {
    type: String,
    isActive: Boolean,
  },

  computed: {
    btnIcon() {
      return require(`@/assets/images/stake/${this.type}-icon.svg`);
    },
  },

  methods: {
    toggleButton() {
      this.$emit("changeToken");
    },
  },
};
</script>
<style lang="scss" scoped>
.junior {
  background: linear-gradient(
      0deg,
      rgba(255, 113, 0, 0.1),
      rgba(255, 113, 0, 0.1)
    ),
    #2b2b3c;
}
.mezzanine {
  background: linear-gradient(
      0deg,
      rgba(134, 78, 251, 0.1),
      rgba(134, 78, 251, 0.1)
    ),
    #2b2b3c;
}
.senior {
  background: linear-gradient(
      0deg,
      rgba(55, 202, 255, 0.1),
      rgba(55, 202, 255, 0.1)
    ),
    #2a2835;
}
.default-button {
  height: 65px;
  width: 100%;
  cursor: pointer;
  position: relative;
  border-radius: 20px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Prompt;
  font-style: normal;
  z-index: 0;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  overflow: hidden;
  border: 2px solid #403e4a;

  &:hover {
    background: #616068;
  }
}
.default-button img {
  position: absolute;
}
.tranche-icon {
  top: 15px;
  left: 11.7px;
}
.check-icon {
  top: 23px;
  right: 8px;
}
.button-content {
  max-width: 90px;
  margin-left: 8px;
}
.button-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #ff7100;
}

.button-title:first-letter {
  text-transform: uppercase;
}

.button-title.mezzanine {
  color: #c345fe;
}

.button-title.senior {
  color: #37caff;
}

.apr {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.025em;
  color: #ffffff;
}
.apr span {
  opacity: 0.5;
}
.active {
  border: 2px solid #8180ff;
}
</style>
