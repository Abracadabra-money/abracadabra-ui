<template>
  <div class="dynamic-elixir-potions-wrap">
    <div class="dynamic-elixir-potions">
      <div class="row">
        <div class="title">
          Elixir Potions Multiplier
          <TooltipIcon
            :width="20"
            :height="20"
            fill="#FFF"
            tooltip="Leverage your position to gain bigger multiplier on Elixir Potions"
          />
        </div>
        <div class="value">{{ estimationResult }}X</div>
      </div>
      <div class="weekly">
        1 sdeUSD earns
        <span class="weekly-value">{{ formatToFixed(elixirRate, 3) }}</span>
        Potions weekly
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineAsyncComponent } from "vue";
import { formatToFixed } from "@/helpers/filters";
import { ELIXIR_POTIONS_URL } from "@/constants/global";
import { LS_ELIXIR_RARE_KEY } from "@/helpers/dataStore";

const ELIXIR_POTIONS_BASE_MULTIPLIER = 5;

export default {
  props: {
    multiplier: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      elixirRate: 0,
    };
  },

  computed: {
    estimationResult() {
      return formatToFixed(ELIXIR_POTIONS_BASE_MULTIPLIER * this.multiplier, 2);
    },
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },

  methods: {
    formatToFixed,

    async getElixirRate() {
      try {
        this.checkLocalElixirRate();

        const { data } = await axios.get(`${ELIXIR_POTIONS_URL}`);

        this.elixirRate =
          data.weeks.filter(({ preliminary }: any) => !preliminary).at(-1)
            .rate || 0;

        localStorage.setItem(LS_ELIXIR_RARE_KEY, this.elixirRate.toString());

        return;
      } catch (error) {
        this.elixirRate = 0;
        return;
      }
    },

    checkLocalElixirRate() {
      const lsElixirRate = localStorage.getItem(LS_ELIXIR_RARE_KEY);

      if (lsElixirRate) {
        this.elixirRate = Number(lsElixirRate);
      }
    },
  },

  async created() {
    await this.getElixirRate();
  },
};
</script>

<style lang="scss" scoped>
.dynamic-elixir-potions-wrap {
  display: flex;
  padding: 1px;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  background: linear-gradient(90deg, #2d4a96 0%, rgba(116, 92, 210, 0) 100%);
}

.dynamic-elixir-potions {
  gap: 8px;
  display: flex;
  flex-direction: column;
  padding: 5px 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.385);
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  gap: 4px;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.value {
  text-transform: uppercase;
}

.weekly {
  color: #99a0b2;
  font-size: 14px;
  line-height: 21px;
}

.weekly-value {
  color: #fff;
  font-weight: 500;
}
</style>
