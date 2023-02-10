// WARNING: can only be used inside cook.js

export default {
  methods: {
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
    async temporaryApprovalBlockHelperSpecial(cookData, pool) {
      const isCookHelperApproved = await this.isCookHelperApprowed(pool);

      if (!isCookHelperApproved) {
        const approvalEncode = await this.getApprovalEncode(pool, true, true);

        cookData.events.push(24);
        cookData.values.push(0);
        cookData.datas.push(approvalEncode);
      }

      return cookData;
    },
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

    async cookCollateralAndBorrowSpecial(
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

      cookData = await this.temporaryApprovalBlockHelperSpecial(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (isLpLogic && isWrap) {
        cookData = await actions.borrow(cookData, amount, userAddr);

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          pairToken,
          userAddr,
          amount.sub("1"),
          "0x0"
        );

        const { lpAddress, tokenWrapper } = pool.lpLogic;

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

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          pairToken,
          userAddr,
          amount.sub("1"),
          "0x0"
        );

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

    async cookAddCollateralSpecial(
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

      cookData = await this.temporaryApprovalBlockHelperSpecial(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (isLpLogic && isWrap) {
        const { lpAddress, tokenWrapper } = pool.lpLogic;

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

    async cookBorrowSpecial(
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

      cookData = await this.temporaryApprovalBlockHelperSpecial(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (this.needWhitelisterApprove) {
        cookData = await this.getWhitelistCallData(cookData);
      }

      cookData = await actions.borrow(cookData, amount, userAddr);

      cookData = await this.degenBoxWithdrawEncode(
        cookData,
        pairToken,
        userAddr,
        amount.sub("1"),
        "0x0"
      );

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

    async cookRemoveAndRepayMaxSpecial(
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

      cookData = await this.temporaryApprovalBlockHelperSpecial(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

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

      if (pool.lpLogic) {
        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          pool.collateralToken.address,
          tokenWrapper,
          "0",
          amount
        );

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

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          lpAddress,
          userAddr,
          amount,
          "0"
        );
      } else {
        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          tokenAddr,
          userAddr,
          "0x00",
          amount
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
        console.log("CookRemoveAndRepayMax ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async cookRemoveAndRepaySpecial(
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

      cookData = await this.temporaryApprovalBlockHelperSpecial(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (pool.lpLogic) {
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

        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          pool.collateralToken.address,
          tokenWrapper,
          "0",
          amount
        );

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

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          lpAddress,
          userAddr,
          amount,
          "0"
        );
      } else {
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

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          tokenAddr,
          userAddr,
          "0x00",
          amount
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
        console.log("CookRemoveAndRepay ERR:", e);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async cookRemoveCollateralSpecial(
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

      cookData = await this.temporaryApprovalBlockHelperSpecial(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (pool.lpLogic) {
        const { tokenWrapper, lpAddress } = pool.lpLogic;

        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          pool.collateralToken.address,
          tokenWrapper,
          "0",
          amount
        );

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

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          lpAddress,
          userAddr,
          amount,
          "0"
        );
      } else {
        cookData = await actions.removeCollateral(cookData, amount, userAddr);

        cookData = await this.degenBoxWithdrawEncode(
          cookData,
          tokenAddr,
          userAddr,
          "0x00",
          amount
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
        console.log("CookRemoveCollateral ERR:", e.code);

        const errorNotification = {
          msg: await notificationErrorMsg(e),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async cookRepayMimSpecial(
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

      cookData = await this.temporaryApprovalBlockHelperSpecial(
        cookData,
        pool,
        isApprowed
      );

      if (updatePrice)
        cookData = await actions.updateExchangeRate(cookData, true);

      if (itsMax) {
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
  },
};
