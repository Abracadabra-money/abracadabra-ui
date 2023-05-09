<template>
  <div class="box-wrap" :class="risk">
    <img class="info-icon" src="@/assets/images/tooltip.png" alt="Tooltip" />
    <span class="risk" :class="risk"> {{ risk }}</span>
    <div class="box-container">
      <p class="box-title">Liq. Price</p>
      <p class="box-value">{{ price }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    risk: { type: String },
    price: { type: String },
  },
};
</script>

<style scoped>
.box-wrap {
  position: relative;
  width: 100%;
  height: 62px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(5px);
  border-radius: 20px;
}
.info-icon {
  position: absolute;
  top: 12.5px;
  left: 10px;
}
.box-container {
  padding: 10px 34px;
}
.box-title,
.box-value {
  font-family: "Prompt";
  font-style: normal;
  font-size: 14px;
  line-height: 21px;
}
.box-title {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
}
.box-value {
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
}

.risk {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 9px;
  border-radius: 32px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  text-transform: capitalize;
}
.safe {
  background: rgba(99, 202, 248, 0.06);
  border: 1px solid rgba(99, 202, 248, 0.6);
}
.medium {
  background: rgba(255, 184, 0, 0.06);
  border: 1px solid rgba(255, 184, 0, 0.6);
}
.high {
  background: rgba(254, 24, 66, 0.06);
  border: 1px solid rgba(254, 24, 66, 0.6);
}

.risk.safe {
  background: #63caf8 !important;
}
.risk.medium {
  background: #ffb800 !important;
}
.risk.high {
  background: #fe1842 !important;
}
</style>
