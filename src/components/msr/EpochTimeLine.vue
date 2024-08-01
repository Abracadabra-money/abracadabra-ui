<template>
  <div class="epoch-timeline-wrap">
    <ul class="week">
      <li class="day" :key="day.name" v-for="day in epochDays">
        <span :class="['name', day.status == 'present' ? day.status : '']">{{
          formatDayName(day.name)
        }}</span>
        <div :class="['indicator', day.status]"></div>
      </li>
    </ul>

    <div class="start-end-dates">
      <span class="date start">{{
        formatTimestampToUnix(epoch.start, "DD MMM")
      }}</span>
      <span class="date end">{{
        formatTimestampToUnix(epoch.end, "DD MMM")
      }}</span>
    </div>
  </div>

  <p class="description">
    Rewards are distributed with every epoch, followed by a one-week vesting
    period before they can be claimed. The next epoch will commence in
    <Timer :endDateTimestamp="mimSavingRateInfo?.nextEpoch || 0" small />
  </p>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import { createEpochTimeline, formatTimestampToUnix } from "@/helpers/time";
import type { MimSavingRateInfo } from "@/helpers/mimSavingRate/getMimSavingRateInfo";

type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export default {
  props: {
    mimSavingRateInfo: {
      type: Object as PropType<MimSavingRateInfo | null>,
      required: true,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  data() {
    return {
      daysNames: [
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
      ] as DayName[],
    };
  },

  computed: {
    epoch() {
      if (!this.mimSavingRateInfo)
        return {
          start: 0,
          end: 0,
        };
      return {
        start: this.mimSavingRateInfo?.startOfEpoch,
        end: this.mimSavingRateInfo?.nextEpoch - 1,
      };
    },

    epochDays() {
      const epochTimeline = createEpochTimeline(this.epoch.start);

      return this.daysNames.map((name: DayName, index: number) => {
        return { name, status: epochTimeline[index] };
      });
    },
  },

  methods: {
    formatTimestampToUnix,

    formatDayName(name: DayName) {
      return name.slice(0, 3);
    },
  },

  components: {
    Timer: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.epoch-timeline-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 7px;
}

.week {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  list-style: none;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  gap: 7px;
}

.name,
.date {
  font-size: 14px;
  font-weight: 400;
  color: #878b93;
}

.name.present {
  color: #7088cc;
  background: none !important;
}

.indicator {
  min-width: 36px;
  width: 100%;
  height: 12px;
  border-radius: 12px;
}

.past {
  background-color: #7088cc;
}

.present {
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

.future {
  background-color: rgba(112, 136, 204, 0.2);
}

.start-end-dates {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.description {
  font-size: 14px;
  font-weight: 400;
  line-height: 26px;
}

.timer {
  display: inline-flex !important;
  gap: 2px !important;
  width: auto !important;
}

.timer::v-deep(.time-block) {
  height: 30px !important;
}
</style>
