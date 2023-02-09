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
      cookData,
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

        cookData = await actions.call(
          cookData,
          this.cookHelper.address,
          degenBoxDepositByte,
          useValue1,
          useValue2,
          returnValues
        );

        return cookData;
      } catch (error) {
        console.log("getDegenBoxDepositEncode err:", error);
      }
    },

    async degenBoxWithdrawEncode(
      cookData,
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

        cookData = await actions.call(
          cookData,
          this.cookHelper.address,
          degenBoxWithdrawByte,
          useValue1,
          useValue2,
          returnValues
        );

        return cookData;
      } catch (error) {
        console.log("degenBoxWithdrawEncode err:", error);
      }
    },

    async getRepayPartEncode(
      cookData,
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

        cookData = await actions.call(
          cookData,
          this.cookHelper.address,
          repayPartByte,
          useValue1,
          false,
          0
        );

        return cookData;
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

    async temporaryGetCookCommonBaseData(
      cookData,
      pool,
      isApprowed,
      updatePrice
    ) {
      cookData = await this.temporaryApprovalBlockHelper(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      return cookData;
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

    async getWhitelistCallData(cookData) {
      try {
        const whitelistedInfo = this.selectedPool.userInfo?.whitelistedInfo;

        const data = await getSetMaxBorrowData(
          whitelistedInfo.whitelisterContract,
          this.account,
          whitelistedInfo.userWhitelistedInfo.userBorrowPart,
          whitelistedInfo.userWhitelistedInfo.proof
        );

        cookData = await actions.call(
          cookData,
          whitelistedInfo.whitelisterContract.address,
          data,
          false,
          false,
          0
        );
        return cookData;
      } catch (e) {
        console.log("getWhitelistCallData error:", e);
      }
    },

    async temporaryApprovalBlockHelper(cookData, pool, isApprowed) {
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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (isLpLogic && isWrap) {
        cookData = await actions.borrow(cookData, amount, userAddr);

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            pairToken,
            userAddr,
            amount.sub("1"),
            "0x0"
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            pairToken,
            userAddr,
            amount.sub("1"),
            "0x0"
          );
        }

        const { lpAddress, tokenWrapper } = pool.lpLogic;

        if (this.cookHelper) {
          const collateralToShare = await pool.masterContractInstance.toShare(
            lpAddress,
            collateralAmount,
            false
          );

          cookData = await this.getDegenBoxDepositEncode(
            cookData,
            lpAddress,
            userAddr,
            "0",
            collateralToShare
          );

          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            lpAddress,
            tokenWrapper,
            "0",
            collateralToShare
          );
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            lpAddress,
            userAddr,
            collateralAmount,
            "0"
          );
          cookData = await actions.bentoWithdraw(
            cookData,
            lpAddress,
            tokenWrapper,
            collateralAmount,
            "0"
          );
        }

        // 30
        // wrap and deposit to cauldron
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
            pool.contractInstance.address,
            collateralAmount
          );

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          swapStaticTx.data,
          true,
          false,
          2
        );
        cookData = await actions.addCollateral(cookData, "-2", userAddr, true);
      } else {
        cookData = await actions.borrow(cookData, amount, userAddr);

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            pairToken,
            userAddr,
            amount.sub("1"),
            "0x0"
          );
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

          cookData = await this.getDegenBoxDepositEncode(
            cookData,
            tokenAddr,
            pool.contractInstance.address,
            "0",
            collateralToShare,
            false,
            false,
            0
          );

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
            "0",
            collateralValue
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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (isLpLogic && isWrap) {
        const { lpAddress, tokenWrapper } = pool.lpLogic;

        if (this.cookHelper) {
          const collateralToShare = await pool.masterContractInstance.toShare(
            lpAddress,
            amount,
            false
          );

          cookData = await this.getDegenBoxDepositEncode(
            cookData,
            lpAddress,
            userAddr,
            "0",
            collateralToShare
          );

          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            lpAddress,
            tokenWrapper,
            "0",
            collateralToShare
          );
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            lpAddress,
            userAddr,
            amount,
            "0"
          );
          cookData = await actions.bentoWithdraw(
            cookData,
            lpAddress,
            tokenWrapper,
            amount,
            "0"
          );
        }

        // 30
        // wrap and deposit to cauldron
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.wrap(
            pool.contractInstance.address,
            amount
          );

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          swapStaticTx.data,
          true,
          false,
          2
        );
        cookData = await actions.addCollateral(cookData, "-2", userAddr, true);
      } else {
        if (this.cookHelper) {
          const collateralToShare = await pool.masterContractInstance.toShare(
            tokenAddr,
            amount,
            false
          );

          cookData = await this.getDegenBoxDepositEncode(
            cookData,
            tokenAddr,
            pool.contractInstance.address,
            "0",
            collateralToShare,
            false,
            false,
            0
          );

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
            "0",
            collateralValue
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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (this.needWhitelisterApprove) {
        cookData = await this.getWhitelistCallData(cookData);
      }

      cookData = await actions.borrow(cookData, amount, userAddr);

      if (this.cookHelper) {
        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          pairToken,
          userAddr,
          amount.sub("1"),
          "0x0"
        );
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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (this.cookHelper) {
        const userBorrowShare = await pool.masterContractInstance.toShare(
          pairToken,
          userBorrowPart,
          false
        );

        cookData = await this.getDegenBoxDepositEncode(
          cookData,
          pairToken,
          userAddr,
          "0x00",
          userBorrowShare
        );

        cookData = await this.getRepayPartEncode(
          cookData,
          userAddr,
          pool.contractInstance.address,
          userBorrowPart
        );
      } else {
        cookData = await actions.getRepayShare(cookData, userBorrowPart);

        cookData = await actions.bentoDeposit(
          cookData,
          pairToken,
          userAddr,
          "0x00",
          "-0x01"
        );

        cookData = await actions.repay(
          cookData,
          userBorrowPart,
          userAddr,
          false
        );
      }

      if (pool.lpLogic) {
        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            pool.collateralToken.address,
            tokenWrapper,
            "0",
            amount
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            pool.collateralToken.address,
            tokenWrapper,
            "0",
            amount
          );
        }

        // 30 unwrap and deposit for alice in degenbox
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
            userAddr,
            amount
          );

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          swapStaticTx.data,
          false,
          false,
          2
        );

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            lpAddress,
            userAddr,
            amount,
            "0"
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            lpAddress,
            userAddr,
            amount,
            "0"
          );
        }
      } else {
        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );
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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (pool.lpLogic) {
        if (this.cookHelper) {
          cookData = await this.getDegenBoxDepositEncode(
            cookData,
            pairToken,
            userAddr,
            collateralAmount,
            "0"
          );

          cookData = await actions.getRepayPart(
            cookData,
            collateralAmount.sub("1")
          );

          cookData = await this.getRepayPartEncode(
            cookData,
            userAddr,
            pool.contractInstance.address,
            collateralAmount,
            true
          );
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            pairToken,
            userAddr,
            collateralAmount,
            "0x0"
          );
          cookData = await actions.getRepayPart(
            cookData,
            collateralAmount.sub("1")
          );
          cookData = await actions.repay(cookData, "-0x01", userAddr, false);
        }

        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            pool.collateralToken.address,
            tokenWrapper,
            "0",
            amount
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            pool.collateralToken.address,
            tokenWrapper,
            "0",
            amount
          );
        }

        // 30 unwrap and deposit for alice in degenbox
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
            userAddr,
            amount
          );

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          swapStaticTx.data,
          false,
          false,
          2
        );

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            lpAddress,
            userAddr,
            amount,
            "0"
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            lpAddress,
            userAddr,
            amount,
            "0"
          );
        }
      } else {
        if (this.cookHelper) {
          cookData = await this.getDegenBoxDepositEncode(
            cookData,
            pairToken,
            userAddr,
            collateralAmount,
            "0"
          );

          cookData = await actions.getRepayPart(
            cookData,
            collateralAmount.sub("1")
          );

          cookData = await this.getRepayPartEncode(
            cookData,
            userAddr,
            pool.contractInstance.address,
            collateralAmount,
            true
          );
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            pairToken,
            userAddr,
            collateralAmount,
            "0x0"
          );

          cookData = await actions.getRepayPart(
            cookData,
            collateralAmount.sub("1")
          );

          cookData = await actions.repay(cookData, "-0x01", userAddr, false);
        }

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );
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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (pool.lpLogic) {
        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            pool.collateralToken.address,
            tokenWrapper,
            "0",
            amount
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            pool.collateralToken.address,
            tokenWrapper,
            "0",
            amount
          );
        }

        // 30 unwrap and deposit for alice in degenbox
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
            userAddr,
            amount
          );

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          swapStaticTx.data,
          false,
          false,
          2
        );

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            lpAddress,
            userAddr,
            amount,
            "0"
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            lpAddress,
            userAddr,
            amount,
            "0"
          );
        }
      } else {
        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            tokenAddr,
            userAddr,
            "0x00",
            amount
          );
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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (itsMax) {
        if (this.cookHelper) {
          const userBorrowShare = await pool.masterContractInstance.toShare(
            pairToken,
            userBorrowPart,
            false
          );

          cookData = await this.getDegenBoxDepositEncode(
            cookData,
            pairToken,
            userAddr,
            "0x00",
            userBorrowShare
          );

          cookData = await this.getRepayPartEncode(
            cookData,
            userAddr,
            pool.contractInstance.address,
            userBorrowPart
          );
        } else {
          cookData = await actions.getRepayShare(cookData, userBorrowPart);

          cookData = await actions.bentoDeposit(
            cookData,
            pairToken,
            userAddr,
            "0x00",
            "-0x01"
          );

          cookData = await actions.repay(
            cookData,
            userBorrowPart,
            userAddr,
            false
          );
        }
      } else {
        if (this.cookHelper) {
          cookData = await this.getDegenBoxDepositEncode(
            cookData,
            pairToken,
            userAddr,
            amount,
            "0"
          );

          cookData = await actions.getRepayPart(cookData, amount.sub("1"));

          cookData = await this.getRepayPartEncode(
            cookData,
            userAddr,
            pool.contractInstance.address,
            amount,
            true
          );
        } else {
          cookData = await actions.bentoDeposit(
            cookData,
            pairToken,
            userAddr,
            amount,
            "0x0"
          );

          cookData = await actions.getRepayPart(cookData, amount.sub("1"));

          cookData = await actions.repay(cookData, "-0x01", userAddr, false);
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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (this.needWhitelisterApprove) {
        cookData = await this.getWhitelistCallData(cookData);
      }

      if (collateralAmount) {
        cookData = await actions.bentoDeposit(
          cookData,
          tokenAddr,
          userAddr,
          collateralAmount,
          "0",
          collateralValue
        );

        cookData = await actions.addCollateral(
          cookData,
          "-0x02",
          userAddr,
          false
        );
      }

      cookData = await actions.borrow(cookData, amount, swapperAddres);

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
        const swapStaticTx =
          await pool.levSwapperContract.populateTransaction.swap(
            userAddr,
            minExpected,
            amount,
            swapData,
            {
              gasLimit: 1000000000,
            }
          );
        const swapCallByte = swapStaticTx.data;

        cookData = await actions.call(
          cookData,
          swapperAddres,
          swapCallByte,
          false,
          false,
          2
        );
      } else {
        const swapStaticTx =
          await pool.levSwapperContract.populateTransaction.swap(
            userAddr,
            minExpected,
            0,
            {
              gasLimit: 1000000000,
            }
          );
        const swapCallByte = swapStaticTx.data.substr(0, 138);

        cookData = await actions.call(
          cookData,
          swapperAddres,
          swapCallByte,
          false,
          true,
          2
        );
      }

      cookData = await actions.addCollateral(
        cookData,
        "-0x02",
        userAddr,
        false
      );

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

      const collateralValue = itsDefaultBalance
        ? collateralAmount.toString()
        : 0;

      let cookData = {
        events: [],
        values: [],
        datas: [],
      };

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      if (this.needWhitelisterApprove) {
        cookData = await this.getWhitelistCallData(cookData);
      }

      cookData = await actions.bentoDeposit(
        cookData,
        collateralAddr,
        this.account,
        collateralAmount,
        "0"
      );

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

          cookData = await actions.call(
            cookData,
            tokenWrapper,
            wrapStaticTx.data,
            true,
            false,
            2
          );
          cookData = await actions.addCollateral(
            cookData,
            "-2",
            this.account,
            true
          );
        } catch (error) {
          console.log("Error wrap and deposit to cauldron", error);
        }
      } else {
        cookData = await actions.addCollateral(
          cookData,
          "-0x02",
          this.account,
          false
        );
      }

      cookData = await actions.borrow(
        cookData,
        amount,
        pool.levSwapperContract.address
      );

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

        cookData = await actions.call(
          cookData,
          pool.levSwapperContract.address,
          swapStaticTx.data,
          false,
          false,
          2
        );
      } catch (error) {
        console.log("Error swap", error);
      }

      cookData = await actions.addCollateral(
        cookData,
        "-2",
        this.account,
        false
      );

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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await actions.removeCollateral(
        cookData,
        collateralAmount,
        reverseSwapperAddr
      );

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

      cookData = await actions.call(
        cookData,
        reverseSwapperAddr,
        swapCallByte,
        false,
        false,
        2
      );

      if (itsMax) {
        cookData = await actions.repay(
          cookData,
          userBorrowPart,
          userAddr,
          false
        );
      } else {
        cookData = await actions.repay(cookData, borrowAmount, userAddr, false);
      }

      if (+removeCollateralAmount > 0) {
        cookData = await actions.removeCollateral(
          cookData,
          removeCollateralAmount,
          userAddr
        );

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

      cookData = await this.temporaryGetCookCommonBaseData(
        cookData,
        pool,
        isApprowed,
        updatePrice
      );

      cookData = await actions.removeCollateral(
        cookData,
        collateralAmount,
        reverseSwapperAddr
      );

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

      cookData = await actions.call(
        cookData,
        reverseSwapperAddr,
        swapCallByte,
        false,
        false,
        2
      );

      if (itsMax) {
        cookData = await actions.repay(
          cookData,
          userBorrowPart,
          account,
          false
        );
      } else {
        cookData = await actions.repay(cookData, borrowAmount, account, false);
      }

      if (+removeCollateralAmount > 0) {
        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(
          cookData,
          removeCollateralAmount,
          account
        );

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            pool.collateralToken.address,
            tokenWrapper,
            "0",
            removeCollateralAmount
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            pool.collateralToken.address,
            tokenWrapper,
            "0",
            removeCollateralAmount
          );
        }

        // 30 unwrap and deposit for alice in degenbox
        const swapStaticTx =
          await pool.lpLogic.tokenWrapperContract.populateTransaction.unwrap(
            account,
            removeCollateralAmount
          );

        cookData = await actions.call(
          cookData,
          tokenWrapper,
          swapStaticTx.data,
          false,
          false,
          2
        );

        if (this.cookHelper) {
          cookData = await this.degenBoxWithdrawEncode(
            cookData,
            lpAddress,
            account,
            removeCollateralAmount,
            "0"
          );
        } else {
          cookData = await actions.bentoWithdraw(
            cookData,
            lpAddress,
            account,
            removeCollateralAmount,
            "0"
          );
        }
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
