<template>
  <button
    class="deposit-btn"
    v-if="!!depositConfig"
    @click.stop="openCollateralPopup"
  >
    <img
      class="deposit-btn-icon"
      src="@/assets/images/deposit.svg"
      alt="Deposit"
    />
    {{ depositConfig.title }}
  </button>
</template>

<script>
import { mapGetters } from "vuex";
import { getAdditionalStakeConfig } from "@/helpers/stake/getAdditionalStakeConfig.ts";
export default {
  props: {
    cauldron: { type: Object, required: true },
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    depositConfig() {
      if (!this.account) return false;
      return getAdditionalStakeConfig(this.cauldron.config.id, this.chainId);
    },
  },

  methods: {
    openCollateralPopup() {
      this.$store.commit("setPopupState", {
        type: this.depositConfig.type,
        isShow: true,
        data: this.depositConfig?.data,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit-btn {
  background: rgba(157, 244, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 3px 8px;
  color: #63caf8;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.deposit-btn-icon {
  margin-right: 5px;
}
</style>
