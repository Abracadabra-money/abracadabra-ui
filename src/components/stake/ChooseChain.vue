<template>
  <div class="choose">
    <h4>Choose Chain</h4>
    <div class="underline">
      <NetworksList />
    </div>

    <div class="first-input">
      <div class="header-balance">
        <h4>Deposit</h4>
        <p>Balance: 200,000.00</p>
      </div>

      <ValueInput
        :icon="getImgUrl('spell-icon')"
        :name="'Spell'"
        v-model="firstTokenValue"
        :max="12.292215"
        error="Some Error Text"
        isChooseToken
      />
    </div>
    <div class="swap-img">
      <img src="@/assets/images/swap.svg" alt="swap" />
    </div>
    <div class="second-input">
      <div class="header-balance">
        <h4>Receive</h4>
        <p>Balance: 3,000.00</p>
      </div>
      <ValueInput :icon="getImgUrl('sspell-icon')" :name="'sSpell'" />
    </div>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const NetworksList = () => import("@/components/ui/NetworksList");
import { mapGetters } from "vuex";

export default {
  name: "ChooseChain",
  components: { ValueInput, NetworksList },
  data: () => ({
    firstTokenIndex: 0,
    firstTokenValue: null,
  }),
  methods: {
    getImgUrl(type) {
      var images = require.context('../../assets/images/tokens-icon/', false, /\.svg$/)
      return images('./' + type + ".svg")
    }
  },
  computed: {
    ...mapGetters({ networks: "getAvailableNetworks" }),
  },
};
</script>

<style lang="scss" scoped>

.swap-img {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.choose-stake-input {
  background-color: white;
}
.choose {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.first-input {
  padding-top: 27px;
  padding-bottom: 24px;
}

.second-input {
  padding-top: 27px;
  padding-bottom: 14px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
}
</style>
