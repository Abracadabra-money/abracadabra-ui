<template>
  <div class="choose">
    <h4>Choose Chain</h4>
    <div class="underline">
      <NetworksList />
    </div>

    <div class="first-input">
      <div class="header-balance">
        <h4>{{firstInput.text}}</h4>
        <p>Balance: {{firstInput.balance}}</p>
      </div>

      <ValueInput
        :icon="getImgUrl(firstInput.icon)"
        :name="firstInput.label"
        @input="change"
        :max="firstInput.max"
        :error="error"
      />
    </div>
    <div class="swap-img">
      <img src="@/assets/images/swap.svg" :class="{reflect: mode === 'UNSTAKE'}" @click="swapChain" alt="swap" />
    </div>
    <div class="second-input">
      <div class="header-balance">
        <h4>{{secondInput.text}}</h4>
        <p>Balance: {{secondInput.balance}}</p>
      </div>
      <ValueInput @input="change" disabled :icon="getImgUrl(secondInput.icon)" :name="secondInput.label" />
    </div>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const NetworksList = () => import("@/components/ui/NetworksList");

import { mapGetters } from "vuex";

export default {
  name: "StakeInputs",
  components: { ValueInput, NetworksList },
  props: {
    modes: {
      type: Object
    },
    error: {
      type: String
    },
    actions: {
      type: Array
    },
    mode: {
      type: String
    }
  },
  data: () => ({
    firstTokenIndex: 0,
    firstTokenValue: null
  }),
  methods: {
    change(value) {
      this.$emit("change",value)
    },
    getImgUrl(type) {
      var images = require.context('../../assets/images/tokens-icon/', false, /\.svg$/)
      return images('./' + type + ".svg")
    },
    apply() {

    },
    swapChain() {
      this.$emit("toggleAction");
    }
  },
  computed: {
    firstInput() {
      return this.modes[ this.mode === this.actions[0] ? this.actions[0] : this.actions[1] ].input;
    },
    secondInput() {
      return this.modes[ this.mode === this.actions[0] ? this.actions[1] : this.actions[0] ].input;
    },
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
  & img {
    transform: rotateX(0deg);
    transition: all 0.3s;
  }
  & img.reflect {
    transform: rotateX(180deg);
  }
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
