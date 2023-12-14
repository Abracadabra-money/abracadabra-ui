<template>
  <div
    :class="['cauldrons-table-item', cauldronLabel, { open: isOpenPosition }]"
  >
    <div class="label">{{ cauldronLabel }}</div>
    <div class="column">
      <div class="cauldron-info">
        <div class="icons-wrap">
          <img class="cauldron-icon" :src="cauldron.config.icon" alt="" />
          <img
            class="chain-icon"
            :src="getChainIcon(cauldron.config.chainId)"
            alt=""
          />
        </div>
        {{ cauldron.config.name }}
      </div>
    </div>

    <div class="column">${{ formatLargeSum(cauldron.mainParams.tvl) }}</div>

    <div class="column">
      {{ formatLargeSum(cauldron.mainParams.totalBorrowed) }}
    </div>

    <div class="column">
      {{ formatLargeSum(cauldron.mainParams.mimLeftToBorrow) }}
    </div>

    <div class="column">{{ cauldron.mainParams.interest }}%</div>

    <div class="column">
      <span class="apr">{{ collateralApy }}</span>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { utils, providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { getChainIcon } from "@/helpers/chains/getChainIcon.ts";
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";

const APR_KEY = "abracadabraCauldronsApr";

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
      if (this.cauldron.config.cauldronSettings?.isNew) return "new";
      if (this.cauldron.config.cauldronSettings?.isDepreciated)
        return "deprecated";
      return "";
    },
  },

  methods: {
    getChainIcon,
    formatUnits(value) {
      return utils.formatUnits(value);
    },

    formatLargeSum(value) {
      return filters.formatLargeSum(utils.formatUnits(value));
    },

    async fetchCollateralApy(chainId, address) {
      const provider = new providers.StaticJsonRpcProvider(defaultRpc[chainId]);

      const apr = await fetchTokenApy(this.cauldron, chainId, provider);

      const localData = localStorage.getItem("abracadabraCauldronsApr");
      const parsedData = localData ? JSON.parse(localData) : {};

      parsedData[address] = {
        chainId,
        apr: Number(filters.formatToFixed(apr, 2)),
        createdAt: new Date().getTime(),
      };

      localStorage.setItem(APR_KEY, JSON.stringify(parsedData));

      return filters.formatToFixed(apr, 2);
    },

    timeHasPassed(localData, address) {
      if (!localData) return true;
      if (!localData[address]) return true;

      const allowedTime = 5;
      const { createdAt } = localData[address];
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - createdAt;
      const minutes = Math.floor(timeDiff / 1000 / 60);
      return minutes > allowedTime;
    },

    async initApy() {
      const { chainId, id, contract } = this.cauldron.config;
      const isApyExist = isApyCalcExist(chainId, id);

      if (isApyExist) {
        const localApr = localStorage.getItem("abracadabraCauldronsApr");
        const parseLocalApr = localApr ? JSON.parse(localApr) : null;

        const isOutdated = this.timeHasPassed(parseLocalApr, contract.address);

        const collateralApy = !isOutdated
          ? parseLocalApr[contract.address].apr
          : await this.fetchCollateralApy(chainId, contract.address);

        this.collateralApy = `${collateralApy}% - ${collateralApy * 4}%`;
      }
    },
  },

  async created() {
    await this.initApy();
  },
};
</script>

<style lang="scss" scoped>
.cauldrons-table-item {
  border-radius: 16px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(8, 14, 31, 0.6);
  padding: 20px 32px;
  display: grid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.label {
  display: none;
  position: absolute;
  text-align: center;
  top: 50%;
  left: -43px;
  width: 100px;
  font-size: 9px;
  font-weight: 500;
  line-height: 16px;
  transform: translateY(-50%) rotate(-90deg);
  background: linear-gradient(180deg, #67a069 0%, #446a46 100%);

  &::first-letter {
    text-transform: uppercase;
  }
}

.new {
  border: 1px solid #649c66;

  .apr {
    padding: 5px 10px;
    border-radius: 10px;
    border: 1px solid #2d4a96;
  }

  .label {
    display: block;
    background: linear-gradient(180deg, #67a069 0%, #446a46 100%);
  }
}

.deprecated {
  border: 1px solid #48161e;

  .label {
    display: block;
    background: linear-gradient(180deg, #320a0a 0%, #871d1f 100%),
      linear-gradient(180deg, #67a069 0%, #446a46 100%);
  }
}

.open {
  background: url("@/assets/images/cauldrons/table-item-background.png");

  .apr {
    border-radius: 10px;
    padding: 5px 10px;
    background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
    -webkit-text-fill-color: #fff;
  }
}

.column {
  max-width: 180px;
  width: 100%;
}

.cauldron-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.icons-wrap {
  position: relative;
  width: 44px;
}

.cauldron-icon {
  width: 44px;
  height: 44px;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -10px;
}

.apr {
  text-align: center;
  text-shadow: 0px 0px 16px #ab5de8;
  background: linear-gradient(90deg, #7a91cc 0%, #8b71d2 50.52%, #411fc8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
