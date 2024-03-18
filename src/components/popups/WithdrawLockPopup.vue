<template>
  <div class="popup-body">
    <div class="popup-page" v-if="step === 1">
      <h3>Page 1</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad, sequi
        perferendis. Quibusdam nemo ad debitis in expedita nihil nobis vitae nam
        at, amet commodi, dolore provident. Est quis eaque id! Rerum facere
        sequi obcaecati fugit? Commodi repudiandae delectus natus mollitia
        earum? Consequatur tempora similique accusamus unde. Quia quidem laborum
        necessitatibus voluptatum vero? Ab autem vel exercitationem laudantium,
        totam minus accusamus! Quod quis incidunt
      </p>
    </div>

    <div class="popup-page" v-else>
      <h3>Page 2</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad, sequi
        perferendis. Quibusdam nemo ad debitis in expedita nihil nobis vitae nam
        at, amet commodi, dolore provident. Est quis eaque id! Rerum facere
        sequi obcaecati fugit? Commodi repudiandae delectus natus mollitia
        earum? Consequatur tempora similique accusamus unde. Quia quidem laborum
        necessitatibus voluptatum vero? Ab autem vel exercitationem laudantium,
        totam minus accusamus! Quod quis incidunt
      </p>
    </div>

    <BaseButton primary @click="actionHandler">Next</BaseButton>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      step: 1,
    };
  },

  methods: {
    actionHandler() {
      if (this.step === 2) this.$emit("withdrawLocked");
      else this.step += 1;
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup-body {
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.popup-page {
  gap: 16px;
  display: flex;
  flex-direction: column;
}
</style>
