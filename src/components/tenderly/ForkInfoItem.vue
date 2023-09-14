<template>
  <div class="fork-info-item">
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
      <div class="toggle-use-fork">
        Use Fork
        <CheckBox @click="toggleActiveMarkets" :value="useFork" />
      </div>
      <BaseButton @click="addForkToMetamaskAction">Add/Switch</BaseButton>
      <BaseButton>Delete</BaseButton>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { TENDERLY_FORK_DATA } from "@/constants/tenderly";
import { addForkToMetamask } from "@/helpers/tenderly/addForkToMetamask";
import { tenderlyDispatchEvent } from "@/helpers/tenderly/tenderlyDispatchEvent";

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
    ...mapGetters({ chainId: "getChainId" }),

    timestamp() {
      const timestamp = this.forkData?.timestamp;
      const parsedDate = new Date(Date.parse(timestamp));
      return timestamp ? parsedDate.toLocaleDateString() : "xx";
    },
  },

  watch: {
    forkData() {
      this.useFork = this.forkData.useFork;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),

    async toggleActiveMarkets() {
      // todo Notification
      if (this.chainId !== this.forkData.forkChainId) {
        await this.createNotification({
          msg: "Switch chain",
          type: "warning",
        });
        return false;
      }

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

      tenderlyDispatchEvent();

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },

    async addForkToMetamaskAction() {
      await addForkToMetamask(this.forkData);
      window.location.reload();
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
</style>
