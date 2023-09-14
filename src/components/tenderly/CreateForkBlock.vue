<template>
  <div class="create-fork-block">
    <div class="network-dropdown-wrap">
      <NetworkDropdown @changeForkId="changeForkId" />
    </div>

    <BaseButton @click="createForkAction">
      <span class="create-button">
        <img
          class="tenderly-icon"
          src="@/assets/images/tenderly/tenderly_icon.png"
          alt="Tenderly icon"
        />Create Fork
      </span>
    </BaseButton>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    NetworkDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/Netwoks.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.create-fork-block {
  display: flex;
  gap: 15px;
  padding: 0 0 15px;
  align-items: center;
}

.network-dropdown-wrap {
  max-width: 200px;
  width: 100%;
}

.create-button {
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
}

.tenderly-icon {
  max-width: 30px;
}
</style>
