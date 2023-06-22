<template>
  <div class="info-list-wrap">
    <div class="info-list">
      <div v-for="(item, i) in additionalInfo" :key="i" class="info-list-item">
        <img
          class="info-list-icon"
          src="@/assets/images/info.svg"
          v-tooltip="item.additional"
          alt="info"
        />

        <span class="info-list-name">{{ item.title }}:</span>
        <span class="info-list-value">{{ item.value }}</span>
      </div>
    </div>
    <div class="info-list-bottom">
      <div class="info-bottom">
        <div class="info-list-subitem">
          <span class="info-list-name">1 MIM</span>
          <span class="info-list-value">1 USD</span>
        </div>
        <div class="info-list-subitem">
          <span class="info-list-name">1 {{ pool.name }}</span>
          <span class="info-list-value">{{ tokenToMim }} MIM</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pool: {
      type: Object,
    },
  },
  computed: {
    additionalInfo() {
      return [
        {
          title: "Collateral Deposited",
          value: 0,
          additional: "Amount of Tokens Deposited as Collaterals",
        },
        {
          title: "Collateral Value",
          value: 0,
          additional: "USD Value of the Collateral Deposited in your Position",
        },
        {
          title: "MIM Borrowed",
          value: 0,
          additional: "MIM Currently Borrowed in your Position",
        },
        {
          title: "TVL",
          value: 0,
          additional: "Total Value Locked",
        },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
.info-list-wrap {
  padding: 20px 15px;
}

.info-list-bottom {
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  padding: 0 17px 10px 17px;
  margin-top: 10px;
}

.info-bottom {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 52px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-list-subitem {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
}

.info-list-value {
  font-weight: 700;
  color: white;
}

.info-list {
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 30px;
  padding: 0 17px 10px 17px;
  overflow-y: auto;
  height: 210px;
}

.info-list-item {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-list-name {
  flex: 1 1 auto;
  text-align: left;
}

.info-list-icon {
  padding-right: 12px;
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
</style>
