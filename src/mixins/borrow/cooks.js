import { mapGetters } from "vuex";
import axios from "axios";

import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { getLevZeroXswapperData } from "@/utils/zeroXSwap/ZeroXSwapHelperV2";

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

      let signature;
      try {
        signature = await this.signer._signTypedData(domain, types, value);
      } catch (e) {
        console.log("SIG ERR:", e.code);

        if (e.code === -32603) {
          console.log("signature ERROR LEGER HERE", e.code);
          return "ledger";
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
        return await pool.contractInstance.bentoBox();
      } catch (e) {
        console.log("getVerifyingContract err:", e);
      }
    },

    async approveMasterContract(pool) {
      try {
        const masterContract = await this.getMasterContract(pool);

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

      return {
        r: "0x" + r,
        s: "0x" + s,
        v: parseInt(v, 16),
      };
    },

    async getNonce(pool) {
      try {
        const nonces = await pool.masterContractInstance.nonces(this.account);
        return nonces.toString();
      } catch (e) {
        console.log("getNonce err:", e);
      }
    },

    async getMasterContract(pool) {
      try {
        return await pool.contractInstance.masterContract();
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

        const reduceCompletelyStaticTx =
          await yvSETHHelperContract.populateTransaction.reduceCompletely(
            pool.contractInstance.address,
            {
              gasLimit: 10000000,
            }
          );

        const reduceCompletelyCallByte = reduceCompletelyStaticTx.data;

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

    async query0x(buyToken, sellToken, slippage = 0, amountSell, takerAddress) {
      const slippagePercentage = slippage / 100;
      const url = "https://api.0x.org/swap/v1/quote";

      const params = {
        buyToken: buyToken,
        sellToken: sellToken,
        sellAmount: amountSell.toString(),
        slippagePercentage,
        skipValidation: true,
        takerAddress,
      };

      const response = await axios.get(url, { params: params });

      const { data, buyAmount, sellAmount, estimatedGas } = response.data;

      return {
        data: data,
        buyAmount: this.$ethers.BigNumber.from(buyAmount),
        sellAmount: this.$ethers.BigNumber.from(sellAmount),
        estimatedGas: this.$ethers.BigNumber.from(estimatedGas),
      };
    },

    // Borrow
    async getLpcookCollateralAndBorrowData(
      pool,
      borrowAmount,
      collateralAmount,
      userAddr,
      pairToken
    ) {
      const lpCollateralAndBorrowEventsArray = [];
      const lpCollateralAndBorrowValuesArray = [];
      const lpCollateralAndBorrowDatasArray = [];

      // 5
      const borrowEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [borrowAmount, userAddr]
      );

      lpCollateralAndBorrowEventsArray.push(5);
      lpCollateralAndBorrowValuesArray.push(0);
      lpCollateralAndBorrowDatasArray.push(borrowEncode);

      // 21
      const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, borrowAmount.sub("1"), "0x0"]
      );

      lpCollateralAndBorrowEventsArray.push(21);
      lpCollateralAndBorrowValuesArray.push(0);
      lpCollateralAndBorrowDatasArray.push(bentoWithdrawEncode);

      const {
        lpCollateralEventsArray,
        lpCollateralValuesArray,
        lpCollateralDatasArray,
      } = await this.getLpCookAddCollateralData(
        pool,
        collateralAmount,
        userAddr
      );

      lpCollateralAndBorrowEventsArray.push(...lpCollateralEventsArray);
      lpCollateralAndBorrowValuesArray.push(...lpCollateralValuesArray);
      lpCollateralAndBorrowDatasArray.push(...lpCollateralDatasArray);

      return {
        lpCollateralAndBorrowEventsArray,
        lpCollateralAndBorrowValuesArray,
        lpCollateralAndBorrowDatasArray,
      };
    },

    async getLpCookAddCollateralData(pool, collateralAmount, userAddr) {
      const { lpAddress, tokenWrapper } = pool.lpLogic;

      const lpCollateralEventsArray = [];
      const lpCollateralValuesArray = [];
      const lpCollateralDatasArray = [];

      // 20
      // deposit in degenbox
      const lpDepositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [lpAddress, userAddr, collateralAmount, "0"]
      );

      lpCollateralEventsArray.push(20);
      lpCollateralValuesArray.push(0);
      lpCollateralDatasArray.push(lpDepositEncode);

      // 21
      // withdraw to token wrapper
      const lpWrapperEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [lpAddress, tokenWrapper, collateralAmount, "0"]
      );

      lpCollateralEventsArray.push(21);
      lpCollateralValuesArray.push(0);
      lpCollateralDatasArray.push(lpWrapperEncode);

      // 30
      // wrap and deposit to cauldron
      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
          pool.bentoBoxAddress,
          pool.collateralToken.address,
          pool.contractInstance.address,
          collateralAmount
        );

      const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [tokenWrapper, swapStaticTx.data, true, false, 2]
      );

      lpCollateralEventsArray.push(30);
      lpCollateralValuesArray.push(0);
      lpCollateralDatasArray.push(lpCallEncode);

      // 10
      // add collateral
      const lpColateralEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-2", userAddr, true]
      );

      lpCollateralEventsArray.push(10);
      lpCollateralValuesArray.push(0);
      lpCollateralDatasArray.push(lpColateralEncode);

      return {
        lpCollateralEventsArray,
        lpCollateralValuesArray,
        lpCollateralDatasArray,
      };
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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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
        const {
          lpCollateralAndBorrowEventsArray,
          lpCollateralAndBorrowValuesArray,
          lpCollateralAndBorrowDatasArray,
        } = await this.getLpcookCollateralAndBorrowData(
          pool,
          amount,
          collateralAmount,
          userAddr,
          pairToken
        );

        eventsArray.push(...lpCollateralAndBorrowEventsArray);
        valuesArray.push(...lpCollateralAndBorrowValuesArray);
        datasArray.push(...lpCollateralAndBorrowDatasArray);
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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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
        const {
          lpCollateralEventsArray,
          lpCollateralValuesArray,
          lpCollateralDatasArray,
        } = await this.getLpCookAddCollateralData(pool, amount, userAddr);

        eventsArray.push(...lpCollateralEventsArray);
        valuesArray.push(...lpCollateralValuesArray);
        datasArray.push(...lpCollateralDatasArray);
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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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
    async getLpCookRemoveCollateralData(pool, amount, userAddr) {
      const { tokenWrapper, lpAddress } = pool.lpLogic;
      const lpRemoveCollateralEventsArray = [];
      const lpRemoveCollateralValuesArray = [];
      const lpRemoveCollateralDatasArray = [];

      //4
      // remove collateral
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      lpRemoveCollateralEventsArray.push(4);
      lpRemoveCollateralValuesArray.push(0);
      lpRemoveCollateralDatasArray.push(removeCollateral);

      // 21
      // withdraw to token wrapper

      const lpBentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pool.collateralToken.address, tokenWrapper, "0", amount]
      );

      lpRemoveCollateralEventsArray.push(21);
      lpRemoveCollateralValuesArray.push(0);
      lpRemoveCollateralDatasArray.push(lpBentoWithdrawEncode);

      // 30
      // unwrap and deposit for alice in degenbox

      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
          pool.bentoBoxAddress,
          pool.collateralToken.address,
          userAddr,
          amount
        );

      const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [tokenWrapper, swapStaticTx.data, false, false, 2]
      );

      lpRemoveCollateralEventsArray.push(30);
      lpRemoveCollateralValuesArray.push(0);
      lpRemoveCollateralDatasArray.push(lpCallEncode);

      // 21
      // withdraw to token wrapper
      const lpWrapperEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [lpAddress, userAddr, amount, "0"]
      );

      lpRemoveCollateralEventsArray.push(21);
      lpRemoveCollateralValuesArray.push(0);
      lpRemoveCollateralDatasArray.push(lpWrapperEncode);

      return {
        lpRemoveCollateralEventsArray,
        lpRemoveCollateralValuesArray,
        lpRemoveCollateralDatasArray,
      };
    },

    async getLpCookRemoveAndRepayData(
      pool,
      amount,
      userAddr,
      pairToken,
      collateralAmount
    ) {
      const lpRemoveAndRepayEventsArray = [];
      const lpRemoveAndRepayValuesArray = [];
      const lpRemoveAndRepayDatasArray = [];

      //20
      const depositEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [pairToken, userAddr, collateralAmount, "0x0"]
      );

      lpRemoveAndRepayEventsArray.push(20);
      lpRemoveAndRepayValuesArray.push(0);
      lpRemoveAndRepayDatasArray.push(depositEncode);

      //7
      const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256"],
        [collateralAmount.sub("1")]
      );

      lpRemoveAndRepayEventsArray.push(7);
      lpRemoveAndRepayValuesArray.push(0);
      lpRemoveAndRepayDatasArray.push(getRepayPartEncode);

      //2
      const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-0x01", userAddr, false]
      );

      lpRemoveAndRepayEventsArray.push(2);
      lpRemoveAndRepayValuesArray.push(0);
      lpRemoveAndRepayDatasArray.push(repayEncode);

      const {
        lpRemoveCollateralEventsArray,
        lpRemoveCollateralValuesArray,
        lpRemoveCollateralDatasArray,
      } = await this.getLpCookRemoveCollateralData(pool, amount, userAddr);

      lpRemoveAndRepayEventsArray.push(...lpRemoveCollateralEventsArray);
      lpRemoveAndRepayValuesArray.push(...lpRemoveCollateralValuesArray);
      lpRemoveAndRepayDatasArray.push(...lpRemoveCollateralDatasArray);

      return {
        lpRemoveAndRepayEventsArray,
        lpRemoveAndRepayValuesArray,
        lpRemoveAndRepayDatasArray,
      };
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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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

      if (pool.lpLogic) {
        const {
          lpRemoveCollateralEventsArray,
          lpRemoveCollateralValuesArray,
          lpRemoveCollateralDatasArray,
        } = await this.getLpCookRemoveCollateralData(pool, amount, userAddr);

        eventsArray.push(...lpRemoveCollateralEventsArray);
        valuesArray.push(...lpRemoveCollateralValuesArray);
        datasArray.push(...lpRemoveCollateralDatasArray);
      } else {
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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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
        const {
          lpRemoveAndRepayEventsArray,
          lpRemoveAndRepayValuesArray,
          lpRemoveAndRepayDatasArray,
        } = await this.getLpCookRemoveAndRepayData(
          pool,
          amount,
          userAddr,
          pairToken,
          collateralAmount
        );

        eventsArray.push(...lpRemoveAndRepayEventsArray);
        valuesArray.push(...lpRemoveAndRepayValuesArray);
        datasArray.push(...lpRemoveAndRepayDatasArray);
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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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
        const {
          lpRemoveCollateralEventsArray,
          lpRemoveCollateralValuesArray,
          lpRemoveCollateralDatasArray,
        } = await this.getLpCookRemoveCollateralData(pool, amount, userAddr);

        eventsArray.push(...lpRemoveCollateralEventsArray);
        valuesArray.push(...lpRemoveCollateralValuesArray);
        datasArray.push(...lpRemoveCollateralDatasArray);
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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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
      {
        collateralAmount,
        amount,
        updatePrice,
        minExpected,
        itsDefaultBalance,
        slipage,
      },
      isApprowed,
      pool,
      notificationId
    ) {
      let tokenAddr;
      if (itsDefaultBalance) tokenAddr = this.defaultTokenAddress;
      else if (pool.lpLogic.lpAddress) tokenAddr = pool.lpLogic.lpAddress;
      else tokenAddr = pool.collateralToken.address;

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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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

      //10 add collateral to caldron
      let getCollateralEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-0x02", userAddr, false]
      );

      if (collateralAmount) {
        // 20 deposit in degenbox
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

      //5 Borrow MIM
      const getBorrowSwapperEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, swapperAddres]
      );

      eventsArray.push(5);
      valuesArray.push(0);
      datasArray.push(getBorrowSwapperEncode2);

      let swapCallByte, getCallEncode2;

      if (pool.is0xSwap) {
        const response = await this.query0x(
          pool.collateralToken.address,
          pool.borrowToken.address,
          slipage,
          amount,
          pool.levSwapperContract.address
        );

        const swapData = response.data;
        const swapStaticTx =
          await pool.levSwapperContract.populateTransaction.swap(
            userAddr,
            minExpected,
            amount,
            swapData,
            {
              gasLimit: 10000000,
            }
          );
        swapCallByte = swapStaticTx.data;

        //30
        getCallEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [swapperAddres, swapCallByte, false, false, 2]
        );
      } else if (pool.is0xSwapLp) {
        const data = await getLevZeroXswapperData(amount, pool, slipage);

        try {
          const swapStaticTx =
            await pool.levSwapperContract.populateTransaction.swap(
              userAddr,
              minExpected,
              amount,
              data,
              {
                gasLimit: 10000000,
              }
            );

          const swapCallByte = swapStaticTx.data;

          //30
          getCallEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
            ["address", "bytes", "bool", "bool", "uint8"],
            [swapperAddres, swapCallByte, false, false, 2]
          );
        } catch (error) {
          console.log("is0xSwapLp swapStaticTx", error);
        }

        //END TODO
      } else {
        const swapStaticTx =
          await pool.levSwapperContract.populateTransaction.swap(
            userAddr,
            minExpected,
            0,
            {
              gasLimit: 10000000,
            }
          );
        swapCallByte = swapStaticTx.data.substr(0, 138);

        //30
        getCallEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [swapperAddres, swapCallByte, false, true, 2]
        );
      }

      eventsArray.push(30);
      valuesArray.push(0);
      datasArray.push(getCallEncode2);

      //TODO Wrap Amount
      if (pool.is0xSwapLp) {
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
            pool.bentoBoxAddress,
            pool.collateralToken.address,
            pool.contractInstance.address,
            collateralAmount //???
          );

        const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [pool.lpLogic.tokenWrapper, swapStaticTx.data, true, false, 2]
        );

        eventsArray.push(30);
        valuesArray.push(0);
        datasArray.push(lpCallEncode);

        // 10
        // add collateral
        getCollateralEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          ["-2", userAddr, true]
        );
      } else {
        eventsArray.push(10);
        valuesArray.push(0);
        datasArray.push(getCollateralEncode2);
      }

      const cookData = {
        events: eventsArray,
        values: valuesArray,
        datas: datasArray,
      };

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
        slipage,
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

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
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

      let swapStaticTx;
      if (pool.is0xSwap) {
        const response = await this.query0x(
          pool.borrowToken.address,
          pool.collateralToken.address,
          slipage,
          collateralAmount,
          pool.liqSwapperContract.address
        );

        const swapData = response.data;

        swapStaticTx = await pool.liqSwapperContract.populateTransaction.swap(
          collateralTokenAddr,
          borrowTokenAddr,
          userAddr,
          0,
          collateralAmount,
          swapData,
          {
            gasLimit: 10000000,
          }
        );
      } else {
        swapStaticTx = await pool.liqSwapperContract.populateTransaction.swap(
          collateralTokenAddr,
          borrowTokenAddr,
          userAddr,
          0,
          collateralAmount,
          {
            gasLimit: 10000000,
          }
        );
      }

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
