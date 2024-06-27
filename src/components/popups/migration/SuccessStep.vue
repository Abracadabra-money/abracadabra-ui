<template>
  <h3 class="title">Migration Completed</h3>

  <div class="mlp-info">
    <div class="mlp-icon-wrap">
      <img class="mlp-icon" src="@/assets/images/tokens/MIM-USDB.png" alt="" />
      <span class="mlp-title">MLP Available for Migration </span>
    </div>

    <div class="mlp-amounts">
      <div class="mlp-balance">
        {{ formatTokenBalance(parseAvailableAmount) }}
      </div>
      <div class="mlp-balance-usd">{{ availableAmountUsd }}</div>
    </div>
  </div>

  <div class="subtitle">
    Funds migrated to Arbitrum. Enjoy LP farms on Arbitrum here, to earn ARB and
    SPELL rewards
  </div>

  <div class="migrate-wrap">
    <div>
      <div class="chain-wrap">
        <img
          class="chain-icon"
          src="@/assets/images/blastLpMigration/arbitrum-icon.png"
          alt=""
        />
      </div>
      <div class="to-address">Arbitrum</div>
    </div>

    <div class="amounts-info">
      <div class="token-info">
        <img
          class="token-icon"
          src="@/assets/images/tokens/MIM.png"
          alt="MIM token icon"
        />
        <span class="token-amount"> {{ formattedTokenExpecteds.base }}</span>
      </div>

      <div class="token-info">
        <img
          class="token-icon"
          src="@/assets/images/tokens/USDT.png"
          alt="USDT token icon"
        />
        <span class="token-amount"> {{ formattedTokenExpecteds.quote }}</span>
      </div>
    </div>
  </div>

  <div class="btn-wrap">
    <BaseButton @click="actionHandler" primary> Go to Farm Page </BaseButton>

    <p class="layer-zero-wrap" v-if="layerZeroLink">
      See your transaction on
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="20"
        viewBox="0 0 13 20"
        fill="none"
      >
        <path
          d="M6.4995 0C5.75103 0 5.01484 0.15951 4.31545 0.441719C3.62833 0.736197 3.00257 1.15337 2.47496 1.69325C1.94735 2.23313 1.53017 2.8589 1.24797 3.55828C0.965757 4.25767 0.818517 5.00613 0.830787 5.7546V7.65644H5.43201V4.8957C5.43201 4.76074 5.45655 4.63804 5.50563 4.51534C5.55471 4.39264 5.62833 4.28221 5.71422 4.19632C5.80011 4.11043 5.91054 4.03681 6.03324 3.98773C6.15594 3.93865 6.27864 3.91411 6.41361 3.91411H6.58539C6.70809 3.91411 6.84306 3.93865 6.96576 3.98773C7.08846 4.03681 7.19889 4.11043 7.28478 4.19632C7.37067 4.28221 7.44428 4.39264 7.49336 4.51534C7.54244 4.63804 7.56698 4.76074 7.56698 4.8957V12.2822C8.16821 12.2822 8.76944 12.1595 9.33386 11.9264C9.89827 11.6933 10.4013 11.3497 10.8308 10.9202C11.2602 10.4908 11.6038 9.97546 11.8247 9.42332C12.0578 8.8589 12.1805 8.25767 12.1805 7.65644V5.7546C12.1805 4.23313 11.5915 2.76074 10.524 1.68098C9.99643 1.14111 9.37066 0.723926 8.68355 0.429448C7.98416 0.147239 7.24796 0 6.4995 0Z"
          fill="#7088CC"
        />
        <path
          d="M6.41416 16.0244H6.58594C6.72091 16.0244 6.84361 15.9998 6.95404 15.9507C7.07674 15.9017 7.18717 15.828 7.27306 15.7421C7.35895 15.6563 7.43256 15.5458 7.48164 15.4231C7.53072 15.3004 7.55526 15.1777 7.55526 15.0428V12.282H12.1565V14.1593C12.1565 14.9078 12.0215 15.6563 11.7393 16.3556C11.4571 17.055 11.0399 17.6808 10.5123 18.2207C9.99698 18.7605 9.35895 19.1777 8.67183 19.4722C7.98471 19.7667 7.23625 19.9139 6.48778 19.9139C5.73931 19.9139 4.99085 19.7667 4.30373 19.4722C3.61661 19.1777 2.99085 18.7605 2.46324 18.2207C1.93563 17.6931 1.51846 17.055 1.23625 16.3556C0.954038 15.6563 0.806799 14.9078 0.819069 14.1593V12.282C0.819069 11.6808 0.941768 11.0796 1.1749 10.5151C1.39576 9.963 1.73931 9.44766 2.16876 9.01821C2.59821 8.58877 3.10128 8.24521 3.66569 8.01208C4.23011 7.77895 4.83134 7.65625 5.43257 7.65625V15.0428C5.43257 15.1777 5.45711 15.3004 5.50619 15.4231C5.55527 15.5458 5.62888 15.6563 5.71477 15.7421C5.81293 15.828 5.91109 15.9017 6.03379 15.9507C6.15649 15.9998 6.29146 16.0244 6.41416 16.0244Z"
          fill="#7088CC"
        />
      </svg>

      <a
        class="layer-zero-link"
        :href="layerZeroLink"
        target="_blank"
        rel="noopener noreferrer"
        >LayerZero</a
      >
    </p>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent, type PropType } from "vue";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";

