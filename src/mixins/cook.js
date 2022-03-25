import { mapGetters } from "vuex";
export default {
  data() {
    return {
      gasLimitConst: 1000,
      defaultTokenAddress: "0x0000000000000000000000000000000000000000",
      cookSuccessText: `Thanks for taking part in the innovation of MIM.
      Consider yourself extremely early in taking part in creating the stablecoin that has no bias and knows no walls.
      $MIM- stable for everyone, everywhere`,
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      itsMetamask: "getMetamaskActive",
      chainId: "getChainId",
      signer: "getSigner",
    }),
  },
  methods: {
    async cookCollateralAndBorrow(
      { collateralAmount, amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.token.address;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const pairToken = pool.pairToken.address;
      const userAddr = this.account;

      const eventsArray = [];
      const valuesArray = [];
      const datasArray = [];

      if (!isApprowed) {
        const approvalEncode = await this.getApprovalEncode(pool);

        console.log("approvalEncode in COOK", approvalEncode);

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
          console.log("aproveMasterContract resp: ", approvalMaster);
          if (!approvalMaster) return false;
        } else {
          eventsArray.push(24);
          valuesArray.push(0);
          datasArray.push(approvalEncode);
        }
      }

      if (updatePrice) {
        const updateEncode = this.getUpdateRateEncode();

        eventsArray.push(11);
        valuesArray.push(0);
        datasArray.push(updateEncode);
      }

      // 5
      const borrowEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      eventsArray.push(5);
      valuesArray.push(0);
      datasArray.push(borrowEncode);

      // 21
      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, amount.sub("1"), "0x0"]
      );

      eventsArray.push(21);
      valuesArray.push(0);
      datasArray.push(bentoWithdrawEncode);

      // 20
      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [tokenAddr, userAddr, collateralAmount, "0"]
      );

      eventsArray.push(20);
      valuesArray.push(collateralValue);
      datasArray.push(depositEncode);

      // 10
      const colateralEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-2", userAddr, false]
      );

      eventsArray.push(10);
      valuesArray.push(0);
      datasArray.push(colateralEncode);

      const cookData = {
        events: eventsArray,
        values: valuesArray,
        datas: datasArray,
      };

      console.log("cookData", cookData);

      try {
        const estimateGas = await pool.contractInstance.estimateGas.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: collateralValue,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        const result = await pool.contractInstance.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: collateralValue,
            gasLimit,
          }
        );

        console.log(result);

        const notification = {
          msg: this.cookSuccessText,
        };

        // this.$store.commit("addNotification", notification);
        console.log("notification", notification);
      } catch (e) {
        console.log("COOK ERR:", e);
        console.log("COOK ERR:", String(e));
        console.log("COOK ERR:", e.code);
      }
    },

    async cookAddCollateral(
      { amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.token.address;
      const collateralValue = itsDefaultBalance ? amount.toString() : 0;

      const userAddr = this.account;

      const eventsArray = [];
      const valuesArray = [];
      const datasArray = [];

      if (!isApprowed) {
        const approvalEncode = await this.getApprovalEncode(pool);

        console.log("approvalEncode in COOK", approvalEncode);

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
          console.log("aproveMasterContract resp: ", approvalMaster);
          if (!approvalMaster) return false;
        } else {
          eventsArray.push(24);
          valuesArray.push(0);
          datasArray.push(approvalEncode);
        }
      }

      if (updatePrice) {
        const updateEncode = this.getUpdateRateEncode();

        eventsArray.push(11);
        valuesArray.push(0);
        datasArray.push(updateEncode);
      }

      // 20
      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [tokenAddr, userAddr, amount, "0"]
      );

      eventsArray.push(20);
      valuesArray.push(collateralValue);
      datasArray.push(depositEncode);

      // 10
      const colateralEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-2", userAddr, false]
      );

      eventsArray.push(10);
      valuesArray.push(0);
      datasArray.push(colateralEncode);

      const cookData = {
        events: eventsArray,
        values: valuesArray,
        datas: datasArray,
      };

      console.log("cookData", cookData);

      try {
        const estimateGas = await pool.contractInstance.estimateGas.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: collateralValue,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit for cook:", gasLimit);

        const result = await pool.contractInstance.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: collateralValue,
            gasLimit,
          }
        );

        console.log(result);

        const notification = {
          msg: this.cookSuccessText,
        };

        // this.$store.commit("addNotification", notification);
        console.log("addNotification", notification);
      } catch (e) {
        console.log("COOK ERR:", e.code);
      }
    },

    async cookBorrow({ amount, updatePrice }, isApprowed, pool) {
      const pairToken = pool.pairToken.address;
      const userAddr = this.account;

      const eventsArray = [];
      const valuesArray = [];
      const datasArray = [];

      if (!isApprowed) {
        const approvalEncode = await this.getApprovalEncode(pool);

        console.log("approvalEncode in COOK", approvalEncode);

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
          console.log("aproveMasterContract resp: ", approvalMaster);
          if (!approvalMaster) return false;
        } else {
          eventsArray.push(24);
          valuesArray.push(0);
          datasArray.push(approvalEncode);
        }
      }

      if (updatePrice) {
        const updateEncode = this.getUpdateRateEncode();

        eventsArray.push(11);
        valuesArray.push(0);
        datasArray.push(updateEncode);
      }

      // 5
      const borrowEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      eventsArray.push(5);
      valuesArray.push(0);
      datasArray.push(borrowEncode);

      //21
      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, amount.sub("1"), "0x0"]
      );

      eventsArray.push(21);
      valuesArray.push(0);
      datasArray.push(bentoWithdrawEncode);

      const cookData = {
        events: eventsArray,
        values: valuesArray,
        datas: datasArray,
      };

      console.log("cookData", cookData);

      try {
        const estimateGas = await pool.contractInstance.estimateGas.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: 0,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit for cook:", gasLimit);

        const result = await pool.contractInstance.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: 0,
            gasLimit,
          }
        );

        console.log(result);
      } catch (e) {
        console.log("COOK ERR:", e.code);
      }
    },

    async getApprovalEncode(pool) {
      if (!this.itsMetamask) return "ledger";

      const account = this.account;

      const verifyingContract = await this.getVerifyingContract(pool);
      const masterContract = await this.getMasterContract(pool);
      const nonce = await this.getNonce(pool);
      const chainId = this.$ethers.utils.hexlify(this.chainId);

      const domain = {
        name: "BentoBox V1",
        chainId,
        verifyingContract,
      };

      // The named list of all type definitions
      const types = {
        SetMasterContractApproval: [
          { name: "warning", type: "string" },
          { name: "user", type: "address" },
          { name: "masterContract", type: "address" },
          { name: "approved", type: "bool" },
          { name: "nonce", type: "uint256" },
        ],
      };

      // The data to sign
      const value = {
        warning: "Give FULL access to funds in (and approved to) BentoBox?",
        user: account,
        masterContract,
        approved: true,
        nonce,
      };

      console.log("signature data");
      console.log(domain, types, value);
      let signature;

      try {
        signature = await this.signer._signTypedData(domain, types, value);

        console.log("signature SUCCESS", signature);
      } catch (e) {
        console.log("SIG ERR:", e.code);

        if (e.code === -32603) {
          console.log("signature ERROR LEGER HERE", e.code);
          return "ledger";

          // this.$store.commit("setPopupState", {
          //   type: "device-error",
          //   isShow: true,
          // });
        }
        return false;
      }

      const parsedSignature = this.parseSignature(signature);

      if (parsedSignature.v === 0) {
        parsedSignature.v = 27;
      }

      if (parsedSignature.v === 1) {
        parsedSignature.v = 28;
      }

      console.log("parsedSignature", parsedSignature);

      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "bool", "uint8", "bytes32", "bytes32"],
        [
          account,
          masterContract,
          true,
          parsedSignature.v,
          parsedSignature.r,
          parsedSignature.s,
        ]
      );
    },

    async getVerifyingContract(pool) {
      try {
        const verifyingContract = await pool.contractInstance.bentoBox();
        return verifyingContract;
      } catch (e) {
        console.log("getVerifyingContract err:", e);
      }
    },

    async approveMasterContract(pool) {
      try {
        const masterContract = await this.getMasterContract(pool);

        console.log(
          "approveMasterContract",
          this.account,
          masterContract,
          true,
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String("")
        );

        const estimateGas =
          await pool.masterContractInstance.estimateGas.setMasterContractApproval(
            this.account,
            masterContract,
            true,
            this.$ethers.utils.formatBytes32String(""),
            this.$ethers.utils.formatBytes32String(""),
            this.$ethers.utils.formatBytes32String("")
          );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        const tx = await pool.masterContractInstance.setMasterContractApproval(
          this.account,
          masterContract,
          true,
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String(""),
          { gasLimit }
        );

        const receipt = await tx.wait();
        return receipt;
      } catch (e) {
        console.log("approveMasterContract err:", e);
        return false;
      }
    },

    getUpdateRateEncode() {
      return this.$ethers.utils.defaultAbiCoder.encode(
        ["bool", "uint256", "uint256"],
        [true, "0x00", "0x00"]
      );
    },

    parseSignature(signature) {
      const parsedSignature = signature.substring(2);

      var r = parsedSignature.substring(0, 64);
      var s = parsedSignature.substring(64, 128);
      var v = parsedSignature.substring(128, 130);

      console.log("ORIGINAL SIGNATURE:", r, s, v);

      return {
        r: "0x" + r,
        s: "0x" + s,
        v: parseInt(v, 16),
      };
    },

    async getNonce(pool) {
      try {
        const nonces = await pool.masterContractInstance.nonces(this.account);

        console.log("NONCE:", nonces.toString());

        return nonces.toString();
      } catch (e) {
        console.log("getNonce err:", e);
      }
    },

    async getMasterContract(pool) {
      try {
        const masterContract = await pool.contractInstance.masterContract();
        return masterContract;
      } catch (e) {
        console.log("getMasterContract err:", e);
      }
    },
  },
};
