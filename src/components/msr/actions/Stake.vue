<template>
  <div class="action">
    <Tabs name="stake" :items="['stake', 'unstake']" />
    <h2 class="action-title">Stake MIM</h2>
    <BaseTokenInput />
    <BaseButton primary>Stake</BaseButton>
  </div>
</template>

<script>
import Tabs from "@/components/ui/Tabs.vue";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  data() {
    return {};
  },

  computed: {},

  methods: {},

  components: { Tabs, BaseTokenInput, BaseButton },
};
</script>

<style scoped>
.action {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