export default {
  props: {
    poolInfo: {
      type: Object as PropType<any>,
      required: true,
    },
    successData: {
      type: Object as PropType<any>,
      required: true,
    },
    availableAmount: {
      default: 0n,
    },
  },

  computed: {
    parseAvailableAmount() {
      return formatUnits(this.availableAmount, this.poolInfo.decimals || 18);
    },

    availableAmountUsd() {
      if (!this.poolInfo) return 0;
      return formatUSD(Number(this.parseAvailableAmount) * this.poolInfo.price);
    },

    formattedTokenExpecteds() {
      if (!this.successData?.amounts)
        return {
          base: "0.0",
          quote: "0.0",
        };

      return {
        base: formatTokenBalance(
          formatUnits(
            this.successData.amounts.MIMAmount,
            this.poolInfo.tokens.baseToken.config.decimals
          )
        ),
        quote: formatTokenBalance(
          formatUnits(
            this.successData.amounts.USDBAmount,
            this.poolInfo.tokens.quoteToken.config.decimals
          )
        ),
      };
    },

    layerZeroLink() {
      if (!this.successData?.lzTxInfo) return false;
      return `https://layerzeroscan.com/tx/${this.successData.lzTxInfo.srcTxHash}`;
    },
  },

  methods: {
    formatTokenBalance,

    async actionHandler() {
      this.$router.push({
        name: "Farm",
        params: { id: 4, farmChainId: ARBITRUM_CHAIN_ID },
      });

      this.$emit("closePopups");
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}

.mlp-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mlp-icon-wrap {
  gap: 8px;
  display: flex;
  align-items: center;
  font-weight: 400;
  line-height: normal;
}

.mlp-icon {
  width: 28px;
  height: 28px;
}

.mlp-title {
  gap: 8px;
  display: flex;
  align-items: center;
}

.mlp-amounts {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.mlp-balance {
  font-weight: 500;
  line-height: normal;
}

.mlp-balance-usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.migrate-wrap {
  gap: 24px;
  display: flex;
  align-items: center;
  position: relative;
}

.chain-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  padding: 12px;
  border-radius: 50%;
  border: 1px solid #745cd2;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.2) 0%,
    rgba(116, 92, 210, 0.2) 100%
  );
  box-shadow: 0px 4px 29.4px 0px rgba(85, 82, 253, 0.24);
  margin-bottom: 4px;
}

.chain-icon {
  width: 70px;
  height: 70px;
}

.to-address {
  text-align: center;
  font-weight: 500;
  line-height: normal;
}

.amounts-info {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.token-info {
  gap: 4px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 24px;
  height: 24px;
}

.token-amount {
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}

.btn-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.layer-zero-wrap {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}

.layer-zero-link {
  color: #7088cc;
  text-decoration-line: underline;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 18px;
  }

  .mlp-info {
    flex-direction: column;
  }

  .mlp-amounts {
    width: 100%;
    justify-content: flex-end;
  }

  .mlp-icon-wrap {
    justify-content: flex-start;
    font-size: 15px;
  }

  .subtitle {
    font-size: 14px;
  }

  .migrate-wrap {
    gap: 24px;
  }

  .chain-wrap {
    width: 70px;
    height: 70px;
  }

  .chain-icon {
    width: 50px;
    height: 50px;
  }

  .to-address {
    font-size: 14px;
  }

  .token-info {
    gap: 8px;
  }

  .token-amount {
    font-size: 20px;
  }
}
</style>
