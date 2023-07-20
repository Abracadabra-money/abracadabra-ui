<template>
  <button class="select-button">
    <div class="token-info">
      <BaseTokenIcon
        :icon="activeToken.icon"
        :name="activeToken.name"
        type="select"
      />
      <span> {{ activeToken.name || "Select to" }}</span>
    </div>
    <img src="@/assets/images/arrow.svg" alt="arrow" />
  </button>
</template>
<script>
import { defineAsyncComponent } from "vue";
export default {
  props: {
    activeToken: { type: Object },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.select-button {
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 20px;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 10px;
}

.token-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
</style>
