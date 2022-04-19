<template>
  <div class="stake">
      <component :is="currentComponent" />
  </div>
</template>
<script>
import MSpell from '@/components/stake/MSpell';
import SSpell from '@/components/stake/SSpell';

export default {
  components: {MSpell, SSpell},
  props: ['currentComponent']
}
</script>
<style lang="scss">

.swap-wrap {
  position: relative;
  height: 330px;
  display: flex;
  justify-content: center;
  @media (max-width: 1023px) {
    height: 350px
  }
}

.value-input {
  min-width: 280px; 
  width: 490px;
}

.swap-img {
  position: absolute;
  left: calc(50% - 20px);
  top: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: pointer;
  @media (max-width: 1023px) {
    top: 180px
  }
  & img {
    transform: rotateX(0deg);
    transition: all 0.3s;
  }
  & img.reflect {
    transform: rotateX(180deg);
  }
}
.choose-stake-input {
  background-color: white;
}

.choose {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.token-input {
  padding-top: 22px;
  padding-bottom: 14px;
  position: absolute;
  top: 164px;
  @media (max-width: 1023px) {
    top: 180px
  }
  &.active {
    top: 0;
  }
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
}

.profile-subscribtion {
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  &__approximate {
    margin-top: 55px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  & p {
    margin-bottom: 20px;
    text-align: center;
  }
}

.profile {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}

.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
}

.profile-actions {
  display: flex;
  margin-top: 30px;
  & .default-button:last-child {
    margin-left: auto;
  }
}

.stake {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding-top: 100px;
  padding-bottom: 100px;
}

@media (min-width: 1300px) {
  .stake {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }
}
</style>
