<template>
  <ul class="creation-type-tabs">
    <li
      :class="[
        'creation-type',
        { active: currentCreationType == creationTypes.Pegged },
      ]"
      @click="selectType(creationTypes.Pegged)"
    >
      <img
        class="mim-icon"
        src="@/assets/images/market/m-icon.svg"
        alt="Mim icon"
      />
      <span class="name">Pegged</span>
      <p class="description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor
      </p>
    </li>

    <li
      :class="[
        'creation-type',
        { active: currentCreationType == creationTypes.Standard },
      ]"
      @click="selectType(creationTypes.Standard)"
    >
      <img
        class="mim-icon"
        src="@/assets/images/market/m-icon.svg"
        alt="Mim icon"
      />
      <span class="name">Standard</span>
      <p class="description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor
      </p>
    </li>
  </ul>
</template>

<script lang="ts">
enum CreationTypes {
  Pegged = "PEGGED",
  Standard = "STANDARD",
}

export default {
  data() {
    return {
      currentCreationType: CreationTypes.Standard,
    };
  },

  computed: {
    creationTypes() {
      return CreationTypes;
    },
  },

  methods: {
    selectType(creationType: CreationTypes) {
      this.currentCreationType = creationType;
    },
  },
};
</script>

<style lang="scss" scoped>
.creation-type-tabs {
  display: flex;
  align-items: center;
  gap: 22px;
  list-style-type: none;
  height: fit-content;
}

.creation-type {
  position: relative;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  cursor: pointer;
}

.creation-type.active {
  border: 1px solid #2d4a96;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.32) 0%,
      rgba(116, 92, 210, 0.32) 100%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
}

.name {
  font-size: 18px;
  font-weight: 500;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
}

.mim-icon {
  position: absolute;
  top: 17px;
  left: 0;
}

@media (max-width: 600px) {
  .creation-type-tabs {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
