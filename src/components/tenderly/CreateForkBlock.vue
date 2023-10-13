<template>
  <div class="create-fork-block">
    <h3 class="title">Fork Creation</h3>
    <div class="create-fork">
      <div class="network-dropdown-wrap">
        <NetworkDropdown @changeForkId="changeForkId" />
      </div>

      <button class="create-button" @click="createForkAction">
        <img
          class="tenderly-icon"
          src="@/assets/images/tenderly/tenderly_icon.png"
          alt="Tenderly icon"
        />Create Fork
      </button>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { TENDERLY_FORK_DATA } from "@/constants/tenderly";
import { createTenderlyFork } from "@/helpers/tenderly/createTenderlyFork";
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
      localForksData.unshift(await createTenderlyFork(this.selectedForkId));
      localStorage.setItem(TENDERLY_FORK_DATA, JSON.stringify(localForksData));
      tenderlyDispatchEvent();
    },
  },

  components: {
    NetworkDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/Netwoks.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.create-fork-block {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px 15px;
  background-color: rgba(35, 33, 45, 0.3019607843);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.create-fork {
  cursor: pointer;
  border-radius: 20px;
  background: #403e4a;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.network-dropdown-wrap {
  width: 100%;
}

.create-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
  height: 50px;
  border-radius: 20px;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
}

.create-button:hover {
  background: #616068;
}

.tenderly-icon {
  max-width: 30px;
}
</style>
