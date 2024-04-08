<template>
  <ul class="tokens-list">
    <li
      class="list-item"
      v-for="(token, index) in tokensList"
      :key="index"
      @click="chooseActiveToken(index)"
    >
      <span class="check-wrap">
        <img
          src="@/assets/images/check-mark.svg"
          v-if="token.config.name == activeToken.config.name"
        />
      </span>

      <span class="token-info">
        <BaseTokenIcon
          :icon="token.config.icon"
          :name="token.config.name"
          size="20px"
        />

        {{ token.config.name }}
      </span>
    </li>
  </ul>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    tokensList: { type: Array },
    activeToken: { type: Object },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    close() {
      this.$emit("closeDropdown");
    },

    chooseActiveToken(tokenIndex) {
      const isBase = tokenIndex == 0;
      this.$emit("chooseActiveToken", isBase);
      this.close();
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.tokens-list {
  position: absolute;
  top: 44px;
  right: 6px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(0deg, #131b2d 0%, #131b2d 100%), #151826;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  z-index: 1;
  list-style: none;
}

.list-item,
.token-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.list-item:hover {
  opacity: 0.5;
}

.check-wrap {
  min-width: 10px;
}

.token-info {
  gap: 4px;
  color: #878b93;
  font-size: 16px;
  font-weight: 400;
}

.token-icon {
  margin-right: 0;
}
</style>
