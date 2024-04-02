<template>
  <div class="tenderly-mod" v-if="!!activeForkData">
    <button
      class="tenderly-tab-button"
      @click="goToTenderlyTap"
      @mousemove="isAdditionalButtons = true"
    >
      <img
        class="tenderly-tab-icon"
        src="@/assets/images/tenderly/tenderly_icon.png"
        alt="Tenderly Tab icon"
      />
    </button>

    <img
      class="switch-mod"
      v-show="isAdditionalButtons"
      v-tooltip="'Disconnect fork'"
      @click="toggleTenderlyMod"
      src="@/assets/images/tenderly/disconnect_fork.png"
      alt="Disconnect fork"
    />

    <img
      class="add-to-metamask"
      v-show="isAdditionalButtons"
      v-tooltip="'Add fork to metamask'"
      @click="addAndSwitch"
      src="@/assets/images/metamask.svg"
      alt="Add fork to metamask"
    />
  </div>
</template>

<script>
import {
  TENDERLY_FORK_DATA,
  TENDERLY_EVENT_CHANGED_DATA,
} from "@/constants/tenderly";
import { mapActions, mapGetters } from "vuex";
import { chainsConfigs } from "@/helpers/chains/configs";
import notification from "@/helpers/notification/notification";
import { addAndSwitchForkOnWallet } from "@/helpers/tenderly/addAndSwitchForkOnWallet";

export default {
  data() {
    return {
      isAdditionalButtons: false,
      forksData: JSON.parse(localStorage.getItem("tenderly_fork_data")),
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    activeForkData() {
      if (!this.forksData) return null;
      return this.forksData.find((data) => {
        if (data?.useFork) return data;
      });
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),

    goToTenderlyTap() {
      this.$router.push({ name: "TenderlyTap" });
    },

    async toggleTenderlyMod() {
      this.forksData.find((fork) => {
        fork.useFork = false;
      });

      localStorage.setItem(TENDERLY_FORK_DATA, JSON.stringify(this.forksData));
      window.location.reload();
    },

    async addAndSwitch() {
      const networkConfig = chainsConfigs.find(
        (network) => network.chainId === this.chainId
      );

      const { error } = await addAndSwitchForkOnWallet(
        this.activeForkData,
        networkConfig.switchData
      );
      if (!error) window.location.reload();
    },
  },

  async mounted() {
    window.addEventListener(TENDERLY_EVENT_CHANGED_DATA, () => {
      this.forksData = JSON.parse(localStorage.getItem(TENDERLY_FORK_DATA));
    });

    if (this.activeForkData) {
      await this.createNotification(notification.tenderlyMod);
    }
  },
};
</script>

<style lang="scss" scoped>
.tenderly-mod {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: fixed;
  bottom: 40px;
  right: 40px;
  transition: all 0.5s ease-in-out;
}

.tenderly-mod:hover {
  width: 130px;
  height: 130px;
  bottom: 0px;
  right: 0px;

  .switch-mod,
  .add-to-metamask {
    visibility: visible;
    opacity: 1;
  }
}

.tenderly-tab-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #2b2b3c;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  border: none;
  outline: transparent;
}

.tenderly-tab-icon {
  max-width: 30px;
}

.switch-mod,
.add-to-metamask {
  cursor: pointer;
  visibility: hidden;
  position: fixed;
  opacity: 0;
  bottom: 95px;
  right: 45px;
  width: 40px;
  height: 40px;
  transition: all 0.5s ease-in-out;
}
.add-to-metamask {
  bottom: 45px;
  right: 95px;
}
</style>
