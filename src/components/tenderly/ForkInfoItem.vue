<template>
  <div class="fork-info-item" :class="timeLine">
    <div class="info-row">
      <p>Chain ID</p>
      <p>{{ forkData.forkChainId }}</p>
    </div>

    <div class="info-row">
      <p>Fork ID</p>
      <p>{{ forkData.forkId }}</p>
    </div>

    <div class="info-row">
      <p>Created</p>
      <p>{{ timestamp }}</p>
    </div>

    <div class="btns-wrap">
      <div class="toggle-use-fork" :class="{ disabled: isDisabled }">
        Use Fork
        <CheckBox
          :value="useFork"
          :disabled="isDisabled"
          @click="toggleUseFork"
        />
      </div>

      <BaseButton :disabled="isDisabled" @click="addAndSwitch">
        Add/Switch
      </BaseButton>

      <BaseButton @click="deleteFork">Delete</BaseButton>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { TENDERLY_FORK_DATA } from "@/constants/tenderly";
import { deleteFork } from "@/helpers/tenderly/deleteFork";
import { networksConfig } from "@/utils/networks/networksConfig";
import { tenderlyDispatchEvent } from "@/helpers/tenderly/tenderlyDispatchEvent";
import { addAndSwitchForkOnWallet } from "@/helpers/tenderly/addAndSwitchForkOnWallet";

export default {
  props: {
    forkData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      useFork: this.forkData.useFork,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    timeLine() {
      const timestamp = Date.parse(this.forkData?.timestamp);
      const currentTimestamp = moment();

      const isTwelveHoursPassed = moment(
        new Date(timestamp + 60 * 60 * 12 * 1000)
      ).isBefore(currentTimestamp);

      if (isTwelveHoursPassed) return "high";

      const isSixHoursPassed = moment(
        new Date(timestamp + 60 * 60 * 6 * 1000)
      ).isBefore(currentTimestamp);

      if (isSixHoursPassed) return "medium";

      return "safe";
    },

    timestamp() {
      const timestamp = this.forkData?.timestamp;
      const parsedDate = new Date(Date.parse(timestamp));
      const hours = parsedDate.getHours();
      const minutes = parsedDate.getMinutes();

      return timestamp
        ? `${parsedDate.toLocaleDateString()} ${hours}:${minutes}`
        : "xx";
    },

    isDisabled() {
      return this.chainId !== this.forkData.forkChainId;
    },
  },

  watch: {
    forkData() {
      this.useFork = this.forkData.useFork;
    },
  },

  methods: {
    async toggleUseFork() {
      if (this.isDisabled) return false;

      this.useFork = !this.useFork;
      const data = JSON.parse(localStorage.getItem(TENDERLY_FORK_DATA));

      data.find((fork) => {
        if (
          fork.forkId === this.forkData.forkId &&
          this.chainId === this.forkData.forkChainId
        )
          fork.useFork = this.useFork;
        else fork.useFork = false;
      });

      localStorage.setItem(TENDERLY_FORK_DATA, JSON.stringify(data));

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },

    async addAndSwitch() {
      if (this.chainId !== this.forkData.forkChainId) return false;
      const networkConfig = networksConfig.find(
        (network) => network.chainId === this.chainId
      );

      const { error } = await addAndSwitchForkOnWallet(
        this.forkData,
        networkConfig.switchData
      );

      if (!error) window.location.reload();
    },

    async deleteFork() {
      const { forkId, useFork } = this.forkData;

      await deleteFork(forkId);

      const localForksData = JSON.parse(
        localStorage.getItem(TENDERLY_FORK_DATA)
      );

      const filteredForksData = localForksData.filter(
        (fork) => fork.forkId !== this.forkData.forkId
      );

      localStorage.setItem(
        TENDERLY_FORK_DATA,
        JSON.stringify(filteredForksData)
      );

      if (useFork) window.location.reload();
      else tenderlyDispatchEvent();
    },
  },

  components: {
    CheckBox: defineAsyncComponent(() =>
      import("@/components/ui/CheckBox.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.fork-info-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: #2b2b3c;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.safe {
  border: 1px solid #63ff7b;
  color: #fff;
}

.medium {
  border: 1px solid #ffb800;
  color: #fff;
}

.high {
  border: 1px solid #fe1842;
  color: #fff;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.btns-wrap {
  display: flex;
  gap: 5px;
}

.toggle-use-fork {
  height: 50px;
  max-width: 160px;
  min-width: 140px;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  line-height: 24px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  border: 2px solid #648fcc;
}

.disabled {
  cursor: not-allowed;
  background: #403e4a;
  color: rgba(255, 255, 255, 0.6);
}
</style>
