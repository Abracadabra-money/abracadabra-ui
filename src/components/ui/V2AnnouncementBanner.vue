<template>
  <div class="v2-banner" v-if="!isCloseBanner">
    <div class="v2-banner-content">
      <div class="v2-banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path fill="#5552FD" d="M9.354 3.264h5.294v1.588H9.354z"/>
          <path fill="#9695F8" d="M9.354 17.56h5.294v1.588H9.354z"/>
          <path fill="#5552FD" d="M7.764 4.854h1.588v1.588H7.764zM6.176 6.442h1.588V8.03H6.176zm3.176 3.176h1.588v1.588H9.352zm3.706 0h1.588v1.588h-1.588zM4.588 8.03h1.588v1.588H4.587z"/>
          <path fill="#9695F8" d="M6.176 14.382h1.588v1.588H6.176z"/>
          <path fill="#5552FD" d="M6.176 15.972h1.588v1.588H6.176z"/>
          <path fill="#9695F8" d="M7.765 15.972h1.588v1.588H7.765z"/>
          <path fill="#5552FD" d="M7.764 17.558h1.588v1.588H7.764zm-3.177-3.176h1.589v1.588H4.587z"/>
          <path fill="#9695F8" d="M17.824 14.382h-1.589v1.588h1.589z"/>
          <path fill="#5552FD" d="M17.824 15.972h-1.589v1.588h1.589z"/>
          <path fill="#9695F8" d="M16.235 15.972h-1.588v1.588h1.588z"/>
          <path fill="#5552FD" d="M16.235 17.56h-1.588v1.588h1.588zm3.177-3.177h-1.588v1.588h1.588zM7.765 8.03h1.588v7.941H7.765zm6.882 0h1.588v7.941h-1.588zm3.176 0h1.589v1.588h-1.588zm-3.176-3.176h1.588v1.588h-1.588zm1.588 1.588h1.588V8.03h-1.588z"/>
          <path fill="#9695F8" d="M9.354 4.854h5.294v1.588H9.354z"/>
          <path fill="#5552FD" d="M9.354 19.148h5.294v1.588H9.354z"/>
          <path fill="#9695F8" d="M7.765 6.441h1.588V8.03H7.765z"/>
          <path fill="#FED955" d="M6.176 9.618h1.588v4.765H6.176z"/>
          <path fill="#9695F8" d="M6.176 8.03h1.588v1.588H6.176zM4.587 9.617h1.589v4.764H4.587zm14.824 0h-1.588v4.764h1.588z"/>
          <path fill="#5552FD" d="M3 9.618h1.588v4.765H3zm18 0h-1.588v4.765H21z"/>
          <path fill="#FED955" d="M16.235 9.618h1.588v4.765h-1.588zm-5.294 0h2.118v1.588H10.94z"/>
          <path fill="#9695F8" d="M16.235 8.03h1.588v1.588h-1.588zm-1.588-1.59h1.588v1.59h-1.588z"/>
          <path fill="#FED955" d="M9.354 6.441h5.294V8.03H9.354zm0 1.589h5.294v1.588H9.354zm5.294 3.176v6.353H9.354v-6.353z"/>
          <path fill="#5552FD" d="M10.94 11.206h2.119v1.588H10.94z"/>
        </svg>
      </div>

      <div class="v2-banner-text">
        <h3 class="v2-banner-title">Abracadabra V2 is coming</h3>
        <p class="v2-banner-subtitle">Private DeFi banking with higher LTV, debit cards, and privacy by default.</p>
      </div>

      <span class="v2-banner-btn" @click="toAnnouncement">
        Learn More
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </span>
    </div>

    <img
      class="close-btn"
      src="@/assets/images/close.svg"
      alt="Close"
      @click="isCloseBanner = true"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "V2AnnouncementBanner",

  data() {
    return {
      isCloseBanner: false,
    };
  },

  methods: {
    toAnnouncement() {
      this.$router.push({ name: "V2Announcement" });
    },
  },
};
</script>

<style lang="scss" scoped>
.v2-banner {
  display: flex;
  align-items: center;
  max-width: 1280px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(85, 82, 253, 0.4);
  background: linear-gradient(
    90deg,
    rgba(85, 82, 253, 0.32) 0%,
    rgba(150, 149, 248, 0.2) 100%
  );
  backdrop-filter: blur(19px);
  padding: 12px 50px 12px 24px;
  position: fixed;
  top: 100px;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
}

.v2-banner-content {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.v2-banner-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
}

.v2-banner-text {
  flex: 1;
  min-width: 0;
}

.v2-banner-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: #fff;
}

.v2-banner-subtitle {
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}

.v2-banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(85, 82, 253, 0.5);
  border: 1px solid rgba(150, 149, 248, 0.4);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(85, 82, 253, 0.7);
  }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .v2-banner {
    padding: 12px 40px 12px 12px;
    max-width: calc(100% - 20px);
  }

  .v2-banner-content {
    flex-wrap: wrap;
    gap: 10px;
  }

  .v2-banner-icon {
    width: 28px;
    height: 28px;
  }

  .v2-banner-text {
    flex-basis: calc(100% - 42px);
  }

  .v2-banner-title {
    font-size: 14px;
  }

  .v2-banner-subtitle {
    font-size: 12px;
  }

  .v2-banner-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
  }

  .close-btn {
    top: 8px;
    right: 8px;
  }
}
</style>
