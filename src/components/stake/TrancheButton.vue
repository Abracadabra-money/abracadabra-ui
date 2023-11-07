<template>
  <button
    class="tranche-button"
    :class="[{ active: isActive }, type]"
    @click="$emit('changeToken')"
  >
    <img class="tranche-icon" :src="btnIcon" />

    <img
      class="check-icon"
      src="@/assets/images/stake/check-icon.svg"
      v-if="isActive"
    />

    <div class="description">
      <p class="title" :class="type + '-title'">{{ type }} Tranche</p>
      <p class="value">
        <img
          class="deprecated-icon"
          v-tooltip="'Deprecated'"
          v-if="deprecated"
          src="@/assets/images/info-bar/depreciated.png"
          alt="Deprecated icon"
        />
        {{ apr }}
        <span>APR</span>
      </p>
    </div>
  </button>
</template>

<script>
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    isActive: Boolean,
    apr: { type: String, default: "0" },
    deprecated: { type: Boolean, default: false },
    type: { type: String, required: true, default: "senior" },
  },

  computed: {
    btnIcon() {
      if (this.type === "senior")
        return useImage("assets/images/stake/senior-icon.svg");
      if (this.type === "mezzanine")
        return useImage("assets/images/stake/mezzanine-icon.svg");
      return useImage("assets/images/stake/junior-icon.svg");
    },
  },
};
</script>
<style lang="scss" scoped>
.tranche-button {
  height: 65px;
  width: 100%;
  cursor: pointer;
  position: relative;
  z-index: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 2px solid #403e4a;
  text-align: left;

  &:hover {
    background: #616068;
  }
}

.active {
  border: 2px solid #8180ff;
}

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

.tranche-icon {
  position: absolute;
  top: 15px;
  left: 12px;
}

.check-icon {
  position: absolute;
  top: 23px;
  right: 8px;
}

.description {
  max-width: 90px;
  margin-left: 8px;
}

.title {
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #ff7100;
  margin-bottom: 5px;
}

.title:first-letter {
  text-transform: uppercase;
}

.title.mezzanine-title {
  color: #c345fe;
}

.title.senior-title {
  color: #37caff;
}

.value {
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.025em;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
}

.deprecated-icon {
  max-width: 15px;
}

.value span {
  opacity: 0.5;
}
</style>
