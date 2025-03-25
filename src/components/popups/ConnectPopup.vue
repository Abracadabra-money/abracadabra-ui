<template>
  <TransitionWrapper appear>
    <div class="popup" @click.self="closePopup">
      <div class="descriptin-wrap">
        <img class="book-icon" src="@/assets/images/connect/book.png" alt="" />
        <h3 class="title">Connect your wallet</h3>
        <p class="text">
          Select the prefered wallet fromthe options to access the app
          functionality
        </p>
      </div>
      <div class="connectors-wrap">
        <div class="row">
          <h3 class="wallet-title">Available Wallets</h3>

          <img
            class="popup-close"
            @click="closePopup"
            src="@/assets/images/cross.svg"
            alt="Close popup"
          />
        </div>

        <div class="connectors">
          <button
            class="connect-btn"
            v-for="connector in connectors"
            :key="connector.id"
            @click="actionHandler(connector)"
          >
            <img class="wallet-icon" :src="getWalletIcon(connector)" alt="" />
            <span> {{ connector.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </TransitionWrapper>
</template>

<script lang="ts">
import { mapMutations } from "vuex";
import { defineAsyncComponent } from "vue";
import { connectHelper } from "@/helpers/walletClienHelper";
import { connectorsHelper } from "@/helpers/walletClienHelper";
import { useImage } from "@/helpers/useImage";

export default {
  data() {
    return {
      connectors: [] as Array<{ id: string; icon: string; name: string }>,
    };
  },

  methods: {
    ...mapMutations({
      closePopup: "closePopups",
    }),

    async actionHandler(connector: any) {
      this.closePopup();
      await connectHelper(connector);
    },

    getWalletIcon(connector: { id: string; icon: string }) {
      const iconPath = useImage(`assets/images/connect/${connector.id}.png`);
      if (!iconPath.includes("undefined")) return iconPath;
      if (connector.icon) return connector.icon;
      else return useImage("assets/images/connect/default-wallet.png");
    },
  },

  created() {
    this.connectors = connectorsHelper();
  },

  components: {
    TransitionWrapper: defineAsyncComponent(
      () => import("@/components/ui/TransitionWrapper.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.popup {
  display: flex;
  max-width: 854px;
  width: 100%;
  max-height: 414px;
  height: 100%;
  flex: content;
}

.descriptin-wrap {
  border-radius: 20px 0px 0px 20px;
  background: #161e2d;
  min-width: 294px;
  width: 100%;
  padding: 24px 20px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.book-icon {
  max-width: 150px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.text {
  color: #878b93;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.connectors-wrap {
  border-radius: 0px 20px 20px 0px;
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  max-width: 560px;
  width: 100%;
  padding: 32px 20px 32px 32px;
  gap: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wallet-title {
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}

.popup-close {
  width: 17.5px;
  height: 17.5px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.popup-close:hover {
  opacity: 0.7;
}

.connectors {
  gap: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow-y: scroll;
  padding-right: 12px;
}

.connect-btn {
  display: flex;
  max-width: 221px;
  width: 100%;
  padding: 16px;
  align-items: center;
  gap: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(5px);
  max-width: 221px;
  border: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
}

.wallet-icon {
  border-radius: 4px;
  width: 40px;
  height: 40px;
}

@media screen and (max-width: 900px) {
  .popup {
    flex-direction: column;
    max-width: 560px;
  }

  .descriptin-wrap {
    display: none;
  }

  .connectors-wrap {
    border-radius: 20px;
    max-width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .connectors-wrap {
    gap: 12px;
  }

  .popup-close {
    width: 24px;
    height: 24px;
  }

  .connect-btn {
    max-width: 100%;
  }
}
</style>
