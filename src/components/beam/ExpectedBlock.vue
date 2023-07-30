<template>
  <div>
    <div class="row">
      <p class="title">Expected MIM:</p>
      <p class="value">{{ data.mimAmount || "0.0" }} MIM</p>
    </div>

    <div class="row">
      <p class="title pointer" @click="$emit('open-settings')">
        Gas on destination:
      </p>
      <p class="value pointer" @click="$emit('open-settings')">
        {{ data.dstTokenAmount || "0.0" }}
        {{ data.dstTokenSymbol }}
      </p>
    </div>

    <div class="row">
      <p class="title">Beaming Fee:</p>
      <p class="value">$ 1.00</p>
    </div>

    <div class="row">
      <p class="title">Estimated gas cost:</p>
      <p class="value">{{ data.gasCost }} {{ data.srcTokenSymbol }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  color: rgba(255, 255, 255, 0.6);
}

.pointer {
  cursor: pointer;
}

@media (max-width: 600px) {
  .row {
    display: flex;
    flex-direction: column;
    align-items: initial;
    justify-content: initial;
  }

  .value {
    text-align: right;
  }
}
</style>
