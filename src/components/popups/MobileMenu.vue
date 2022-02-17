<template>
  <div class="popup-wrap" :class="{ inner: isOpenInnerPopup }">
    <div class="popup">
      <div class="popup-link-wrap" @click="closePopup">
        <router-link class="popup-link" to="/">Borrow</router-link>
      </div>
      <div class="popup-link-wrap" @click="closePopup">
        <router-link class="popup-link" to="/about">Leverage</router-link>
      </div>
      <div class="popup-link-wrap" @click="closePopup">
        <router-link class="popup-link" to="/my-positions"
          >Positions</router-link
        >
      </div>
      <div class="popup-link-wrap" @click="closePopup">
        <router-link class="popup-link" :to="{ name: 'Farm' }"
          >Farm</router-link
        >
      </div>
      <button class="popup-link" @click="openInnerPopup('tools')">Tools</button>
      <div class="popup-link">
        <ConnectButton />
      </div>
      <button class="popup-link" @click="openInnerPopup('other')">
        <img
          class="title"
          src="@/assets/images/social/points.svg"
          alt="Points"
        />
      </button>
    </div>

    <div class="tools-popup" v-if="showTools" @click="closeInnerPopup('tools')">
      <div class="tools">
        <div class="popup-link-wrap" @click="closePopup">
          <router-link class="popup-link" to="/">Borrow</router-link>
        </div>
        <div class="popup-link-wrap" @click="closePopup">
          <a class="popup-link" href="#" target="_blank">Swap</a>
        </div>
        <div class="popup-link-wrap" @click="closePopup">
          <a class="popup-link" href="#" target="_blank">Analytics</a>
        </div>
      </div>
    </div>

    <div class="other-popup" v-if="showOther" @click="closeInnerPopup('other')">
      <div class="other">
        <div class="other-line">
          <a class="other-link" href="#" target="_blank">V 1</a>
          <a class="other-link" href="#" target="_blank">Forum</a>
          <div class="social">
            <a href="#" target="_blank"
              ><img src="@/assets/images/social/docs.svg" alt="Docs"
            /></a>
            <a href="#" target="_blank"
              ><img src="@/assets/images/social/medium.svg" alt="Medium"
            /></a>
            <a href="#" target="_blank"
              ><img src="@/assets/images/social/twitter.svg" alt="Twitter"
            /></a>
            <a href="#" target="_blank"
              ><img src="@/assets/images/social/discord.svg" alt="Discord"
            /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ConnectButton = () => import("@/components/ui/ConnectButton");
export default {
  data() {
    return {
      showTools: false,
      showOther: false,
    };
  },

  computed: {
    isOpenInnerPopup() {
      if (this.showTools || this.showOther) {
        return true;
      }
      return false;
    },
  },

  methods: {
    closePopup() {
      this.$emit("closePopup");
    },

    openInnerPopup(name) {
      if (name === "tools") {
        this.showTools = true;
      }

      if (name === "other") {
        this.showOther = true;
      }

      return false;
    },

    closeInnerPopup(name) {
      console.log();
      if (name === "tools" && event.target.classList.contains("tools-popup")) {
        this.showTools = false;
      }

      if (name === "other" && event.target.classList.contains("other-popup")) {
        this.showOther = false;
      }

      return false;
    },
  },

  components: {
    ConnectButton,
  },
};
</script>

<style lang="scss" scoped>
.popup-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: $headerHeight 10px 60px;
  background: #23212d;
}

.inner {
  z-index: 11;
}

.popup {
  display: flex;
  flex-direction: column;
  width: 95%;
}

.popup-link {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  height: 50px;
  border: none;
  outline: transparent;
  margin-bottom: 20px;

  .connect-btn {
    background: transparent;
    color: #fff;
  }
}

.tools-popup,
.other-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.tools,
.other {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 15px 5px;
  width: 95%;
}

.other {
  padding: 10px 5px;
}

.other-line {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.other-link {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.social {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 210px;
  margin: 0 auto;
}
// ff
</style>
