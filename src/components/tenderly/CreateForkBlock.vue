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
import { TENDERLY_FORK_DATA } from "@/constants/tenderly";
import { createFork } from "@/helpers/tenderly/createFork";
import { tenderlyDispatchEvent } from "@/helpers/tenderly/tenderlyDispatchEvent";

export default {
  data() {
    return {
      selectedForkId: 1,
    };
  },

  methods: {
    changeForkId(chainId) {
      this.selectedForkId = chainId;
    },

    async createForkAction() {
      const localForksData =
        JSON.parse(localStorage.getItem(TENDERLY_FORK_DATA)) || [];
      localForksData.push(await createFork(this.selectedForkId));
      localStorage.setItem(TENDERLY_FORK_DATA, JSON.stringify(localForksData));
      tenderlyDispatchEvent();
    },
  },

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
