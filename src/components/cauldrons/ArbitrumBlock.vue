<template>
  <div v-if="isArbitrumChain">
    <div class="banner-wrap">
      <img class="banner-coins" src="@/assets/gifs/coins.gif" alt="" />
      <img
        class="banner-book"
        src="@/assets/images/arbitrum/book-background.png"
        alt=""
      />
    </div>

    <div class="farm-cards-wrap">
      <h4 class="farm-title">Explore the Abracadabra ecosystem on Arbitrum!</h4>

      <FarmItem v-if="farmCardInfo" :farm="farmCardInfo" :top="true" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import farmsConfig from "@/configs/farms/farms";
import { getFarmConfig } from "@/helpers/farm/utils";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import type { FarmConfig } from "@/configs/farms/types";
import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";

type Data = {
  MIM2CrvFarmId: number;
  farmCardInfo: null | any;
};

export default {
  data(): Data {
    return {
      MIM2CrvFarmId: 4,
      farmCardInfo: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      localFarmList: "getFarmList",
    }),

    isArbitrumChain(): boolean {
      return this.chainId === ARBITRUM_CHAIN_ID;
    },
  },

  methods: {
    getFarmConfig(farmId: number, chainId: number): FarmConfig | undefined {
      return farmsConfig.find(
        (farm) => farm.id === farmId && farm.contractChain === chainId
      );
    },

    async createFarmInfo(): Promise<void> {
      const farmConfig = getFarmConfig(this.MIM2CrvFarmId, ARBITRUM_CHAIN_ID);
      if (!farmConfig) return;

      this.farmCardInfo = await createFarmItemConfig(
        farmConfig.id,
        farmConfig.contractChain,
        this.account,
        true
      );
    },
  },

  async created() {
    await this.createFarmInfo();
  },

  components: {
    FarmItem: defineAsyncComponent(
      () => import("@/components/farm/FarmItem.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.banner-wrap {
  position: absolute;
  top: 44px;
  right: 0;
  max-width: 871px;
  width: 100%;
  z-index: 0;
}

.banner-coins {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  z-index: 0;
}

.banner-book {
  width: 100%;
}

.farm-cards-wrap {
  z-index: 1;
}

.farm-title {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.6px;
  margin-bottom: 12px;
  z-index: 10;
}

@media screen and (max-width: 1024px) {
  .banner-wrap {
    max-width: 600px;
    top: 200px;
    z-index: 0;
  }
}

@media screen and (max-width: 768px) {
  .banner-wrap {
    position: inherit;
    max-width: 100%;
    margin-bottom: 16px;
  }
}

@media screen and (max-width: 600px) {
  .farm-title {
    font-size: 20px;
  }
}
</style>
