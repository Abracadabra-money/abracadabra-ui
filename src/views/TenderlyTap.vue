<template>
  <div class="tendarly-tap-view">
    <div class="tenderly-tap">
      <h3 class="title">Tendarly Tap</h3>
      <div class="wrapper">
        <div class="fork-actions">
          <div class="create-fork underline">
            <!-- todo Select -->
            <!-- <input
              class="input"
              v-model="chainInputValue"
              type="number"
              placeholder="1"
            /> -->
            <div class="drop-wrap">
              <Dropdown @changeForkId="changeForkId" />
            </div>
            <BaseButton @click="createForkAction">
              <span class="create-fork-btn">
                <img
                  class="tenderly-icon"
                  src="@/assets/images/tenderly/tenderly_icon.png"
                  alt=""
                />Create Fork
              </span>
            </BaseButton>
          </div>
          <GasTopUpBlock />

          <!-- todo component -->
          <!-- <div class="get-gas-block">
            <h3 class="title">Get Gas</h3>
            <div class="get-gas">
              <input
                class="input"
                v-model="gasInputAddress"
                type="text"
                placeholder="Add destination address"
                :disabled="!useCustomAddress"
              />
              <div class="toggle-markets">
                Use custom
                <CheckBox
                  @update="toggleActiveMarkets"
                  :value="useCustomAddress"
                />
              </div>
            </div>
            <div class="gas-actions">
              <input
                class="input"
                v-model="gasInputValue"
                type="number"
                placeholder="1000"
              />

              <BaseButton width="160px" @click="addGasToken">
                Get Gas
              </BaseButton>
            </div>
          </div> -->
        </div>

        <div class="fork-info-wrap">
          <h3 class="title">Forks Info</h3>
          <ForkInfoItem
            v-for="forkData in testForkData"
            :forkData="forkData"
            :key="forkData.forkId"
          />
        </div>
      </div>
    </div>

    <!-- <div class="content">
      <h1>Tenderly Tap</h1>
      <h4 class="tenderly-link" v-if="rpcUrl">
        Tenderly fork URL: {{ rpcUrl }}
      </h4>
      <div class="btns">
        <BaseButton @click="createForkAction">Create Fork</BaseButton>
        <BaseButton @click="addForkToMetamaskAction" :disabled="!rpcUrl"
          >Add to Metamask</BaseButton
        >
        <BaseButton @click="disconnectDevMod" :disabled="!rpcUrl"
          >Delete Fork</BaseButton
        >
      </div>
      <div class="btns" v-if="rpcUrl">
        <input
          v-model="inputValue"
          type="number"
          class="settings-input"
          placeholder="1000"
        />

        <BaseButton @click="addGasToken">Add Gas</BaseButton>
      </div>
    </div> -->
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { TENDERLY_FORK_URL } from "@/constants/tenderly";
import { createFork } from "@/helpers/tenderly/createFork";
import { addForkToMetamask } from "@/helpers/tenderly/addForkToMetamask";
import { getAccount } from "@wagmi/core";
import { mapGetters } from "vuex";
import { utils } from "ethers";

const account = getAccount();

