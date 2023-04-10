<template>
  <a
    class="default-button"
    :class="[{ active: isActive }, type]"
    @click="$emit('changeToken')"
  >
    <img
      :src="require(`@/assets/images/stake/${this.type}-icon.svg`)"
      class="tranche-icon"
    />

    <img
      src="@/assets/images/stake/check-icon.svg"
      class="check-icon"
      v-if="isActive"
    />
    <div class="button-content">
      <p class="button-title" :class="type + '-title'">{{ type }} Tranches</p>
      <p class="apr">200.59% <span>APR</span></p>
    </div>
  </a>
</template>
<script>
export default {
  props: {
    type: String,
    isActive: Boolean,
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
  z-index: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  border-radius: 20px;
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

.button-title.mezzanine-title {
  color: #c345fe;
}

.button-title.senior-title {
  color: #37caff;
}

.apr {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.025em;
  color: #fff;
}

.apr span {
  opacity: 0.5;
}
.active {
  border: 2px solid #8180ff;
}
</style>
