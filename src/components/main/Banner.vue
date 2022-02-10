<template>
  <div class="banner" :class="['banner__'+1]">
    <div v-if="icon" class="banner__icon">
      <img
          src="@/assets/images/banner-icons/coins.png"
          alt=""
      />
    </div>
    <div class="banner__content">
      <h2 class="banner__title" :class="{'banner__title_align-left': button, 'banner__title_align-right': iconRight}">{{title}}</h2>
      <p class="banner__discription" :class="{'banner__discription_align-right': iconRight}"><slot></slot></p>
    </div>
    <div v-if="button" class="banner__button">
      <DefaultButton @click="button.click" :width="'112px'" >{{button.text}}</DefaultButton>
    </div>
    <div v-if="iconRight" class="banner__icon-right">
      <img
          src="@/assets/images/banner-icons/coins.png"
          alt=""
      />
    </div>
    <div  class="banner__close">
      <img
        v-if="!noClose"
        class="banner__close"
        src="@/assets/images/banner-icons/close.svg"
        alt=""
        @click="closeBanner"
      />
    </div>
  </div>
</template>

<script>
import DefaultButton from "@/components/main/DefaultButton.vue";

export default {
  props: {
    title: {
      type: String
    },
    icon: {
      type: Boolean
    },
    button: {
      type: Object
    },
    noClose: {
      type: Boolean
    },
    iconRight: {
      type: Boolean
    },
  },
  data() {
    return {

    };
  },
  methods: {
    closeBanner() {
      
    }
  },
  components: {
    DefaultButton
  }
};
</script>

<style lang="scss" scoped>

.banner {
  padding: 16px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 920px;
  // min-width: 920px;
  background: rgba(64, 58, 92, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  &__icon {
    width: 55px;
  }
  &__content {
    margin: -10px 0;
    margin-left: 16px;
  }
  &__discription {
    text-align: center;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.035em;
    color: rgba(255, 255, 255, 0.8);
    &_align-right {
      text-align: right !important;
    }
  }
  &__title {
    font-family: Prompt;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    &_align-left {
      text-align: left;
    }
    &_align-right {
      text-align: right !important;
    }
  }
  &__button {
    display: flex;
    justify-content: end;
    width: 260px;
  }
  &__icon-right {
    margin-left: 16px;
    width: 55px;
  }
  &__close {
    margin-left: 16px;
    cursor: pointer;
    align-self: flex-start;
  }
}

</style>
