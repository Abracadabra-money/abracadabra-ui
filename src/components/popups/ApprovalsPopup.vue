<template>
  <div class="popup" v-click-outside="closePopup">
    <div class="popup-header">
      <p class="title">Attention</p>
      <img
        class="close"
        @click="closePopup"
        src="@/assets/images/close.svg"
        alt="close"
      />
    </div>

    <div class="popup-content">
      <img
        src="@/assets/images/notification-icons/warning-icon.png"
        alt=""
        class="main-img"
      />

      <p class="info-title">
        {{ titleText }}
      </p>
      <p class="info-subtitle">Revoke it now !</p>
    </div>

    <BaseButton @click="revokeHandler"
      >Revoke all
      {{ allowanceCount > 1 ? `(${allowanceCount})` : "" }}</BaseButton
    >
  </div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification";
import { mapGetters } from "vuex";
import { getAllowanceDatas } from "@/helpers/oldCauldronsAllowance.js";
import abiERC20 from "@/abis/zeroXSwap/abiERC20";
import { Contract } from "ethers";

export default {
  data() {
    return {
      allowanceCount: 0,
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      userSigner: "getSigner",
    }),
    titleText() {
      return `Your address has a ${
        this.allowanceCount > 1 ? "tokens" : "token"
      } spending allowance to an old ${
        this.allowanceCount > 1 ? "cauldrons" : "cauldron"
      }
        contract`;
    },
  },

  methods: {
    closePopup() {
      this.$store.commit("closePopups");
    },
    async revokeHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      const userData = await getAllowanceDatas(this.account, this.userSigner);

      console.log(userData);

      try {
        await Promise.all(
          userData.map(async (info) => {
            if (!info.isStillApproved) return false;

            const tokenContract = new Contract(
              info.token,
              abiERC20,
              this.userSigner
            );

            const tx = await tokenContract.approve(info.spender, 0);

            return await tx.wait();
          })
        );

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", notification.success);
        this.closePopup();
      } catch (error) {
        console.log(error.message);
        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },
  },

  async mounted() {
    const allovanceData = await getAllowanceDatas(
      this.account,
      this.userSigner
    );

    this.allowanceCount = allovanceData
      ? allovanceData.filter((item) => item.isStillApproved).length
      : 0;
  },

  components: { BaseButton },
};
</script>

<style lang="scss" scoped>
.popup {
  background: #302e38;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px 25px 10px;
  text-align: center;

  .main-img {
    width: 135px;
    height: auto;
    object-fit: contain;
    margin-bottom: 6px;
  }

  .info-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 1.3;
    margin-bottom: 4px;
  }

  .info-subtitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 1.3;
  }
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
}

.close {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
</style>
