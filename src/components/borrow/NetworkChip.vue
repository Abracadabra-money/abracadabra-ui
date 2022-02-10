<template>
  <button class="chip" :class="{ selected }" @click="$emit('click', $event)">
    <TokenIcon v-if="icon" :imageName="icon" height="20px" isNetwork />
    <span class="network-name">{{ name }}</span>
  </button>
</template>

<script>
const TokenIcon = () => import("@/components/UIComponents/TokenIcon");

export default {
  name: "NetworkChip",
  components: { TokenIcon },
  props: {
    selected: { type: Boolean },
    icon: { type: String },
    name: { type: String, default: "" },
  },
};
</script>

<style scoped lang="scss">
.chip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 110px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  cursor: pointer;
  border: 2px solid rgba(118, 195, 245, 0);
  color: white;

  transition: background-color 0.2s, border-bottom-color 0.2s,
    border-top-color 0.2s, border-left-color 0.2s, border-right-color 0.2s;

  .network-name {
    margin-left: 8px;
  }
}

.selected {
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(118, 195, 245, 0.5);
}
</style>
