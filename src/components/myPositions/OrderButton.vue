<template>
  <router-link class="order-button" :to="goToPage(cauldronObject)">
    <Tooltip tooltip="order" fill="#7088CC" />
    <span class="link-text"> Order </span>
    <img class="arrow" src="@/assets/images/beam/arrow-link.png" />
  </router-link>
</template>

<script lang="ts">
import Tooltip from "@/components/ui/icons/Tooltip.vue";

export default {
  props: {
    cauldronObject: {
      type: Object as any,
    },
    recoverLeverage: {
      type: Function || null,
    },
    deleverageFromOrder: {
      type: Function || null,
    },
  },

  methods: {
    goToPage(cauldron: any) {
      const { chainId, id } = cauldron.config;
      return {
        name: "Market",
        params: { chainId, cauldronId: id },
      };
    },
  },

  components: {
    Tooltip,
  },
};
</script>

<style>
.order-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 39px;
  padding: 7px 14px;
  gap: 4px;
  border-radius: 10px;
  color: #7088cc;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  transition: all 0.7s ease;
}

.order-button:hover {
  background: #191f2f;
  box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.13);
  color: #86a2f1;
}
</style>
