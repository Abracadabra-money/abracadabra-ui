<template>
  <div class="road-map">
    <h3 class="title">MIMSwap Roadmap</h3>

    <div class="phases-wrap">
      <div class="stages">
        <div class="stages-item">1</div>
        <hr class="border02" />
        <div class="stages-item">2</div>
        <hr class="border02" />
        <div class="stages-item">3</div>
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
      The MIMSwap Liquidity Launch Event marks a pivotal moment in our journey
      on Blast, introducing MIMSwap in a grand fashion. It presents a unique
      chance for users to deposit MIM or USDB, offering an option to lock these
      assets for improved point gains.
    </div>
    <div class="description" v-if="activePhase === 2">
      Stage where point distributions become more frequent and the introduction
      of Gold and Potion points is imminent. This phase represents the final
      opportunity for deposits to qualify for the Founder’s Boost, the most
      significant reward incentive from Abracadabra to date.
    </div>
    <div class="description" v-if="activePhase === 3">
      This phase concludes the LLE initiative with the deployment of MIMswap
      contracts, beginning the migration process and seeding and launching LPs.
      At this juncture, the Founder’s Boost is realized and activated.
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
  min-width: 35px;
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

.border02 {
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    90deg,
    #fcfc03,
    #fcfc03 75%,
    transparent 75%,
    transparent 100%
  );
  background-size: 5px 5px;
  border: none;
}

.border03 {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(252, 252, 3, 0.2),
    rgba(252, 252, 3, 0.2) 75%,
    transparent 75%,
    transparent 100%
  );
  background-size: 5px 5px;
  border: none;
}

@media screen and (max-width: 1200px) {
  .phases-wrap {
    display: flex;
    gap: 26px;
    justify-content: center;
  }

  .road-map {
    padding: 16px;
  }

  .stages {
    width: auto;
    height: 200px;
    flex-direction: column;
    margin: initial;
    padding-top: 20px;
  }

  .phases-list {
    gap: 15px;
    flex-direction: column;
    max-width: 250px;
    width: 100%;
  }

  .phases-item {
    height: 65px;
  }

  .border03,
  .border02 {
    transform: rotate(90deg);
  }

  .description {
    min-height: 130px;
  }
}
</style>
