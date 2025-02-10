<template>
  <nav>
    <ul class="popup-links">
      <li @click="$emit('close-popup')">
        <MobileHeaderLink to="MyPositions">
          <img src="@/assets/images/header/positions-header-icon.png" />
          My Positions
        </MobileHeaderLink>
      </li>

      <li @click="$emit('close-popup')">
        <MobileHeaderLink to="Cauldrons">
          <img src="@/assets/images/header/dropdown/more/cauldrons-icon.png" />
          Cauldrons
        </MobileHeaderLink>
      </li>

      <li @click="$emit('close-popup')">
        <MobileHeaderLink to="StakeList">
          <img src="@/assets/images/header/dropdown/more/stake-icon.svg" />
          Stake
        </MobileHeaderLink>
      </li>

      <li @click="$emit('close-popup')">
        <MobileHeaderLink to="MarketsFarm">
          <img src="@/assets/images/header/dropdown/more/farms-icon.svg" />
          Farms
        </MobileHeaderLink>
      </li>

      <li @click="$emit('close-popup')">
        <MobileHeaderLink to="Beam">
          <img src="@/assets/images/header/dropdown/more/beam-icon.svg" />
          Beam
        </MobileHeaderLink>
      </li>

      <li @click="$emit('close-popup')">
        <MobileHeaderLink href="https://curve.fi/#/ethereum/pools/mim/swap">
          <img src="@/assets/images/header/dropdown/more/swap-icon.svg" />
          Swap
        </MobileHeaderLink>
      </li>

      <li @click="$emit('close-popup')">
        <MobileHeaderLink href="https://analytics.abracadabra.money/">
          <img src="@/assets/images/header/dropdown/more/bars-icon.svg" />
          Analytics
        </MobileHeaderLink>
      </li>

      <li @click="$emit('close-popup')">
        <MobileHeaderLink href="https://docs.abracadabra.money/learn/">
          <img src="@/assets/images/header/dropdown/more/docs-icon.svg" />
          Documentation
        </MobileHeaderLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
  },

  components: {
    MobileHeaderLink: defineAsyncComponent(
      () => import("@/components/ui/links/MobileHeaderLink.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup-links {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 23px;
  list-style: none;
}

.stake-wrap {
  display: flex;
  width: 100%;
}

.stake-btn {
  display: flex;
  gap: 6px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  height: 8px;
  width: 8px;
  transform: rotate(-90deg);
  margin-left: auto;
}
</style>
