<template>
  <div :class="['cauldrons-table-item', type]">
    <div class="label">{{ type }}</div>
    <div class="column">
      <div class="cauldron-info">
        <div class="icons-wrap">
          <img
            class="cauldron-icon"
            src="@/assets/images/tokens/yv-3crypto.png"
            alt=""
          />
          <img
            class="chain-icon"
            src="@/assets/images/networks/ETH.svg"
            alt=""
          />
        </div>
        yv-3Crypto
      </div>
    </div>

    <div class="column">$612.12k</div>

    <div class="column">292.9k</div>

    <div class="column">4.71M</div>

    <div class="column">7%</div>

    <div class="column">
      <span class="apr">700.28% - 1000.82%</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.cauldrons-table-item {
  border-radius: 16px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(8, 14, 31, 0.6);
  padding: 20px 32px;
  display: grid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.label {
  display: none;
  position: absolute;
  text-align: center;
  top: 50%;
  left: -43px;
  width: 100px;
  font-size: 9px;
  font-weight: 500;
  line-height: 16px;
  transform: translateY(-50%) rotate(-90deg);
  background: linear-gradient(180deg, #67a069 0%, #446a46 100%);

  &::first-letter {
    text-transform: uppercase;
  }
}

.new {
  border: 1px solid #649c66;

  .apr {
    padding: 5px 10px;
    border-radius: 10px;
    border: 1px solid #2d4a96;
  }

  .label {
    display: block;
    background: linear-gradient(180deg, #67a069 0%, #446a46 100%);
  }
}

.deprecated {
  border: 1px solid #48161e;

  .label {
    display: block;
    background: linear-gradient(180deg, #320a0a 0%, #871d1f 100%),
      linear-gradient(180deg, #67a069 0%, #446a46 100%);
  }
}

.open {
  background: url("@/assets/images/cauldrons/table-item-background.png");

  .apr {
    border-radius: 10px;
    padding: 5px 10px;
    background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
    -webkit-text-fill-color: #fff;
  }
}

.column {
  max-width: 180px;
  width: 100%;
}

.cauldron-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.icons-wrap {
  position: relative;
  width: 44px;
}

.cauldron-icon {
  width: 44px;
  height: 44px;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -10px;
}

.apr {
  text-shadow: 0px 0px 16px #ab5de8;
  background: linear-gradient(90deg, #7a91cc 0%, #8b71d2 50.52%, #411fc8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
