<template>
  <div class="slide">
    <div class="slide-head">
      <div class="title-wrap">
        <div>
          <h3 class="slide-title">{{ data.title }}</h3>
          <h4 class="slide-subtitle">
            <ClockIcon />
            {{ formatTimestamp(data.start) }} - {{ formatTimestamp(data.end) }}
          </h4>
        </div>

        <div :class="['status', data.state]">{{ data.state }}</div>
      </div>

      <a
        class="snapshot-link"
        :href="snapshotLink"
        target="_blank"
        rel="noopener noreferrer"
        >Snapshot <ArrowTopRight :width="12" :height="12" fill="#7088CC"
      /></a>
    </div>
    <div class="slide-body">
      <div class="description" v-html="parseMarkdownToHTML(data.body)"></div>
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
  padding: 16px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #00296b;
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
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  min-height: 400px;
}

.slide-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.title-wrap {
  gap: 12px;
  display: flex;
  align-items: flex-start;
}

.slide-title {
  text-align: start;
  font-size: 16px;
  font-weight: 500;
  max-width: 260px;
}

.slide-subtitle {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
}

.status {
  padding: 2px 12px;
  border-radius: 12px;
  background: #67a069;

  &::first-letter {
    text-transform: uppercase;
  }
}

.closed {
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
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
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
  width: 110%;
  max-height: 300px;
  overflow-y: scroll;
}

.description ::v-deep a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration-line: underline;
  cursor: pointer;
}

.survey-wrap {
  width: 100%;
  gap: 16px;
  display: flex;
  flex-direction: column;
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
  }

  .description {
    max-width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .slide {
    min-height: 635px;
  }
  .slide-head {
    flex-direction: column;
  }

  .title-wrap {
    flex-direction: column-reverse;
    margin-bottom: 12px;
  }

  .slide-subtitle {
    font-size: 10px;
  }
}
</style>
