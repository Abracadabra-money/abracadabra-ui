<template>
  <div class="fork-info">
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
    <div class="btns">
      <div class="toggle-markets">
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
import { addForkToMetamask } from "@/helpers/tenderly/addForkToMetamask";

export default {
  props: { forkData: {} },

  data() {
    return { useFork: this.forkData.useFork };
  },

  computed: {
    timestamp() {
      const timestamp = this.forkData?.timestamp;
      const createdDate = new Date(Date.parse(timestamp));
      return timestamp ? createdDate.toLocaleDateString() : "xx";
    },
  },

  watch: {
    forkData() {
      this.useFork = this.forkData.useFork;
    },
  },

  methods: {
    async toggleActiveMarkets() {
      this.useFork = !this.useFork;
      const data = JSON.parse(localStorage.getItem("tenderly_fork_data"));

      data.find((fork) => {
        if (fork.forkId === this.forkData.forkId) fork.useFork = this.useFork;
        else fork.useFork = false;
      });

      localStorage.setItem("tenderly_fork_data", JSON.stringify(data));

      await window.dispatchEvent(
        new CustomEvent("tenderly_fork_data-changed", {
          detail: {
            storage: localStorage.getItem("tenderly_fork_data"),
          },
        })
      );

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },

    async addForkToMetamaskAction() {
      // if (!this.forkData) {
      //   const forkData = JSON.parse(localStorage.getItem("tenderly_fork_data"));
      //   this.forkData = !forkData ? null : forkData;
      //   if (!forkData) return false;
      // }

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
.fork-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  // border: 1px solid red;
  border-radius: 30px;
  padding: 15px;
  background: #2b2b3c;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.btns {
  display: flex;
  gap: 5px;
}

.toggle-markets {
  height: 50px;
  max-width: 160px;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 24px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
  border: 2px solid #648fcc;
}
</style>
