<template>
  <div class="road-map">
    <h3 class="title">MIMSwap Roadmap</h3>

    <div class="phases-wrap">
      <div class="stages">
        <div class="stages-item">1</div>
        <div class="stages-item">2</div>
        <div class="stages-item stages-item-disabled">3</div>
      </div>
      <div class="phases-list">
        <div
          :class="['phases-item', { active: activePhase === 1 }]"
          @click="changePhase(1)"
        >
          Liquidity Launch Event
        </div>
        <div
          :class="['phases-item', 'next', { active: activePhase === 2 }]"
          @click="changePhase(2)"
        >
          Initiation Phase
        </div>
        <div
          :class="['phases-item', 'prev', { active: activePhase === 3 }]"
          @click="changePhase(3)"
        >
          MIM Swap Launch
        </div>
      </div>
    </div>

    <div class="description" v-if="activePhase === 1">
      The MIMSwap Liquidity Launch Event stands as the cornerstone of our
      journey on Blast, marking the grand unveiling of MIMSwap. This unique
      opportunity allows users to deposit MIM or USDB, with the option to lock
      these assets for enhanced point earnings.
    </div>
    <div class="description" v-if="activePhase === 2">
      Phase 2 has been initialized. During this phase point distributions become
      more frequent as well as Gold and Potion points are being prepared to roll
      out. It is the last chance to deposit and become eligible to obtain the
      Founder’s Boost, Abracadabra’s largest reward incentive program to date.
      Read more about it here.
    </div>
    <div class="description" v-if="activePhase === 3">
      The final step of the LLE initiative. <br />
      MIMswap contracts deployed, migration starts and LPs seeding and launch.
      Founder’s Boost achieved and live.
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      activePhase: 2,
    };
  },

  methods: {
    changePhase(phase: number) {
      this.activePhase = phase;
    },
  },
};
</script>

<style lang="scss" scoped>
.road-map {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
}

.phases-list {
  display: flex;
  justify-content: space-between;
}

.phases-item {
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s ease;
  background-image: url("@/assets/images/blast/default.png");
  background-size: cover;

  &:hover {
    background-image: url("@/assets/images/blast/default-hover.png");
    color: #fff;
  }
}

.next {
  background-image: url("@/assets/images/blast/next.png");
  background-size: cover;
}

.prev {
  background-image: url("@/assets/images/blast/prev.png");
  background-size: cover;

  &:hover {
    background-image: url("@/assets/images/blast/prev-hover.png");
    color: #fff;
  }
}

.active {
  background-image: url("@/assets/images/blast/active.png");
  background-size: cover;
  color: #000;

  &:hover {
    background-image: url("@/assets/images/blast/active.png");
    color: #000;
  }
}

.stages {
  margin: 0 auto;
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stages-item {
  border-radius: 50%;
  border: 1px solid #fcfc03;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stages-item-disabled {
  border-color: rgba(252, 252, 3, 0.2);
  color: rgba(252, 252, 3, 0.2);
}

.description {
  min-height: 100px;
}
</style>
