<template>
  <div class="slide">
    <div :class="['status', data.state]">{{ data.state }}</div>
    <div class="slide-head">
      <div>
        <h3 class="title">{{ title }}</h3>
        <h4 class="subtitle">
          <ClockIcon />
          {{ formatTimestamp(data.start) }} - {{ formatTimestamp(data.end) }}
        </h4>
      </div>

      <a
        class="snapshot-link"
        :href="snapshotLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        Snapshot
        <ArrowTopRight :width="12" :height="12" fill="#7088CC" />
      </a>
    </div>

    <div class="slide-body">
      <div class="description" v-html="mainText"></div>
      <div class="survey-wrap">
        <div class="survey" v-for="survey in surveyData" :key="survey.title">
          <div class="survey-head">
            <h3 class="survey-title">{{ survey.title }}</h3>
            <span class="survey-total" v-if="survey.total">{{
              survey.total
            }}</span>
            <span class="survey-percent" v-else>{{ survey.percent }}%</span>
          </div>
          <div class="track">
            <div :style="`width: ${survey.percent}%`" class="indicator"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import "vue3-carousel/dist/carousel.css";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { parseMarkdownToHTML } from "@/helpers/snapshot/utils";
import { formatLargeSum } from "@/helpers/filters";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  computed: {
    title() {
      return this.data.title.length > 60
        ? `${this.data.title.slice(0, 60)}...`
        : this.data.title;
    },

    mainText() {
      return parseMarkdownToHTML(this.data.body);
    },

    snapshotLink() {
      return `https://snapshot.org/#/${this.data.space.id}/proposal/${this.data.id}`;
    },

    surveyData() {
      const surveyData: any = [];
      const scores = this.data.scores.reduce((a: any, b: any) => a + b, 0);

      this.data.choices.forEach((choice: any, index: any) => {
        surveyData.push({
          title: choice,
          percent: Math.round((this.data.scores[index] / scores) * 100),
        });
      });

      const quorumPercent = Math.round((scores / this.data.quorum) * 100);

      surveyData.push({
        title: "Quorum",
        percent: quorumPercent > 100 ? 100 : quorumPercent,
        total: `${formatLargeSum(scores)} / ${formatLargeSum(
          this.data.quorum
        )}`,
      });

      return surveyData;
    },
  },

  methods: {
    parseMarkdownToHTML,

    formatTimestamp(timestamp: number) {
      return moment.unix(timestamp).format("lll");
    },
  },

  components: {
    ClockIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/ClockIcon.vue")
    ),
    ArrowTopRight: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowTopRightIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;
.slide {
  width: 100%;
  position: relative;
  padding: 18px 16px 16px;
  border-radius: 16px;
  border: 1px solid #00296b;
  gap: 16px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.24) 0%,
      rgba(116, 92, 210, 0.24) 100%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  backdrop-filter: blur(12.5px);
}

.status {
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 117px;
  border-radius: 8px 0px 8px 0px;
  background: var(--Green, #67a069);
  text-align: center;
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;

  &::first-letter {
    text-transform: uppercase;
  }
}

.closed {
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

.slide-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.title {
  text-align: start;
  font-size: 16px;
  font-weight: 500;
}

.subtitle {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
}

.snapshot-link {
  padding: 5px 8px;
  color: #7088cc;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: #1a1f3d;
}

.slide-body {
  gap: 12px;
  display: flex;
  justify-content: space-between;
  text-align: start;
  height: 195px;
  overflow: hidden;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
  width: 110%;
}

.description :deep(a) {
  color: rgba(255, 255, 255, 0.6);
  text-decoration-line: underline;
}

.survey-wrap {
  width: 100%;
  gap: 12px;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  overflow-y: scroll;
}

.survey-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.survey-title,
.survey-percent {
  font-size: 14px;
  font-weight: 500;
}

.track {
  width: 100%;
  height: 10px;
  border-radius: 12px;
  background: rgba(112, 136, 204, 0.2);
}

.indicator {
  height: 10px;
  border-radius: 12px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

@media screen and (max-width: 768px) {
  .slide-body {
    flex-direction: column;
    height: 280px;
    overflow: hidden;
  }

  .description {
    max-width: 100%;
    height: 120px;
    overflow: hidden;
  }
}

@media screen and (max-width: 600px) {
  .slide-head {
    flex-direction: column;
    gap: 12px;
  }

  .title-wrap {
    flex-direction: column-reverse;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 10px;
  }
}
</style>
