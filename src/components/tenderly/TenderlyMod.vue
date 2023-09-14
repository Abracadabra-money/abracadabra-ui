<template>
  <div class="test">
    <div
      class="wrap"
      v-if="isTenderlyMod"
      @click="test"
      @mousemove="upHere = true"
    >
      <img
        class="icon"
        src="@/assets/images/tenderly/tenderly_icon.png"
        alt=""
      />
    </div>

    <img
      v-tooltip="'Delete Fork'"
      class="dis-icon"
      v-show="upHere"
      src="@/assets/images/tenderly/disconnect_fork.png"
      alt=""
      @click="disconnectDevMod"
    />

    <img
      v-tooltip="'Add fork to metamask'"
      class="add"
      v-show="upHere"
      src="@/assets/images/tenderly/add_fork.png"
      alt=""
      @click="addForkToMetamaskAction"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { addForkToMetamask } from "@/helpers/tenderly/addForkToMetamask";

export default {
  data() {
    return {
      upHere: false,
      isTenderlyMod: !!localStorage.getItem("tenderly_fork_data"),
    };
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    test() {
      this.$router.push({ name: "TenderlyTap" });
    },

    disconnectDevMod() {
      localStorage.removeItem("tenderly_fork_data");
      window.location.reload();
    },

    async addForkToMetamaskAction() {
      const forkData = JSON.parse(localStorage.getItem("tenderly_fork_data"));

      await addForkToMetamask(forkData);
      window.location.reload();
    },
  },

  async mounted() {
    window.addEventListener("tenderly_fork_data-changed", () => {
      this.isTenderlyMod = !!localStorage.getItem("tenderly_fork_data");
    });

    if (this.isTenderlyMod) {
      await this.createNotification({
        msg: "You have Tenderly mod enabled. Make sure that Fork is selected in your wallet. Or log out.",
        type: "warning",
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.test {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: fixed;
  bottom: 40px;
  right: 40px;
  transition: all 0.5s ease-in-out;

  &:hover {
    width: 130px;
    height: 130px;
    bottom: 0px;
    right: 0px;

    .dis-icon,
    .add {
      visibility: visible;
      opacity: 1;
    }
  }
}

.wrap {
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
}

.icon {
  max-width: 30px;
}

.dis-icon {
  visibility: hidden;
  position: fixed;
  opacity: 0;
  bottom: 95px;
  right: 45px;
  width: 40px;
  height: 40px;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
}
.add {
  visibility: hidden;
  cursor: pointer;
  position: fixed;
  opacity: 0;
  bottom: 45px;
  right: 95px;
  width: 40px;
  height: 40px;
  transition: all 0.5s ease-in-out;
}
</style>
