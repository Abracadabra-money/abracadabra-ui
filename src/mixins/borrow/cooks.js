import { mapGetters } from "vuex";

import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
// import notification from "@/helpers/notification/notification.js";

import yvSETHHelperAbi from "@/utils/abi/MasterContractOwner";
const yvSETHHelperAddr = "0x16ebACab63581e69d6F7594C9Eb1a05dF808ea75";

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

    needWhitelisterApprove() {
      if (!(this.selectedPool.id === 33 && this.chainId === 1)) return false;

      if (
        +this.selectedPool.userInfo?.whitelistedInfo.amountAllowedParsed <
        +this.selectedPool.userInfo?.whitelistedInfo.userBorrowPart
      )
        return true;

      return false;
    },

    isCookNeedReduceSupply() {
      if (this.chainId === 1 && this.selectedPool.id === 12) return true;
      if (
        this.chainId === 1 &&
        (this.selectedPool.id === 19 || this.selectedPool.id === 26)
      )
        return true;
      return false;
    },
  },
  methods: {
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

    async getWhitelistCallData() {
      try {
        const setMaxBorrowStaticTx =
          await this.selectedPool.userInfo?.whitelistedInfo.whitelisterContract.populateTransaction.setMaxBorrow(
            this.account,
            this.selectedPool.userInfo?.whitelistedInfo.userWhitelistedInfo
              .userBorrowPart,
            this.selectedPool.userInfo?.whitelistedInfo.userWhitelistedInfo
              .proof,
            {
              gasLimit: 50000000,
            }
          );

        const setMaxBorrowCallByte = setMaxBorrowStaticTx.data;

        // 30
        const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [
            this.selectedPool.userInfo?.whitelistedInfo.whitelisterContract
              .address,
            setMaxBorrowCallByte,
            false,
            false,
            0,
          ]
        );

        return callEncode;
      } catch (e) {
        console.log("getWhitelistCallData error:", e);
      }
    },

    async getReduceSupplyEncode(pool) {
      try {
        const yvSETHHelperContract = new this.$ethers.Contract(
          yvSETHHelperAddr,
          JSON.stringify(yvSETHHelperAbi),
          this.signer
        );

        console.log("yvSETHHelperContract", yvSETHHelperContract);

        const reduceCompletelyStaticTx =
          await yvSETHHelperContract.populateTransaction.reduceCompletely(
            pool.contractInstance.address,
            {
              gasLimit: 10000000,
            }
          );

        const reduceCompletelyCallByte = reduceCompletelyStaticTx.data;

        console.log("reduceCompletelyCallByte", reduceCompletelyCallByte);

        // 30
        const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [yvSETHHelperAddr, reduceCompletelyCallByte, false, false, 0]
        );

        return callEncode;
      } catch (e) {
        console.log("Error getReduceSupplyEncode:", e);
      }
    },

    // Borrow
    async getLpcookCollateralAndBorrowData(pool, amount, userAddr, pairToken) {
      const { lpAddress, tokenWrapper } = pool.lpLogic;

      const lpEventsArray = [];
      const lpValuesArray = [];
      const lpDatasArray = [];

      // 5
      const borrowEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      lpEventsArray.push(5);
      lpValuesArray.push(0);
      lpDatasArray.push(borrowEncode);

      // 21
      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, amount.sub("1"), "0x0"]
      );

      lpEventsArray.push(21);
      lpValuesArray.push(0);
      lpDatasArray.push(bentoWithdrawEncode);

      // 20
      // deposit in degenbox
      const lpDepositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [lpAddress, userAddr, amount, "0"]
      );

      lpEventsArray.push(20);
      lpValuesArray.push(0);
      lpDatasArray.push(lpDepositEncode);

      // 21
      // withdraw to token wrapper
      const lpWrapperEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [lpAddress, tokenWrapper, amount, "0"]
      );

      lpEventsArray.push(21);
      lpValuesArray.push(0);
      lpDatasArray.push(lpWrapperEncode);

      // 30
      // wrap and deposit to cauldron
      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
          pool.bentoBoxAddress,
          pool.collateralToken.address,
          pool.contractInstance.address,
          amount
        );

      const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [tokenWrapper, swapStaticTx.data, true, false, 2]
      );

      lpEventsArray.push(30);
      lpValuesArray.push(0);
      lpDatasArray.push(lpCallEncode);

      // 10
      // add collateral
      const lpColateralEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-2", userAddr, false]
      );

      lpEventsArray.push(10);
      lpValuesArray.push(0);
      lpDatasArray.push(lpColateralEncode);

      return { lpEventsArray, lpValuesArray, lpDatasArray };
    },

    async cookCollateralAndBorrow(
      { collateralAmount, amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId,
      isLpLogic = false
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const pairToken = pool.borrowToken.address;
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

      if (isLpLogic) {
        const { lpEventsArray, lpValuesArray, lpDatasArray } =
          await this.getLpcookCollateralAndBorrowData(
            pool,
            amount,
            userAddr,
            pairToken
          );

        eventsArray.push(...lpEventsArray);
        valuesArray.push(...lpValuesArray);
        datasArray.push(...lpDatasArray);
      } else {
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
        // await this.$store.dispatch(
        //   "notifications/new",
        //   notification.borrowSuccess
        // );
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookCollateralAndBorrow ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async getLpCookAddCollateralData(pool, amount, userAddr) {
      const { lpAddress, tokenWrapper } = pool.lpLogic;

      const lpEventsArray = [];
      const lpValuesArray = [];
      const lpDatasArray = [];

      // 20
      // deposit in degenbox
      const lpDepositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [lpAddress, userAddr, amount, "0"]
      );

      lpEventsArray.push(20);
      lpValuesArray.push(0);
      lpDatasArray.push(lpDepositEncode);

      // 21
      // withdraw to token wrapper
      const lpWrapperEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [lpAddress, tokenWrapper, amount, "0"]
      );

      lpEventsArray.push(21);
      lpValuesArray.push(0);
      lpDatasArray.push(lpWrapperEncode);

      // 30
      // wrap and deposit to cauldron
      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
          pool.bentoBoxAddress,
          pool.collateralToken.address,
          pool.contractInstance.address,
          amount
        );

      const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [tokenWrapper, swapStaticTx.data, true, false, 2]
      );

      lpEventsArray.push(30);
      lpValuesArray.push(0);
      lpDatasArray.push(lpCallEncode);

      // 10
      // add collateral
      const lpColateralEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-2", userAddr, false]
      );

      lpEventsArray.push(10);
      lpValuesArray.push(0);
      lpDatasArray.push(lpColateralEncode);

      return { lpEventsArray, lpValuesArray, lpDatasArray };
    },

    async cookAddCollateral(
      { amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId,
      isLpLogic = false
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;
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

      if (isLpLogic) {
        const { lpEventsArray, lpValuesArray, lpDatasArray } =
          await this.getLpCookAddCollateralData(pool, amount, userAddr);

        eventsArray.push(...lpEventsArray);
        valuesArray.push(...lpValuesArray);
        datasArray.push(...lpDatasArray);
      } else {
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

        // await this.$store.dispatch(
        //   "notifications/new",
        //   notification.borrowSuccess
        // );
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookAddCollateral ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async cookBorrow(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const pairToken = pool.borrowToken.address;
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

      if (this.needWhitelisterApprove) {
        const whitelistedCallData = await this.getWhitelistCallData();

        eventsArray.push(30);
        valuesArray.push(0);
        datasArray.push(whitelistedCallData);
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
        // await this.$store.dispatch(
        //   "notifications/new",
        //   notification.borrowSuccess
        // );
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookBorrow ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    // Repay
    async getLpCookRemoveAndRepayMaxData(
      pool,
      amount,
      userAddr,
      pairToken,
      userBorrowPart
    ) {
      const { tokenWrapper } = pool.lpLogic;

      const lpEventsArray = [];
      const lpValuesArray = [];
      const lpDatasArray = [];
      // 6
      const getRepayShareEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256"],
        [userBorrowPart]
      );

      lpEventsArray.push(6);
      lpValuesArray.push(0);
      lpDatasArray.push(getRepayShareEncode);

      // 20
      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, "0x00", "-0x01"]
      );

      lpEventsArray.push(20);
      lpValuesArray.push(0);
      lpDatasArray.push(depositEncode);

      // 2
      const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        [userBorrowPart, userAddr, false]
      );

      lpEventsArray.push(2);
      lpValuesArray.push(0);
      lpDatasArray.push(repayEncode);

      //4
      // remove collateral
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      lpEventsArray.push(4);
      lpValuesArray.push(0);
      lpDatasArray.push(removeCollateral);

      // 21
      // withdraw to token wrapper

      const lpBentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pool.collateralToken.address, tokenWrapper, "0", amount]
      );

      lpEventsArray.push(21);
      lpValuesArray.push(0);
      lpDatasArray.push(lpBentoWithdrawEncode);

      // 30
      // unwrap and deposit for alice in degenbox
      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
          pool.bentoBoxAddress,
          pool.collateralToken.address,
          pool.contractInstance.address,
          amount
        );

      const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [tokenWrapper, swapStaticTx.data, false, false, 2]
      );

      lpEventsArray.push(30);
      lpValuesArray.push(0);
      lpDatasArray.push(lpCallEncode);

      return { lpEventsArray, lpValuesArray, lpDatasArray };
    },

    async cookRemoveAndRepayMax(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = pool.collateralToken.address;
      const pairToken = pool.borrowToken.address;
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

      if (pool.lpLogic) {
        const { lpEventsArray, lpValuesArray, lpDatasArray } =
          await this.getLpCookRemoveAndRepayMaxData(
            pool,
            amount,
            userAddr,
            pairToken,
            userBorrowPart
          );

        eventsArray.push(...lpEventsArray);
        valuesArray.push(...lpValuesArray);
        datasArray.push(...lpDatasArray);
      } else {
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

        if (this.isCookNeedReduceSupply) {
          const callEncode = await this.getReduceSupplyEncode(pool);

          eventsArray.push(30);
          valuesArray.push(0);
          datasArray.push(callEncode);
        }
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
        // await this.$store.dispatch("notifications/new", notification.success);
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookRemoveAndRepayMax ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async getLpCookRemoveAndRepayData(
      pool,
      amount,
      userAddr,
      pairToken,
      collateralAmount
    ) {
      const { tokenWrapper } = pool.lpLogic;

      const lpEventsArray = [];
      const lpValuesArray = [];
      const lpDatasArray = [];

      //20
      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, collateralAmount, "0x0"]
      );

      lpEventsArray.push(20);
      lpValuesArray.push(0);
      lpDatasArray.push(depositEncode);

      //7
      const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256"],
        [collateralAmount.sub("1")]
      );

      lpEventsArray.push(7);
      lpValuesArray.push(0);
      lpDatasArray.push(getRepayPartEncode);

      //2
      const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-0x01", userAddr, false]
      );

      lpEventsArray.push(2);
      lpValuesArray.push(0);
      lpDatasArray.push(repayEncode);

      //4
      // remove collateral
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      lpEventsArray.push(4);
      lpValuesArray.push(0);
      lpDatasArray.push(removeCollateral);

      // 21
      // withdraw to token wrapper

      const lpBentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pool.collateralToken.address, tokenWrapper, "0", amount]
      );

      lpEventsArray.push(21);
      lpValuesArray.push(0);
      lpDatasArray.push(lpBentoWithdrawEncode);

      // 30
      // unwrap and deposit for alice in degenbox
      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
          pool.bentoBoxAddress,
          pool.collateralToken.address,
          pool.contractInstance.address,
          amount
        );

      const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [tokenWrapper, swapStaticTx.data, false, false, 2]
      );

      lpEventsArray.push(30);
      lpValuesArray.push(0);
      lpDatasArray.push(lpCallEncode);

      return { lpEventsArray, lpValuesArray, lpDatasArray };
    },

    async cookRemoveAndRepay(
      { amount, collateralAmount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const pairToken = pool.borrowToken.address;
      const tokenAddr = pool.collateralToken.address;
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

      if (pool.lpLogic) {
        const { lpEventsArray, lpValuesArray, lpDatasArray } =
          await this.getLpCookRemoveAndRepayData(
            pool,
            amount,
            userAddr,
            pairToken,
            collateralAmount
          );

        eventsArray.push(...lpEventsArray);
        valuesArray.push(...lpValuesArray);
        datasArray.push(...lpDatasArray);
      } else {
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

        if (this.isCookNeedReduceSupply) {
          const callEncode = await this.getReduceSupplyEncode(pool);

          eventsArray.push(30);
          valuesArray.push(0);
          datasArray.push(callEncode);
        }
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
        // await this.$store.dispatch("notifications/new", notification.success);
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookRemoveAndRepay ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async getLpCookRemoveCollateralData(pool, amount, userAddr) {
      const { tokenWrapper } = pool.lpLogic;
      const lpEventsArray = [];
      const lpValuesArray = [];
      const lpDatasArray = [];

      //4
      // remove collateral
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      lpEventsArray.push(4);
      lpValuesArray.push(0);
      lpDatasArray.push(removeCollateral);

      // 21
      // withdraw to token wrapper

      const lpBentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pool.collateralToken.address, tokenWrapper, "0", amount]
      );

      lpEventsArray.push(21);
      lpValuesArray.push(0);
      lpDatasArray.push(lpBentoWithdrawEncode);

      // 30
      // unwrap and deposit for alice in degenbox
      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
          pool.bentoBoxAddress,
          pool.collateralToken.address,
          pool.contractInstance.address,
          amount
        );

      const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [tokenWrapper, swapStaticTx.data, false, false, 2]
      );

      lpEventsArray.push(30);
      lpValuesArray.push(0);
      lpDatasArray.push(lpCallEncode);

      return { lpEventsArray, lpValuesArray, lpDatasArray };
    },

    async cookRemoveCollateral(
      { amount, updatePrice },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = pool.collateralToken.address;
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

      if (pool.lpLogic) {
        const { lpEventsArray, lpValuesArray, lpDatasArray } =
          await this.getLpCookRemoveCollateralData(pool, amount, userAddr);

        eventsArray.push(...lpEventsArray);
        valuesArray.push(...lpValuesArray);
        datasArray.push(...lpDatasArray);
      } else {
        //4
        // remove collateral
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
      }

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
        // await this.$store.dispatch("notifications/new", notification.success);
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookRemoveCollateral ERR:", e.code);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async cookRepayMim(
      { amount, updatePrice, itsMax },
      isApprowed,
      pool,
      notificationId
    ) {
      const pairToken = pool.borrowToken.address;
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

      if (this.isCookNeedReduceSupply) {
        const callEncode = await this.getReduceSupplyEncode(pool);

        eventsArray.push(30);
        valuesArray.push(0);
        datasArray.push(callEncode);
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
        // await this.$store.dispatch("notifications/new", notification.success);
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookRepayMim ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    // leverage
    async cookMultiBorrow(
      { collateralAmount, amount, updatePrice, minExpected, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const swapperAddres = pool.levSwapperContract.address;
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

      if (this.needWhitelisterApprove) {
        const whitelistedCallData = await this.getWhitelistCallData();

        eventsArray.push(30);
        valuesArray.push(0);
        datasArray.push(whitelistedCallData);
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

      const swapStaticTx =
        await pool.levSwapperContract.populateTransaction.swap(
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
        // await this.$store.dispatch(
        //   "notifications/new",
        //   notification.borrowSuccess
        // );
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookMultiBorrow ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
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
      const borrowTokenAddr = pool.borrowToken.address;
      const collateralTokenAddr = pool.collateralToken.address;
      const reverseSwapperAddr = pool.liqSwapperContract.address;
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
        await pool.liqSwapperContract.populateTransaction.swap(
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

      if (this.isCookNeedReduceSupply) {
        const callEncode = await this.getReduceSupplyEncode(pool);

        eventsArray.push(30);
        valuesArray.push(0);
        datasArray.push(callEncode);
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
        // await this.$store.dispatch("notifications/new", notification.success);
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("CookFlashRepay ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },
  },
};
