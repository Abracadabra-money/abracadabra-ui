<template>
  <div class="input-url-wrap">
    <div class="input-wrap">
      <img class="icon" :src="icon" v-if="icon" alt="" />
      <input
        class="input-url"
        :class="{ error: error, 'icon-gap': icon }"
        v-model="url"
        @input="updateInput"
        type="text"
        :placeholder="placeholder"
        :disabled="isDisabled"
      />
    </div>
    <p class="error-message" :class="{ visibility: error }">
      {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    targetUrl: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Tenderly fork URL",
    },
  },

  data() {
    return {
      url: this.targetUrl,
    };
  },

  watch: {
    targetUrl() {
      this.url = this.targetUrl;
    },
  },

  methods: {
    updateInput() {
      return this.$emit("update-input", this.url);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-url-wrap {
  width: 100%;
}

.input-wrap {
  position: relative;
}

.icon {
  max-width: 30px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 12px;
}

.input-url {
  width: 100%;
  height: 50px;
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 12px;
  outline: none;
  padding: 12px 20px;
  color: #fff;
  font-size: 14px;
}

.icon-gap {
  padding: 12px 20px 12px 50px;
}

.error {
  border-color: $clrErrorBorder;
}

.error-message {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
  height: 12px;
  opacity: 0;
}

.visibility {
  opacity: 1;
}
</style>