export default {
  data() {
    return {
      chainInputValue: "",
      gasInputAddress: account.address,
      inputValue: "",
      gasInputValue: "",
      useCustomAddress: false,
      forkData: JSON.parse(localStorage.getItem("tenderly_fork_data")),
      forkChainId: 1,
      testForkData: JSON.parse(localStorage.getItem("tenderly_fork_data")),
    };
  },

  computed: {
    ...mapGetters({ provider: "getProvider" }),
    rpcUrl() {
      if (!this.forkData) return null;
      const fork_id = this.forkData?.root_transaction?.fork_id;
      return `${TENDERLY_FORK_URL}${fork_id}`;
    },

    forkId() {
      console.log("this.forkData?", this.forkData);
      const fork_id = this.forkData?.root_transaction?.fork_id;
      return fork_id ? fork_id : "xx";
    },

    account() {
      const account = getAccount();
      return account.address;
    },

    isUseFork() {
      const tenderlyForkData = JSON.parse(
        localStorage.getItem("tenderly_fork_data")
      );

      return "";
    },
  },

  methods: {
    changeForkId(chainId) {
      this.forkChainId = chainId;
    },

    async createForkAction() {
      const forksArray =
        JSON.parse(localStorage.getItem("tenderly_fork_data")) || [];

      console.log("forkData", forksArray);
      this.forkData = await createFork(this.forkChainId);
      forksArray.push(this.forkData);

      console.log("forksArray222", forksArray);

      localStorage.setItem("tenderly_fork_data", JSON.stringify(forksArray));

      window.dispatchEvent(
        new CustomEvent("tenderly_fork_data-changed", {
          detail: {
            storage: localStorage.getItem("tenderly_fork_data"),
          },
        })
      );
    },

    async addForkToMetamaskAction() {
      if (!this.forkData) {
        const forkData = JSON.parse(localStorage.getItem("tenderly_fork_data"));
        this.forkData = !forkData ? null : forkData;
        if (!forkData) return false;
      }

      await addForkToMetamask(this.forkData);
      window.location.reload();
    },

    disconnectDevMod() {
      localStorage.removeItem("tenderly_fork_data");
      window.location.reload();
    },

    // async addGasToken() {
    //   const formattedAmount = utils.parseEther(this.gasInputValue.toString());
    //   const params = [[account], utils.hexValue(formattedAmount.toHexString())];
    //   await this.provider.send("tenderly_addBalance", params);
    // },

    // toggleActiveMarkets() {
    //   this.useCustomAddress = !this.useCustomAddress;

    //   if (this.useCustomAddress) this.gasInputAddress = "";
    //   else this.gasInputAddress = account.address;
    // },
  },

  created() {
    window.dispatchEvent(
      new CustomEvent("tenderly_fork_data-changed", {
        detail: {
          storage: localStorage.getItem("tenderly_fork_data"),
        },
      })
    );
  },

  async mounted() {
    window.addEventListener("tenderly_fork_data-changed", () => {
      this.testForkData = JSON.parse(
        localStorage.getItem("tenderly_fork_data")
      );
      console.log("Updated");
      this.testForkData = JSON.parse(
        localStorage.getItem("tenderly_fork_data")
      );
      console.log("this.testForkData", this.testForkData);
    });
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    CheckBox: defineAsyncComponent(() =>
      import("@/components/ui/CheckBox.vue")
    ),
    ForkInfoItem: defineAsyncComponent(() =>
      import("@/components/tenderly/ForkInfoItem.vue")
    ),
    GasTopUpBlock: defineAsyncComponent(() =>
      import("@/components/tenderly/GasTopUpBlock.vue")
    ),
    Dropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/Netwoks.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
input[type="number"]:hover,
input[type="number"]:focus {
  -moz-appearance: number-input;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.tendarly-tap-view {
  display: flex;
  align-items: center;
  justify-content: center;
  // height: 100vh;
}

.tenderly-tap {
  margin-top: 120px;
  margin-bottom: 100px;
  background: #2a2835;
  padding: 20px;
  max-width: 1200px;
  border-radius: 30px;
  width: 100%;
}

.title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 30px;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.fork-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 110%;
}

.create-fork {
  display: flex;
  gap: 15px;
  padding-bottom: 15px;
  align-items: center;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.input {
  background-color: rgba(255, 255, 255, 0.1);
  height: 50px;
  text-align: center;
  width: 70%;
  font-size: 16px;
  border-radius: 20px;
  border: none;
  outline: none;
  color: white;
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}

.create-fork-btn {
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
}

.tenderly-icon {
  max-width: 30px;
}

.get-gas {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
}

.toggle-markets {
  height: 50px;
  max-width: 160px;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 24px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
  border: 2px solid #648fcc;

  // &:hover {
  //   background: #616068;
  // }
}

.fork-info-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.gas-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.gas-btn {
  max-width: 160px;
  width: 100%;
}

.drop-wrap {
  width: 260px;
}

// .fork-info {
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
//   // border: 1px solid red;
//   border-radius: 30px;
//   padding: 15px;
//   background: #2b2b3c;
//   border: 1px solid rgba(255, 255, 255, 0.06);
// }

// .info-row {
//   display: flex;
//   justify-content: space-between;
// }

// .btns {
//   display: flex;
//   gap: 5px;
// }

// .content {
//   display: flex;
//   flex-direction: column;
//   gap: 25px;
//   align-items: center;
//   background: #2b2b3c;
//   border-radius: 30px;
//   padding: 20px;
//   max-width: 900px;
//   width: 100%;
// }

// .btns {
//   display: flex;
//   width: 100%;
//   gap: 15px;
//   align-items: center;
// }

// .tenderly-link {
//   font-size: 18px;
// }
</style>
