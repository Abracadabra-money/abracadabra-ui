<template>
  <router-link
    :class="['cauldron-table-link', cauldronLabel, { open: isOpenPosition }]"
    :to="goToPage(cauldron)"
  >
    <div class="label">{{ cauldronLabel }}</div>

    <div class="row">
      <div class="cauldron-info">
        <div class="icons-wrap">
          <img class="cauldron-icon" :src="cauldron.config.icon" alt="" />
          <img
            class="chain-icon"
            :src="getChainIcon(cauldron.config.chainId)"
            alt="Chain icon"
          />
        </div>
        {{ cauldron.config.name }}
      </div>

      <div class="apr">
        {{ loopApr }}
      </div>
    </div>

    <div class="row">
      <div>
        <h3 class="title">TVL</h3>
        <div class="value">${{ formatLargeSum(cauldron.mainParams.tvl) }}</div>
      </div>

      <div>
        <h3 class="title">TMB</h3>
        <div class="value">
          {{ formatLargeSum(cauldron.mainParams.totalBorrowed) }}
        </div>
      </div>

      <div>
        <h3 class="title">MIMS LB</h3>
        <div class="value">
          {{ formatLargeSum(cauldron.mainParams.mimLeftToBorrow) }}
        </div>
      </div>

      <div>
        <h3 class="title">Interest</h3>
        <div class="value">{{ cauldron.mainParams.interest }}%</div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { utils } from "ethers";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { formatToFixed, formatLargeSum } from "@/helpers/filters";

export default {
  props: {
    cauldron: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      collateralApy: "-",
    };
  },

  computed: {
    isOpenPosition() {
      return (
        this.cauldron.userPosition.collateralInfo.userCollateralShare.gt(0) ||
        this.cauldron.userPosition.borrowInfo.userBorrowPart.gt(0)
      );
    },

    cauldronLabel() {
      if (this.cauldron.config.chainId === 80085) return "testnet";
      if (this.cauldron.config.cauldronSettings?.isNew) return "new";
      if (this.cauldron.config.cauldronSettings?.isDepreciated)
        return "deprecated";
      return "";
    },

    loopApr() {
      if (this.cauldron.apr.value) {
        return `${this.cauldron.apr.value}% - ${formatToFixed(
          this.cauldron.apr.value * this.cauldron.apr.multiplier,
          2
        )}%`;
      }
      return "-";
    },
  },

  methods: {
    goToPage(cauldron: any) {
      const { chainId, id } = cauldron.config;
      return {
        name: "Market",
        params: { chainId, cauldronId: id },
      };
    },

    getChainIcon,
    formatUnits(value: string) {
      return utils.formatUnits(value);
    },

    formatLargeSum(value: string) {
      return formatLargeSum(utils.formatUnits(value));
    },
  },
};
</script>

<style lang="scss" scoped>
.cauldron-table-link {
  border-radius: 16px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(8, 14, 31, 0.6);
  color: #fff;
  padding: 25px 12px 20px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.01);
    border-radius: 16px;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.16);
    border-radius: 16px;
  }
}

.label {
  display: none;
  position: absolute;
  text-align: center;
  top: 0;
  left: 0;
  width: 117px;
  font-size: 10px;
  font-weight: 500;
  line-height: 150%;
  border-radius: 0px 0px 8px 0px;
  background: linear-gradient(180deg, #67a069 0%, #446a46 100%);

  &::first-letter {
    text-transform: uppercase;
  }
}

.new {
  border: 1px solid #304d99;

  .label {
    display: block;
    background: linear-gradient(0deg, #2d4a96 0%, #5b7cd1 100%);
  }
}

.testnet {
  border: 1px solid #af6900;

  .label {
    display: block;
    background: linear-gradient(0deg, #AF6900 100%, #e9984d 100%);
  }
}

.deprecated {
  border: 1px solid #4a2130;

  .label {
    display: block;
    background: linear-gradient(180deg, #8c4040 0%, #6b2424 100%);
  }
}

.open {
  background: url("@/assets/images/cauldrons/table-item-background.png");
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cauldron-info {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 14px;
}

.icons-wrap {
  position: relative;
}

.cauldron-icon {
  width: 44px;
  height: 44px;
}

.chain-icon {
  position: absolute;
  top: -5px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #0d1427;
}

.apr {
  font-size: 14px;
  font-weight: 600;
  line-height: 150%;
  text-shadow: 0px 0px 16px #ab5de8;
}

.title {
  color: #99a0b2;
  font-size: 14px;
  font-weight: 500;
}

.value {
  font-size: 14px;
  font-weight: 400;
}
</style>
