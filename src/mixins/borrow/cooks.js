import { mapGetters } from "vuex";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { getLev0xData, getLiq0xData } from "@/utils/zeroXSwap/zeroXswapper";
import { getSetMaxBorrowData } from "@/helpers/cauldron/cook/setMaxBorrow";
import { signMasterContract } from "@/helpers/signature";
import { setMasterContractApproval } from "@/helpers/cauldron/boxes";
import { swap0xRequest } from "@/helpers/0x";
import { actions } from "@/helpers/cauldron/cook/actions";
import { cook } from "@/helpers/cauldron/cauldron";
const usdcAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const gmxLensAddress = "0xF6939A5D9081799041294B05f1939A06A0AdB75c";
import cookHelperAbi from "@/utils/abi/cookHelperAbi";
import gmxLensAbi from "@/utils/abi/lp/GmxLens";

export default {
  data() {
    return {
      gasLimitConst: 1000,
      defaultTokenAddress: "0x0000000000000000000000000000000000000000",
      glpPoolsId: [2, 3],
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

    cookHelper() {
      if (
        this.chainId === 1 &&
        (this.selectedPool.id === 35 ||
          this.selectedPool.id === 36 ||
          this.selectedPool.id === 37)
      )
        return new this.$ethers.Contract(
          "0x3AeCB01be778fAA795f156B9D3627c0E05f700a1",
          JSON.stringify(cookHelperAbi),
          this.signer
        );

      if (this.chainId === 42161 && this.selectedPool.id === 2)
        return new this.$ethers.Contract(
          "0x129149DC63F5778a41f619Bb36212566ac54eA45",
          JSON.stringify(cookHelperAbi),
          this.signer
        );

      return false;
    },

    isGlp() {
      return (
        this.chainId === 42161 &&
        this.glpPoolsId.includes(+this.selectedPool?.id)
      );
    },
  },
  methods: {
    async getDegenBoxDepositEncode(
      tokenAddress,
      toAddress,
      amount,
      share,
      useValue1 = false,
      useValue2 = false,
      returnValues = 0
    ) {
      try {
        const degenBoxDepositTx =
          await this.cookHelper.populateTransaction.degenBoxDeposit(
            tokenAddress,
            toAddress,
            amount,
            share,
            {
              gasLimit: 1000000000,
            }
          );

        const degenBoxDepositByte = degenBoxDepositTx.data;

        // 30
        const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [
            this.cookHelper.address,
            degenBoxDepositByte,
            useValue1,
            useValue2,
            returnValues,
          ]
        );

        return callEncode;
      } catch (error) {
        console.log("getDegenBoxDepositEncode err:", error);
      }
    },

    async degenBoxWithdrawEncode(
      tokenAddress,
      toAddress,
      amount,
      share,
      useValue1 = false,
      useValue2 = false,
      returnValues = 0
    ) {
      try {
        const degenBoxWithdrawTx =
          await this.cookHelper.populateTransaction.degenBoxWithdraw(
            tokenAddress,
            toAddress,
            amount,
            share,
            {
              gasLimit: 1000000000,
            }
          );

        const degenBoxWithdrawByte = degenBoxWithdrawTx.data;

        // 30
        const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [
            this.cookHelper.address,
            degenBoxWithdrawByte,
            useValue1,
            useValue2,
            returnValues,
          ]
        );

        return callEncode;
      } catch (error) {
        console.log("degenBoxWithdrawEncode err:", error);
      }
    },

    async getRepayPartEncode(
      toAddress,
      cauldronAddress,
      part,
      useValue1 = false
    ) {
      try {
        const repayPartTx = await this.cookHelper.populateTransaction.repayPart(
          toAddress,
          cauldronAddress,
          part,
          {
            gasLimit: 1000000000,
          }
        );

        const repayPartByte = useValue1
          ? repayPartTx.data.substr(0, 138)
          : repayPartByte;

        // 30
        const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [this.cookHelper.address, repayPartByte, useValue1, false, 0]
        );

        return callEncode;
      } catch (error) {
        console.log("getRepayPartEncode err:", error);
      }
    },

    async isCookHelperApprowed(pool) {
      try {
        const masterContract = this.cookHelper.address;

        const addressApprowed =
          await pool.masterContractInstance.masterContractApproved(
            masterContract,
            this.account
          );

        return addressApprowed;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },

    async getApprovalEncode(
      pool,
      approved = true,
      useHelper = false,
      addNonce = 0
    ) {
      if (!this.itsMetamask) return "ledger";

      const user = this.account;
      const masterContract = useHelper
        ? this.cookHelper.address
        : await pool.contractInstance.masterContract();
      const verifyingContract = await pool.contractInstance.bentoBox();
      const nonce = await pool.masterContractInstance.nonces(user);

      const parsedSignature = await signMasterContract(
        this.signer,
        this.chainId,
        verifyingContract,
        user,
        masterContract,
        approved,
        +nonce + addNonce
      );

      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "bool", "uint8", "bytes32", "bytes32"],
        [
          user,
          masterContract,
          approved,
          parsedSignature.v,
          parsedSignature.r,
          parsedSignature.s,
        ]
      );
    },

    async approveMasterContract(pool) {
      try {
        const masterContract = await pool.contractInstance.masterContract();

        return await setMasterContractApproval(
          pool.masterContractInstance,
          this.account,
          masterContract,
          true
        );
      } catch (e) {
        console.log("approveMasterContract err:", e);
        return false;
      }
    },

    async getWhitelistCallData() {
      try {
        const whitelistedInfo = this.selectedPool.userInfo?.whitelistedInfo;

        const data = await getSetMaxBorrowData(
          whitelistedInfo.whitelisterContract,
          this.account,
          whitelistedInfo.userWhitelistedInfo.userBorrowPart,
          whitelistedInfo.userWhitelistedInfo.proof
        );

        // 30
        const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [whitelistedInfo.whitelisterContract.address, data, false, false, 0]
        );

        return callEncode;
      } catch (e) {
        console.log("getWhitelistCallData error:", e);
      }
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

      if (this.cookHelper) {
        const withdrawEncode = await this.degenBoxWithdrawEncode(
          pairToken,
          userAddr,
          borrowAmount.sub("1"),
          "0x0"
        );

        lpCollateralAndBorrowEventsArray.push(30);
        lpCollateralAndBorrowValuesArray.push(0);
        lpCollateralAndBorrowDatasArray.push(withdrawEncode);
      } else {
        // 21
        const bentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "int256", "int256"],
          [pairToken, userAddr, borrowAmount.sub("1"), "0x0"]
        );

        lpCollateralAndBorrowEventsArray.push(21);
        lpCollateralAndBorrowValuesArray.push(0);
        lpCollateralAndBorrowDatasArray.push(bentoWithdrawEncode);
      }

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

      if (this.cookHelper) {
        const collateralToShare = await pool.masterContractInstance.toShare(
          lpAddress,
          collateralAmount,
          false
        );

        const depositEncode = await this.getDegenBoxDepositEncode(
          lpAddress,
          userAddr,
          "0",
          collateralToShare
        );

        lpCollateralEventsArray.push(30);
        lpCollateralValuesArray.push(0);
        lpCollateralDatasArray.push(depositEncode);

        const withdrawEncode = await this.degenBoxWithdrawEncode(
          lpAddress,
          tokenWrapper,
          "0",
          collateralToShare
        );

        lpCollateralEventsArray.push(30);
        lpCollateralValuesArray.push(0);
        lpCollateralDatasArray.push(withdrawEncode);
      } else {
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
      }

      // 30
      // wrap and deposit to cauldron
      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
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

    async temporaryApprovalBlockHelper(
      pool,
      isApprowed,
      cookData = { events: [], values: [], datas: [] }
    ) {
      const isCookHelperApproved = this.cookHelper
        ? await this.isCookHelperApprowed(pool)
        : false;

      if (this.cookHelper && !isCookHelperApproved) {
        const approvalEncode = await this.getApprovalEncode(pool, true, true);

        cookData.events.push(24);
        cookData.values.push(0);
        cookData.datas.push(approvalEncode);
      } else if (!isApprowed && !this.cookHelper) {
        const approvalEncode = await this.getApprovalEncode(pool);

        if (approvalEncode === "ledger") {
          const approvalMaster = await this.approveMasterContract(pool);
          if (!approvalMaster) return false; // TODO: update
          return cookData;
        } else {
          cookData.events.push(24);
          cookData.values.push(0);
          cookData.datas.push(approvalEncode);
        }
      }

      return cookData;
    },

    async temporaryRevokeApprovalBlockHelper(pool, cookData) {
      const addNonce = cookData.events.filter((value) => value === 24).length;

      const removeApprovalEncode = await this.getApprovalEncode(
        pool,
        false,
        false,
        addNonce
      );
      if (removeApprovalEncode && removeApprovalEncode !== "ledger") {
        cookData.events.push(24);
        cookData.values.push(0);
        cookData.datas.push(removeApprovalEncode);
      }

      return cookData;
    },

    async cookCollateralAndBorrow(
      { collateralAmount, amount, updatePrice, itsDefaultBalance },
      isApprowed,
      pool,
      notificationId,
      isLpLogic = false,
      isWrap = false
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;

      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const pairToken = pool.borrowToken.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.events);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (isLpLogic && isWrap) {
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

        cookData.events.push(...lpCollateralAndBorrowEventsArray);
        cookData.values.push(...lpCollateralAndBorrowValuesArray);
        cookData.datas.push(...lpCollateralAndBorrowDatasArray);
      } else {
        cookData = await actions.borrow(cookData, amount, userAddr);

        if (this.cookHelper) {
          const withdrawEncode = await this.degenBoxWithdrawEncode(
            pairToken,
            userAddr,
            amount.sub("1"),
            "0x0"
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(withdrawEncode);
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            pairToken,
            userAddr,
            amount.sub("1"),
            "0x0"
          );
        }

        if (this.cookHelper) {
          const collateralToShare = await pool.masterContractInstance.toShare(
            tokenAddr,
            collateralAmount,
            false
          );

          const depositEncode = await this.getDegenBoxDepositEncode(
            tokenAddr,
            pool.contractInstance.address,
            "0",
            collateralToShare,
            false,
            false,
            0
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(depositEncode);

          cookData = await actions.addCollateral(
            cookData,
            collateralToShare,
            userAddr,
            true
          );
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            tokenAddr,
            userAddr,
            collateralAmount,
            "0"
          );

          cookData = await actions.addCollateral(
            cookData,
            "-2",
            userAddr,
            false
          );
        }
      }

      if (isApprowed && this.cookHelper)
        cookData = await this.temporaryRevokeApprovalBlockHelper(pool.cookData);

      try {
        await cook(pool.contractInstance, cookData, collateralValue);

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
      isLpLogic = false,
      isWrap = false
    ) {
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;
      const collateralValue = itsDefaultBalance ? amount.toString() : 0;

      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (isLpLogic && isWrap) {
        const {
          lpCollateralEventsArray,
          lpCollateralValuesArray,
          lpCollateralDatasArray,
        } = await this.getLpCookAddCollateralData(pool, amount, userAddr);

        cookData.events.push(...lpCollateralEventsArray);
        cookData.values.push(...lpCollateralValuesArray);
        cookData.datas.push(...lpCollateralDatasArray);
      } else {
        if (this.cookHelper) {
          const collateralToShare = await pool.masterContractInstance.toShare(
            tokenAddr,
            amount,
            false
          );

          const depositEncode = await this.getDegenBoxDepositEncode(
            tokenAddr,
            pool.contractInstance.address,
            "0",
            collateralToShare,
            false,
            false,
            0
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(depositEncode);

          cookData = await actions.addCollateral(
            cookData,
            collateralToShare,
            userAddr,
            true
          );
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            tokenAddr,
            userAddr,
            amount,
            "0"
          );

          cookData = await actions.addCollateral(
            cookData,
            "-2",
            userAddr,
            false
          );
        }
      }

      if (isApprowed && this.cookHelper)
        cookData = await this.temporaryRevokeApprovalBlockHelper(pool.cookData);

      try {
        await cook(pool.contractInstance, cookData, collateralValue);

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

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (this.needWhitelisterApprove) {
        const whitelistedCallData = await this.getWhitelistCallData();

        cookData.events.push(30);
        cookData.values.push(0);
        cookData.datas.push(whitelistedCallData);
      }

      cookData = await actions.borrow(cookData, amount, userAddr);

      if (this.cookHelper) {
        const withdrawEncode = await this.degenBoxWithdrawEncode(
          pairToken,
          userAddr,
          amount.sub("1"),
          "0x0"
        );

        cookData.events.push(30);
        cookData.values.push(0);
        cookData.datas.push(withdrawEncode);
      } else {
        cookData = await actions.bentoWithdraw(
          cookData,
          pairToken,
          userAddr,
          amount.sub("1"),
          "0x0"
        );
      }

      if (isApprowed && this.cookHelper)
        cookData = await this.temporaryRevokeApprovalBlockHelper(pool.cookData);

      try {
        await cook(pool.contractInstance, cookData, 0);

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

      //4 remove collateral
      const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, userAddr]
      );

      lpRemoveCollateralEventsArray.push(4);
      lpRemoveCollateralValuesArray.push(0);
      lpRemoveCollateralDatasArray.push(removeCollateral);

      if (this.cookHelper) {
        const withdrawEncode = await this.degenBoxWithdrawEncode(
          pool.collateralToken.address,
          tokenWrapper,
          "0",
          amount
        );

        lpRemoveCollateralEventsArray.push(30);
        lpRemoveCollateralValuesArray.push(0);
        lpRemoveCollateralDatasArray.push(withdrawEncode);
      } else {
        // 21 withdraw to token wrapper

        const lpBentoWithdrawEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "int256", "int256"],
          [pool.collateralToken.address, tokenWrapper, "0", amount]
        );

        lpRemoveCollateralEventsArray.push(21);
        lpRemoveCollateralValuesArray.push(0);
        lpRemoveCollateralDatasArray.push(lpBentoWithdrawEncode);
      }

      // 30 unwrap and deposit for alice in degenbox
      const swapStaticTx =
        await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
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

      if (this.cookHelper) {
        const withdrawEncode = await this.degenBoxWithdrawEncode(
          lpAddress,
          userAddr,
          amount,
          "0"
        );

        lpRemoveCollateralEventsArray.push(30);
        lpRemoveCollateralValuesArray.push(0);
        lpRemoveCollateralDatasArray.push(withdrawEncode);
      } else {
        // 21
        // withdraw to  userAddr
        const lpWrapperEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "int256", "int256"],
          [lpAddress, userAddr, amount, "0"]
        );

        lpRemoveCollateralEventsArray.push(21);
        lpRemoveCollateralValuesArray.push(0);
        lpRemoveCollateralDatasArray.push(lpWrapperEncode);
      }

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

      if (this.cookHelper) {
        const depositEncode = await this.getDegenBoxDepositEncode(
          pairToken,
          userAddr,
          collateralAmount,
          "0"
        );

        lpRemoveAndRepayEventsArray.push(30);
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

        const repayEncode = await this.getRepayPartEncode(
          userAddr,
          pool.contractInstance.address,
          collateralAmount,
          true
        );

        lpRemoveAndRepayEventsArray.push(30);
        lpRemoveAndRepayValuesArray.push(0);
        lpRemoveAndRepayDatasArray.push(repayEncode);
      } else {
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
      }

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

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (this.cookHelper) {
        const userBorrowShare = await pool.masterContractInstance.toShare(
          pairToken,
          userBorrowPart,
          false
        );

        const depositEncode = await this.getDegenBoxDepositEncode(
          pairToken,
          userAddr,
          "0x00",
          userBorrowShare
        );

        cookData.events.push(30);
        cookData.values.push(0);
        cookData.datas.push(depositEncode);

        const repayEncode = await this.getRepayPartEncode(
          userAddr,
          pool.contractInstance.address,
          userBorrowPart
        );

        cookData.events.push(30);
        cookData.values.push(0);
        cookData.datas.push(repayEncode);
      } else {
        // 6
        const getRepayShareEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256"],
          [userBorrowPart]
        );

        cookData.events.push(6);
        cookData.values.push(0);
        cookData.datas.push(getRepayShareEncode);

        cookData = await actions.bentoDeposit(
          cookData,
          pairToken,
          userAddr,
          "0x00",
          "-0x01"
        );

        // 2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          [userBorrowPart, userAddr, false]
        );

        cookData.events.push(2);
        cookData.values.push(0);
        cookData.datas.push(repayEncode);
      }

      if (pool.lpLogic) {
        const {
          lpRemoveCollateralEventsArray,
          lpRemoveCollateralValuesArray,
          lpRemoveCollateralDatasArray,
        } = await this.getLpCookRemoveCollateralData(pool, amount, userAddr);

        cookData.events.push(...lpRemoveCollateralEventsArray);
        cookData.values.push(...lpRemoveCollateralValuesArray);
        cookData.datas.push(...lpRemoveCollateralDatasArray);
      } else {
        // 4
        const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address"],
          [amount, userAddr]
        );

        cookData.events.push(4);
        cookData.values.push(0);
        cookData.datas.push(removeCollateral);

        if (this.cookHelper) {
          const withdrawEncode = await this.degenBoxWithdrawEncode(
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(withdrawEncode);
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );
        }
      }

      if (isApprowed && this.cookHelper)
        cookData = await this.temporaryRevokeApprovalBlockHelper(pool.cookData);

      try {
        await cook(pool.contractInstance, cookData, 0);

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

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

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

        cookData.events.push(...lpRemoveAndRepayEventsArray);
        cookData.values.push(...lpRemoveAndRepayValuesArray);
        cookData.datas.push(...lpRemoveAndRepayDatasArray);
      } else {
        if (this.cookHelper) {
          const depositEncode = await this.getDegenBoxDepositEncode(
            pairToken,
            userAddr,
            collateralAmount,
            "0"
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(depositEncode);

          //7
          const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["int256"],
            [collateralAmount.sub("1")]
          );

          cookData.events.push(7);
          cookData.values.push(0);
          cookData.datas.push(getRepayPartEncode);

          const repayEncode = await this.getRepayPartEncode(
            userAddr,
            pool.contractInstance.address,
            collateralAmount,
            true
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(repayEncode);
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            pairToken,
            userAddr,
            collateralAmount,
            "0x0"
          );

          //7
          const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["int256"],
            [collateralAmount.sub("1")]
          );

          cookData.events.push(7);
          cookData.values.push(0);
          cookData.datas.push(getRepayPartEncode);

          //2
          const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["int256", "address", "bool"],
            ["-0x01", userAddr, false]
          );

          cookData.events.push(2);
          cookData.values.push(0);
          cookData.datas.push(repayEncode);
        }

        // 4
        const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address"],
          [amount, userAddr]
        );

        cookData.events.push(4);
        cookData.values.push(0);
        cookData.datas.push(removeCollateral);

        if (this.cookHelper) {
          const withdrawEncode = await this.degenBoxWithdrawEncode(
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(withdrawEncode);
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );
        }
      }

      if (isApprowed && this.cookHelper)
        cookData = await this.temporaryRevokeApprovalBlockHelper(pool.cookData);

      try {
        await cook(pool.contractInstance, cookData, 0);

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

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (pool.lpLogic) {
        const {
          lpRemoveCollateralEventsArray,
          lpRemoveCollateralValuesArray,
          lpRemoveCollateralDatasArray,
        } = await this.getLpCookRemoveCollateralData(pool, amount, userAddr);

        cookData.events.push(...lpRemoveCollateralEventsArray);
        cookData.values.push(...lpRemoveCollateralValuesArray);
        cookData.datas.push(...lpRemoveCollateralDatasArray);
      } else {
        //4
        // remove collateral
        const removeCollateral = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address"],
          [amount, userAddr]
        );

        cookData.events.push(4);
        cookData.values.push(0);
        cookData.datas.push(removeCollateral);

        if (this.cookHelper) {
          const withdrawEncode = await this.degenBoxWithdrawEncode(
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(withdrawEncode);
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );
        }
      }

      if (isApprowed && this.cookHelper)
        cookData = await this.temporaryRevokeApprovalBlockHelper(pool.cookData);

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
        await cook(pool.contractInstance, cookData, 0);

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

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (itsMax) {
        if (this.cookHelper) {
          const userBorrowShare = await pool.masterContractInstance.toShare(
            pairToken,
            userBorrowPart,
            false
          );

          const depositEncode = await this.getDegenBoxDepositEncode(
            pairToken,
            userAddr,
            "0x00",
            userBorrowShare
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(depositEncode);

          const repayEncode = await this.getRepayPartEncode(
            userAddr,
            pool.contractInstance.address,
            userBorrowPart
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(repayEncode);
        } else {
          // 6
          const getRepayShareEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["int256"],
            [userBorrowPart]
          );

          cookData.events.push(6);
          cookData.values.push(0);
          cookData.datas.push(getRepayShareEncode);

          cookData = await actions.bentoDeposit(
            cookData,
            pairToken,
            userAddr,
            "0x00",
            "-0x01"
          );

          // 2
          const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["int256", "address", "bool"],
            [userBorrowPart, userAddr, false]
          );

          cookData.events.push(2);
          cookData.values.push(0);
          cookData.datas.push(repayEncode);
        }
      } else {
        if (this.cookHelper) {
          const depositEncode = await this.getDegenBoxDepositEncode(
            pairToken,
            userAddr,
            amount,
            "0"
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(depositEncode);

          //7
          const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["int256"],
            [amount.sub("1")]
          );

          cookData.events.push(7);
          cookData.values.push(0);
          cookData.datas.push(getRepayPartEncode);

          const repayEncode = await this.getRepayPartEncode(
            userAddr,
            pool.contractInstance.address,
            amount,
            true
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(repayEncode);
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            pairToken,
            userAddr,
            amount,
            "0x0"
          );

          //7
          const getRepayPartEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["int256"],
            [amount.sub("1")]
          );

          cookData.events.push(7);
          cookData.values.push(0);
          cookData.datas.push(getRepayPartEncode);

          //2
          const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["int256", "address", "bool"],
            ["-0x01", userAddr, false]
          );

          cookData.events.push(2);
          cookData.values.push(0);
          cookData.datas.push(repayEncode);
        }
      }

      if (isApprowed && this.cookHelper)
        cookData = await this.temporaryRevokeApprovalBlockHelper(pool.cookData);

      try {
        await cook(pool.contractInstance, cookData, 0);
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
      const tokenAddr = itsDefaultBalance
        ? this.defaultTokenAddress
        : pool.collateralToken.address;
      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      const swapperAddres = pool.levSwapperContract.address;
      const userAddr = this.account;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (this.needWhitelisterApprove) {
        const whitelistedCallData = await this.getWhitelistCallData();

        cookData.events.push(30);
        cookData.values.push(0);
        cookData.datas.push(whitelistedCallData);
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

        cookData.events.push(20);
        cookData.values.push(collateralValue);
        cookData.datas.push(getDepositEncode1);

        cookData.events.push(10);
        cookData.values.push(0);
        cookData.datas.push(getCollateralEncode2);
      }

      //5
      const getBorrowSwapperEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, swapperAddres]
      );

      cookData.events.push(5);
      cookData.values.push(0);
      cookData.datas.push(getBorrowSwapperEncode2);

      let swapStaticTx, swapCallByte, getCallEncode2;

      if (pool.is0xSwap) {
        const response = await swap0xRequest(
          this.chainId,
          pool.collateralToken.address,
          pool.borrowToken.address,
          slipage,
          amount,
          pool.levSwapperContract.address
        );

        const swapData = response.data;
        swapStaticTx = await pool.levSwapperContract.populateTransaction.swap(
          userAddr,
          minExpected,
          amount,
          swapData,
          {
            gasLimit: 1000000000,
          }
        );
        swapCallByte = swapStaticTx.data;

        //30
        getCallEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [swapperAddres, swapCallByte, false, false, 2]
        );
      } else {
        swapStaticTx = await pool.levSwapperContract.populateTransaction.swap(
          userAddr,
          minExpected,
          0,
          {
            gasLimit: 1000000000,
          }
        );
        swapCallByte = swapStaticTx.data.substr(0, 138);

        //30
        getCallEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [swapperAddres, swapCallByte, false, true, 2]
        );
      }

      cookData.events.push(30);
      cookData.values.push(0);
      cookData.datas.push(getCallEncode2);

      cookData.events.push(10);
      cookData.values.push(0);
      cookData.datas.push(getCollateralEncode2);

      try {
        await cook(pool.contractInstance, cookData, collateralValue);

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

    async cookMultiBorrowXswapper(
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
      notificationId,
      isWrap
    ) {
      const { lpAddress, tokenWrapper } = pool.lpLogic;

      const collateralAddr = isWrap ? lpAddress : pool.collateralToken.address;
      console.log("isWRAP", isWrap);
      console.log("collateralAddr", collateralAddr);

      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (this.needWhitelisterApprove) {
        const whitelistedCallData = await this.getWhitelistCallData();

        cookData.events.push(30);
        cookData.values.push(0);
        cookData.datas.push(whitelistedCallData);
      }

      //20 deposit in degenbox
      const getDepositEncode1 = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "int256", "int256"],
        [collateralAddr, this.account, collateralAmount, "0"]
      );

      cookData.events.push(20);
      cookData.values.push(0);
      cookData.datas.push(getDepositEncode1);

      // 30 wrap and deposit to cauldron
      if (isWrap) {
        try {
          cookData = await actions.bentoWithdraw(
            cookData,
            collateralAddr,
            tokenWrapper,
            collateralAmount,
            "0"
          );

          const wrapStaticTx =
            await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
              pool.contractInstance.address,
              collateralAmount
            );

          const lpCallEncode = this.$ethers.utils.defaultAbiCoder.encode(
            ["address", "bytes", "bool", "bool", "uint8"],
            [tokenWrapper, wrapStaticTx.data, true, false, 2]
          );

          cookData.events.push(30);
          cookData.values.push(0);
          cookData.datas.push(lpCallEncode);

          //10 add collateral
          const getCollateralEncode2 =
            this.$ethers.utils.defaultAbiCoder.encode(
              ["int256", "address", "bool"],
              ["-2", this.account, true]
            );

          cookData.events.push(10);
          cookData.values.push(0);
          cookData.datas.push(getCollateralEncode2);
        } catch (error) {
          console.log("Error wrap and deposit to cauldron", error);
        }
      } else {
        //10 add collateral
        const getCollateralEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          ["-2", this.account, false]
        );

        cookData.events.push(10);
        cookData.values.push(0);
        cookData.datas.push(getCollateralEncode2);
      }

      //5 Borrow
      const getBorrowSwapperEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address"],
        [amount, pool.levSwapperContract.address]
      );

      cookData.events.push(5);
      cookData.values.push(0);
      cookData.datas.push(getBorrowSwapperEncode2);

      // Swap MIM
      try {
        let swapData;

        if (this.isGlp) {
          const response = await swap0xRequest(
            this.chainId,
            usdcAddress,
            pool.borrowToken.address,
            slipage,
            amount,
            pool.levSwapperContract.address
          );

          swapData = response.data;
        } else swapData = await getLev0xData(amount, pool, slipage);

        const swapStaticTx =
          await pool.levSwapperContract.populateTransaction.swap(
            this.account,
            minExpected,
            amount,
            swapData,
            {
              gasLimit: 1000000000,
            }
          );

        //30 swap
        const getCallEncode2 = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bool", "bool", "uint8"],
          [pool.levSwapperContract.address, swapStaticTx.data, false, false, 2]
        );

        cookData.events.push(30);
        cookData.values.push(0);
        cookData.datas.push(getCallEncode2);
      } catch (error) {
        console.log("Error swap", error);
      }

      const getCollateralEncode3 = this.$ethers.utils.defaultAbiCoder.encode(
        ["int256", "address", "bool"],
        ["-2", this.account, false]
      );

      cookData.events.push(10);
      cookData.values.push(0);
      cookData.datas.push(getCollateralEncode3);

      try {
        await cook(pool.contractInstance, cookData, collateralValue);

        await this.$store.commit("notifications/delete", notificationId);
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("cookMultiBorrowXswapper Error:", e);

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

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      // 4
      const removeCollateralToSwapper =
        this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address"],
          [collateralAmount, reverseSwapperAddr]
        );

      cookData.events.push(4);
      cookData.values.push(0);
      cookData.datas.push(removeCollateralToSwapper);

      let swapStaticTx;
      if (pool.is0xSwap) {
        const response = await swap0xRequest(
          this.chainId,
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
            gasLimit: 1000000000,
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
            gasLimit: 1000000000,
          }
        );
      }

      const swapCallByte = swapStaticTx.data;

      // 30
      const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [reverseSwapperAddr, swapCallByte, false, false, 2]
      );

      cookData.events.push(30);
      cookData.values.push(0);
      cookData.datas.push(callEncode);

      if (itsMax) {
        // 2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          [userBorrowPart, userAddr, false]
        );

        cookData.events.push(2);
        cookData.values.push(0);
        cookData.datas.push(repayEncode);
      } else {
        // 2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          [borrowAmount, userAddr, false]
        );

        cookData.events.push(2);
        cookData.values.push(0);
        cookData.datas.push(repayEncode);
      }

      if (+removeCollateralAmount > 0) {
        // 4
        const removeCollateralFinal = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address"],
          [removeCollateralAmount, userAddr]
        );

        cookData.events.push(4);
        cookData.values.push(0);
        cookData.datas.push(removeCollateralFinal);

        cookData = await actions.bentoWithdraw(
          cookData,
          collateralTokenAddr,
          userAddr,
          "0x00",
          removeCollateralAmount
        );
      }

      try {
        await cook(pool.contractInstance, cookData, 0);

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

    async cookFlashRepayXswapper(
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
      const reverseSwapperAddr = pool.liqSwapperContract.address;
      const userBorrowPart = pool.userInfo.contractBorrowPart;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      const approvalResult = await this.temporaryApprovalBlockHelper(
        pool,
        isApprowed
      );

      cookData.events.push(approvalResult.events);
      cookData.values.push(approvalResult.values);
      cookData.datas.push(approvalResult.datas);

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      //4 remove collateral to swapper
      const removeCollateralToSwapper =
        this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address"],
          [collateralAmount, reverseSwapperAddr]
        );

      cookData.events.push(4);
      cookData.values.push(0);
      cookData.datas.push(removeCollateralToSwapper);

      let swapData;

      if (this.isGlp) {
        const GmxLensContract = new this.$ethers.Contract(
          gmxLensAddress,
          JSON.stringify(gmxLensAbi),
          this.signer
        );

        const glpAmount = await pool.collateralToken.contract.convertToAssets(
          collateralAmount
        );

        const usdcAmount = await GmxLensContract.getTokenOutFromBurningGlp(
          usdcAddress,
          glpAmount
        );

        const response = await swap0xRequest(
          this.chainId,
          pool.borrowToken.address,
          usdcAddress,
          slipage,
          usdcAmount,
          pool.liqSwapperContract.address
        );

        swapData = response.data;
      } else swapData = await getLiq0xData(collateralAmount, pool, slipage);

      const swapStaticTx =
        await pool.liqSwapperContract.populateTransaction.swap(
          pool.collateralToken.address,
          pool.borrowToken.address,
          account,
          0,
          collateralAmount,
          swapData,
          {
            gasLimit: 1000000000,
          }
        );

      const swapCallByte = swapStaticTx.data;

      // 30 swap
      const callEncode = this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes", "bool", "bool", "uint8"],
        [reverseSwapperAddr, swapCallByte, false, false, 2]
      );

      cookData.events.push(30);
      cookData.values.push(0);
      cookData.datas.push(callEncode);

      if (itsMax) {
        // 2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          [userBorrowPart, account, false]
        );

        cookData.events.push(2);
        cookData.values.push(0);
        cookData.datas.push(repayEncode);
      } else {
        // 2
        const repayEncode = this.$ethers.utils.defaultAbiCoder.encode(
          ["int256", "address", "bool"],
          [borrowAmount, account, false]
        );

        cookData.events.push(2);
        cookData.values.push(0);
        cookData.datas.push(repayEncode);
      }

      if (+removeCollateralAmount > 0) {
        const {
          lpRemoveCollateralEventsArray,
          lpRemoveCollateralValuesArray,
          lpRemoveCollateralDatasArray,
        } = await this.getLpCookRemoveCollateralData(
          pool,
          removeCollateralAmount,
          account
        );

        cookData.events.push(...lpRemoveCollateralEventsArray);
        cookData.values.push(...lpRemoveCollateralValuesArray);
        cookData.datas.push(...lpRemoveCollateralDatasArray);
      }

      try {
        await cook(pool.contractInstance, cookData, 0);

        await this.$store.commit("notifications/delete", notificationId);
        this.$store.commit("setPopupState", {
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("cookFlashRepayXswapper Error:", e);

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
