import { mapGetters } from "vuex";

import notification from "@/utils/notification";
export default {
  data() {
    return {
      gasLimitConst: 1000,
      defaultTokenAddress: "0x0000000000000000000000000000000000000000",
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
    // Borrow
    async cookCollateralAndBorrow(
      { collateralAmount, amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId
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

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("COOK ERR:", e);
        console.log("COOK ERR:", String(e));
        console.log("COOK ERR:", e.code);

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },

    async cookAddCollateral(
      { amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId
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

        await this.$store.commit("notifications/delete", notificationId);

        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("COOK ERR:", e.code);

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },

    async cookBorrow(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
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

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("COOK ERR:", e.code);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },

    // End Borrow

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

    // Repay

    async cookRemoveAndRepayMax(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = pool.token.address;
      const pairToken = pool.pairToken.address;
      const userAddr = this.account;
      const userBorrowPart = pool.userInfo.contractBorrowPart;

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

      // 6
      const getRepayShareEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256"],
        [userBorrowPart]
      );

      eventsArray.push(6);
      valuesArray.push(0);
      datasArray.push(getRepayShareEncode);

      // 20
      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, "0x00", "-0x01"]
      );

      eventsArray.push(20);
      valuesArray.push(0);
      datasArray.push(depositEncode);

      // 2
      const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        [userBorrowPart, userAddr, false]
      );

      eventsArray.push(2);
      valuesArray.push(0);
      datasArray.push(repayEncode);

      // 4
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      eventsArray.push(4);
      valuesArray.push(0);
      datasArray.push(removeCollateral);

      // 21
      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [tokenAddr, userAddr, "0x00", amount]
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

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("COOK ERR:", e.code);

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },

    async cookRemoveAndRepay(
      { amount, collateralAmount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const pairToken = pool.pairToken.address;
      const tokenAddr = pool.token.address;
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

      //20
      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, collateralAmount, "0x0"]
      );

      eventsArray.push(20);
      valuesArray.push(0);
      datasArray.push(depositEncode);

      //7
      const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256"],
        [collateralAmount.sub("1")]
      );

      eventsArray.push(7);
      valuesArray.push(0);
      datasArray.push(getRepayPartEncode);

      //2
      const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-0x01", userAddr, false]
      );

      eventsArray.push(2);
      valuesArray.push(0);
      datasArray.push(repayEncode);

      // 4
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      eventsArray.push(4);
      valuesArray.push(0);
      datasArray.push(removeCollateral);

      //21
      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [tokenAddr, userAddr, "0x00", amount]
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
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("COOK ERR:", e.code);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },

    async cookRemoveCollateral(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = pool.token.address;
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

      //4
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      eventsArray.push(4);
      valuesArray.push(0);
      datasArray.push(removeCollateral);

      // 21
      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [tokenAddr, userAddr, "0x00", amount]
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

      const swapStaticTx = await pool.contractInstance.populateTransaction.cook(
        cookData.events,
        cookData.values,
        cookData.datas,
        {
          value: 0,
        }
      );

      console.log("populkated", swapStaticTx);

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
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("COOK ERR:", e.code);

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },

    async cookRepayMim(
      { amount, updatePrice, itsMax },
      isApprowed,
      pool,
      notificationId
    ) {
      const pairToken = pool.pairToken.address;
      const userAddr = this.account;

      const userBorrowPart = pool.userInfo.contractBorrowPart;

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

      if (itsMax) {
        // 6
        const getRepayShareEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256"],
          [userBorrowPart]
        );

        eventsArray.push(6);
        valuesArray.push(0);
        datasArray.push(getRepayShareEncode);

        // 20
        const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "int256", "int256"],
          [pairToken, userAddr, "0x00", "-0x01"]
        );

        eventsArray.push(20);
        valuesArray.push(0);
        datasArray.push(depositEncode);

        // 2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          [userBorrowPart, userAddr, false]
        );

        eventsArray.push(2);
        valuesArray.push(0);
        datasArray.push(repayEncode);
      } else {
        // 20
        const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "int256", "int256"],
          [pairToken, userAddr, amount, "0x0"]
        );

        eventsArray.push(20);
        valuesArray.push(0);
        datasArray.push(depositEncode);

        //7
        const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256"],
          [amount.sub("1")]
        );

        eventsArray.push(7);
        valuesArray.push(0);
        datasArray.push(getRepayPartEncode);

        //2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          ["-0x01", userAddr, false]
        );

        eventsArray.push(2);
        valuesArray.push(0);
        datasArray.push(repayEncode);
      }

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
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("COOK ERR:", e.code);
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },

    // END Repay

    // leverage
    async cookMultiBorrow(
      { collateralAmount, amount, updatePrice, minExpected, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.token.address;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const swapperAddres = pool.swapContract.address;
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

      //10
      const getCollateralEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-0x02", userAddr, false]
      );

      if (collateralAmount) {
        //20
        const getDepositEncode1 = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "int256", "int256"],
          [tokenAddr, userAddr, collateralAmount, "0"]
        );

        eventsArray.push(20);
        valuesArray.push(collateralValue);
        datasArray.push(getDepositEncode1);

        eventsArray.push(10);
        valuesArray.push(0);
        datasArray.push(getCollateralEncode2);
      }

      //5
      const getBorrowSwapperEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, swapperAddres]
      );

      eventsArray.push(5);
      valuesArray.push(0);
      datasArray.push(getBorrowSwapperEncode2);

      const swapStaticTx = await pool.swapContract.populateTransaction.swap(
        userAddr,
        minExpected,
        0,
        {
          gasLimit: 10000000,
        }
      );

      const swapCallByte = swapStaticTx.data.substr(0, 138);

      //30
      const getCallEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [swapperAddres, swapCallByte, false, true, 2]
      );

      eventsArray.push(30);
      valuesArray.push(0);
      datasArray.push(getCallEncode2);

      eventsArray.push(10);
      valuesArray.push(0);
      datasArray.push(getCollateralEncode2);

      const cookData = {
        events: eventsArray,
        values: valuesArray,
        datas: datasArray,
      };

      console.log("cookData", cookData);
      console.log("cookData", cookData.datas.join());

      try {
        const estimateGas = await pool.contractInstance.estimateGas.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: collateralValue,
          }
        );

        const gasLimit = this.gasLimitConst * 100 + +estimateGas.toString();

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

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("MULTI COOK ERR:", e);

        let msg;

        if (e.code === "UNPREDICTABLE_GAS_LIMIT") {
          msg = {
            title: "Error",
            msg: "Looks like your transaction is likely to fail due to slippage settings, please increase your slippage!",
            type: "error",
          };
        }

        if (e?.data?.message === "execution reverted: Cauldron: call failed") {
          msg = {
            title: "Error",
            msg: "Looks like your transaction is likely to fail due to slippage settings, please increase your slippage!",
            type: "error",
          };
        }

        if (!msg) {
          msg = notification.transaction.error;
        }

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", msg);
      }
    },

    async cookAddAndBorrow(
      { collateralAmount, amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId
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
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("COOK ERR:", e);
        console.log("COOK ERR:", String(e));
        console.log("COOK ERR:", e.code);

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.error
        );
      }
    },

    // deleverage
    async cookFlashRepay(
      {
        borrowAmount,
        collateralAmount,
        removeCollateralAmount,
        updatePrice,
        itsMax,
      },
      isApprowed,
      pool,
      account,
      notificationId
    ) {
      const borrowTokenAddr = pool.pairToken.address;
      const collateralTokenAddr = pool.token.address;
      const reverseSwapperAddr = pool.reverseSwapContract.address;
      const userAddr = account;
      const userBorrowPart = pool.userInfo.contractBorrowPart;

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

      // 4
      const removeCollateralToSwapper =
        this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address"],
          [collateralAmount, reverseSwapperAddr]
        );

      eventsArray.push(4);
      valuesArray.push(0);
      datasArray.push(removeCollateralToSwapper);

      const swapStaticTx =
        await pool.reverseSwapContract.populateTransaction.swap(
          collateralTokenAddr,
          borrowTokenAddr,
          userAddr,
          0,
          collateralAmount,
          {
            gasLimit: 10000000,
          }
        );

      const swapCallByte = swapStaticTx.data;

      // 30
      const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [reverseSwapperAddr, swapCallByte, false, false, 2]
      );

      eventsArray.push(30);
      valuesArray.push(0);
      datasArray.push(callEncode);

      if (itsMax) {
        // 2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          [userBorrowPart, userAddr, false]
        );

        eventsArray.push(2);
        valuesArray.push(0);
        datasArray.push(repayEncode);
      } else {
        // 2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          [borrowAmount, userAddr, false]
        );

        eventsArray.push(2);
        valuesArray.push(0);
        datasArray.push(repayEncode);
      }

      if (+removeCollateralAmount > 0) {
        // 4
        const removeCollateralFinal = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address"],
          [removeCollateralAmount, userAddr]
        );

        eventsArray.push(4);
        valuesArray.push(0);
        datasArray.push(removeCollateralFinal);

        // 21
        const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "int256", "int256"],
          [collateralTokenAddr, userAddr, "0x00", removeCollateralAmount]
        );

        eventsArray.push(21);
        valuesArray.push(0);
        datasArray.push(bentoWithdrawEncode);
      }

      const cookData = {
        events: eventsArray,
        values: valuesArray,
        datas: datasArray,
      };

      console.log("cookData", cookData);
      console.log("cookData", `[${cookData.datas.join()}]`);

      try {
        const estimateGas = await pool.contractInstance.estimateGas.cook(
          cookData.events,
          cookData.values,
          cookData.datas,
          {
            value: 0,
          }
        );

        const gasLimit = this.gasLimitConst * 100 + +estimateGas.toString();

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

        await this.$store.commit("notifications/delete", notificationId);

        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("FLASH REPAY COOK ERR:", e.error);
        console.log("FLASH REPAY COOK ERR:", e.data);
        let msg;

        if (e.error === "execution reverted: Cauldron: user insolvent") {
          msg = {
            title: "Error",
            msg: "Looks like your transaction is likely to fail due to swap tolerance settings, please increase your swap tolerance!",
            type: "error",
          };
        }

        if (e.error?.message === "execution reverted: BoringMath: Underflow") {
          msg = {
            title: "Error",
            msg: "Looks like your transaction is likely to fail due to swap tolerance settings, please increase your swap tolerance!",
            type: "error",
          };
        }

        if (e.data?.message === "execution reverted: BoringMath: Underflow") {
          msg = {
            title: "Error",
            msg: "Looks like your transaction is likely to fail due to swap tolerance settings, please increase your swap tolerance!",
            type: "error",
          };
        }

        if (!msg) {
          msg = notification.transaction.error;
        }

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", msg);
      }
    },
  },
};
