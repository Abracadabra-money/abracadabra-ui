<template>
  <div
    :class="['backdrop', { isOpened: isMyPositionPopupOpened }]"
    @click.self="closePopup"
  ></div>
  <div :class="['pool-position-wrap', { isOpened: isMyPositionPopupOpened }]">
    <img
      class="close"
      src="@/assets/images/close-icon.png"
      alt="Close popup"
      @click="closePopup"
    />

    <div class="pool-position">
      <p class="position-title">Your Magic LP</p>

      <Deposited
        :pool="pool"
        :isUserPositionOpen="isUserPositionOpen"
        @updatePoolInfo="$emit('updateInfo')"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    pool: { type: Object },
    isUserPositionOpen: { type: Boolean, default: false },
    isMyPositionPopupOpened: { type: Boolean, default: false },
  },

  emits: ["closePopup", "updateInfo"],

  data() {
    return {
      activeTab: "deposited",
    };
  },

  computed: {},

  methods: {
    selectTab(action) {
      this.activeTab = action;
    },

    closePopup() {
      this.$emit("closePopup");
    },
  },

  components: {
    Deposited: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/Deposited.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.position-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
}

.pool-position-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 3;
}

.pool-position {
  display: flex;
  flex-direction: column;
  width: 354px;
  padding: 16px;
  gap: 16px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.24) 0%,
      rgba(116, 92, 210, 0.24) 100%
    ),
    #0e172b;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.points-earned {
  display: none !important;
}

.blast-icon {
  width: 28px;
  height: 28px;
  margin-right: 10px;
  border-radius: 50px;
}

.close {
  align-self: flex-end;
  display: none;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
}

.close:hover {
  opacity: 0.5;
}

@media (max-width: 1400px) {
  .backdrop {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: end;
    background: rgba(25, 25, 25, 0.1);
    backdrop-filter: blur(10px);
    z-index: 2;
  }

  .pool-position-wrap {
    position: fixed;
    top: initial;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    width: 100%;
    padding: 20px 16px 60px 16px;
    border-radius: 20px 20px 0px 0px;
    border: 1px solid #00296b;
    background: linear-gradient(
        90deg,
        rgba(45, 74, 150, 0.24) 0%,
        rgba(116, 92, 210, 0.24) 100%
      ),
      #0e172b;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
    backdrop-filter: blur(20px);
  }

  .pool-position {
    width: 100%;
    max-width: 385px;
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  .close {
    align-self: flex-end;
    display: block;
  }

  .points-earned {
    display: flex !important;
  }

  .points-earned-row {
    display: none;
  }

  .isOpened {
    display: flex !important;
  }
}

@media screen and (max-width: 500px) {
  .pool-position {
    min-width: 100%;
  }
}
</style>
