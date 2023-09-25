<template>
  <div class="cauldron-top-up">
    <h3 class="title">Cauldron Top Up</h3>

    <div class="input-assets">
      <InputUrl :targetUrl="tenderlyForkUrl" :isDisabled="true" />
    </div>

    <CauldronsDropdown
      @changeCauldron="updateCauldronAddress"
      :isDisabled="isDisabledCauldronsDropdown"
    />

    <div class="input-assets">
      <InputNumber
        :isDisabled="isDisabledInputAmount"
        @changeInputNumber="updateCauldronAmount"
      />
    </div>

    <BaseButton :disabled="isDisabledActionHandler" @click="actionHandler"
      >Submit</BaseButton
    >
  </div>
</template>

<script>
import { providers } from "ethers";
import { defineAsyncComponent } from "vue";
import { TENDERLY_FORK_URL } from "@/constants/tenderly";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { topUpCauldron } from "@/helpers/tenderly/topUpCauldron";
import notification from "@/helpers/notification/notification.js";

export default {
  props: {
    activeFork: {
      type: Object,
    },
  },

  data() {
    return {
      tenderlyForkUrl: "",
      forkChainId: this.activeFork?.forkChainId,
      cauldronAddress: "",
      cauldronAmount: null,
    };
  },

  computed: {
    ...mapGetters({
      provider: "getProvider",
      chainId: "getChainId",
    }),

    isDisabledCauldronsDropdown() {
      return !this.tenderlyForkUrl;
    },

    isDisabledInputAmount() {
      return !this.cauldronAddress;
    },

    isDisabledActionHandler() {
      return !this.cauldronAddress || !this.cauldronAmount;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateCauldronAmount(amount) {
      this.cauldronAmount = amount;
    },

    updateCauldronAddress(address) {
      this.cauldronAddress = address;
    },

    async actionHandler() {
      if (this.isDisabledActionHandler) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const provider = this.activeFork
        ? this.provider
        : await new providers.JsonRpcProvider(this.tenderlyForkUrl);

      const { status, msg } = await topUpCauldron(
        this.cauldronAmount,
        this.cauldronAddress,
        this.forkChainId,
        provider
      );

      await this.deleteNotification(notificationId);

      await this.createNotification({
        msg: msg,
        type: status,
      });
    },
  },

  created() {
    this.tenderlyForkUrl = this.activeFork?.forkId
      ? `${TENDERLY_FORK_URL}${this.activeFork?.forkId}`
      : "";
  },

  components: {
    InputUrl: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputUrl.vue")
    ),
    CauldronsDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/Cauldrons.vue")
    ),
    InputNumber: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputNumber.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.cauldron-top-up {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.input-assets {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>
