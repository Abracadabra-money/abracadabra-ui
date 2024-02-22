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
      <span class="date start">22 Feb</span>
      <span class="date end">28 Feb</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      epochDays: [
        { name: "Thursday", status: "past" },
        { name: "Friday", status: "past" },
        { name: "Saturday", status: "past" },
        { name: "Sunday", status: "present" },
        { name: "Monday", status: "future" },
        { name: "Tuesday", status: "future" },
        { name: "Wednesday", status: "future" },
      ],
    };
  },

  computed: {},

  methods: {
    formatDayName(name) {
      return name.slice(0, 3);
    },
  },

  components: {},
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
  list-style: none;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 66px;
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
</style>
