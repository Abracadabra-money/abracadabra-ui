<template>
  <div :class="['flow-block', { final }]">
    <div class="indicator-wrap">
      <div :class="['indicator-icon', status]">
        <svg
          class="loader"
          v-if="status == 'pending'"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
        >
          <path
            d="M10.0001 18.8337C14.2373 18.8337 17.8572 15.4766 18.2901 11.3323C18.3379 10.8745 17.9603 10.5003 17.5001 10.5003C17.0398 10.5003 16.6723 10.8753 16.6126 11.3317C16.1889 14.5705 13.3333 17.167 10.0001 17.167C6.38591 17.167 3.33341 14.1145 3.33341 10.5003C3.33341 7.16783 5.92986 4.31167 9.16873 3.88782C9.62507 3.8281 10.0001 3.46056 10.0001 3.00033C10.0001 2.54009 9.62588 2.1625 9.16813 2.21032C5.0238 2.64326 1.66675 6.26387 1.66675 10.5003C1.66675 15.0178 5.48258 18.8337 10.0001 18.8337Z"
            fill="#7088CC"
          />
        </svg>

        <CheckMarkIcon
          :width="20"
          :height="20"
          fill="#67A069"
          v-else-if="status == 'success'"
        />

        <span class="step-number" v-else>
          {{ stepNumber }}
        </span>
      </div>

      <div :class="['indicator-line', status]" v-if="!final"></div>
    </div>

    <div class="text-wrap">
      <h4 class="title">
        <slot></slot>
      </h4>
      <p :class="['status-text', status]">{{ renderStatus }}</p>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    stepNumber: { type: Number },
    status: { type: String, default: "waiting" },
    isApprove: { type: Boolean, default: false },
    final: { type: Boolean, default: false },
  },

  computed: {
    renderStatus() {
      if (this.isApprove && this.status == "success") return "approved";
      return this.status;
    },
  },

  components: {
    CheckMarkIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/CheckMarkIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.flow-block {
  display: flex;
  flex-direction: column;
  align-items: start;
  flex-grow: 1;
}

.flow-block.final {
  flex-grow: 0;
}

.indicator-wrap {
  display: flex;
  align-items: center;
  width: 100%;
}

.indicator-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  min-height: 32px;
  border: 1px solid #7088cc;
  border-radius: 50px;
}

.indicator-icon.success {
  border-color: #67a069;
}

.indicator-line {
  margin: 0 3px;
  border-top: 1px dashed #7088cc;
  flex-grow: 1;
}

.indicator-line.success {
  border-top: 1px solid #67a069;
}

.loader {
  animation: rotating 2s ease-in-out infinite;
}

.step-number {
  color: #7088cc;
  font-size: 16px;
  font-weight: 600;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.status-text {
  font-size: 14px;
  font-weight: 400;
  text-transform: capitalize;
}

.waiting {
  color: #878b93;
}

.pending {
  color: #fed84f;
}

.success {
  color: #67a069;
}

.failed {
  color: #8c4040;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .indicator-wrap {
    flex-direction: column;
    height: 100%;
  }

  .indicator-line {
    margin: 3px 0;
    border-right: 1px dashed #7088cc;
    flex-grow: 1;
    height: 100%;
  }

  .flow-block {
    flex-direction: row;
    gap: 16px;
  }
}
</style>
