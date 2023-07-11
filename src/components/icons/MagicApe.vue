<template>
  <img
    class="ape-icon"
    src="@/assets/images/ape/ape.png"
    v-if="cauldronId === 39"
    alt="Ape icon"
  />
</template>

<script>
export default {
  props: {
    cauldronId: {
      type: Number,
      required: true,
    },
  },
};
</script>
