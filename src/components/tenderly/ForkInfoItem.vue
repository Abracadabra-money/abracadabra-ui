<template>
  <div class="fork-info-item">
    <div class="info-row">
      <p>Chain</p>
      <p class="chain-info">
        {{ forkData.forkChainId }}
        <img class="chain-icon" :src="chainInfo.icon" :alt="chainInfo.symbol" />
      </p>
    </div>

    <div class="info-row">
      <p>Fork ID</p>
      <p class="clipboard" @click="clipboard">
        {{ `${forkData.rpcUrl.slice(0, 4)}...${forkData.rpcUrl.slice(-4)}` }}
        <img src="@/assets/images/clipboard.svg" alt="" />
      </p>
    </div>

    <div class="info-row">
      <p>Created</p>
      <p class="time-line" :class="timeLine" v-tooltip="timestampTooltip">
        <span class="emoji" v-if="timeLine === 'high'">&#128545;</span>
        <span class="emoji" v-if="timeLine === 'medium'">&#128528;</span>
        <span class="emoji" v-if="timeLine === 'safe'">&#128512;</span>
        {{ timestamp }}
      </p>
    </div>

    <div class="btns-wrap">
      <div class="toggle-use-fork">
        Use Fork
        <CheckBox :value="useFork" @click="toggleUseFork" />
      </div>

      <BaseButton v-tooltip="'Add/Switch'" @click="addAndSwitch">
        <img class="metamask-icon" src="@/assets/images/metamask.svg" alt=""
      /></BaseButton>

      <BaseButton v-tooltip="'Delete fork'" @click="deleteFork">
        <img class="delete-icon" src="@/assets/images/delete.svg" alt="" />
      </BaseButton>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { TENDERLY_FORK_DATA } from "@/constants/tenderly";
import { deleteFork } from "@/helpers/tenderly/deleteFork";
import notification from "@/helpers/notification/notification.js";
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
      account: "getAccount",
      chainId: "getChainId",
      getChainById: "getChainById",
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

    chainInfo() {
      return this.getChainById(this.forkData.forkChainId);
    },

    timestampTooltip() {
      if (this.timeLine === "safe") return "New fork";
      if (this.timeLine === "medium") return "Normal fork";
      return "Bad fork";
    },
  },

  watch: {
    forkData() {
      this.useFork = this.forkData.useFork;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    async toggleUseFork() {
      this.useFork = !this.useFork;
      const data = JSON.parse(localStorage.getItem(TENDERLY_FORK_DATA));

      data.map((fork) => {
        if (fork.forkId === this.forkData.forkId) fork.useFork = this.useFork;
        else fork.useFork = false;
        return fork;
      });

      if (
        this.chainId !== this.forkData.forkChainId &&
        this.useFork &&
        this.account
      ) {
        const response = await this.addAndSwitch();
        if (response)
          localStorage.setItem(TENDERLY_FORK_DATA, JSON.stringify(data));
        else this.useFork = !this.useFork;
      } else {
        localStorage.setItem(TENDERLY_FORK_DATA, JSON.stringify(data));
        this.reload();
      }
    },

    async addAndSwitch() {
      return await addAndSwitchForkOnWallet(this.forkData);
    },

    reload() {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", this.forkData.forkChainId);

      setTimeout(() => {
        window.location.reload();
      }, 300);
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

    clipboard() {
      navigator.clipboard.writeText(this.forkData.rpcUrl);
      this.createNotification(notification.clipboard);
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

.info-row {
  display: flex;
  justify-content: space-between;
}

.chain-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chain-icon {
  max-width: 25px;
}

.clipboard,
.time {
  cursor: pointer;
  display: flex;
  gap: 5px;
  align-items: center;
}

.clipboard {
  cursor: pointer;
}

.safe {
  color: #63ff7b;
}

.medium {
  color: #ffb800;
}

.high {
  color: #fe1842;
}

.emoji {
  font-size: 20px;
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

.metamask-icon {
  width: 35px;
  height: 35px;
}

.delete-icon {
  width: 25px;
  height: 25px;
}
</style>
