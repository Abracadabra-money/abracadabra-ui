<template>
  <div class="action">
    <h2 class="action-title">Lock MIM</h2>
    <BaseTokenInput />
    <BaseButton primary>Lock</BaseButton>
  </div>
</template>

<script>
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  data() {
    return {};
  },

  computed: {},

  methods: {},

  components: { BaseTokenInput, BaseButton },
};
</script>

<style scoped>
.action {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
