import { actions } from "@/helpers/cauldron/cook/actions";
import cookHelperAbi from "@/utils/abi/cookHelperAbi";

export default {
  computed: {
    // TODO: move to config
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
  },
  methods: {
    async repayEncodeHandler(
      cookData,
      cauldron,
      part,
      to,
      skim = false,
      useValue1 = false,
      useValue2 = false,
      returnValues = 0
    ) {
      if (!this.cookHelper)
        return await actions.repay(cookData, part, to, skim);
      return await this.getRepayPartEncode(
        cookData,
        to,
        cauldron,
        part,
        useValue1,
        useValue2,
        returnValues
      );
    },

    async bentoDepositEncodeHandler(
      cookData,
      token,
      to,
      amount,
      share,
      useValue1 = false,
      useValue2 = false,
      returnValues = 0
    ) {
      if (!this.cookHelper)
        await actions.bentoWithdraw(cookData, token, to, amount, share);
      return await this.getDegenBoxDepositEncode(
        cookData,
        token,
        to,
        amount,
        share,
        useValue1,
        useValue2,
        returnValues
      );
    },

    async bentoWithdrawEncodeHandler(
      cookData,
      token,
      to,
      amount,
      share,
      useValue1 = false,
      useValue2 = false,
      returnValues = 0
    ) {
      if (!this.cookHelper)
        await actions.bentoDeposit(cookData, token, to, amount, share);
      return await this.degenBoxWithdrawEncode(
        cookData,
        token,
        to,
        amount,
        share,
        useValue1,
        useValue2,
        returnValues
      );
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
            share
          );

        const degenBoxDepositByte = degenBoxDepositTx.data;

        console.log("data", degenBoxDepositByte);

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
            share
          );

        const degenBoxWithdrawByte = degenBoxWithdrawTx.data;

        console.log("data", degenBoxWithdrawByte);

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
      useValue1 = false,
      useValue2 = false,
      returnValues = 0
    ) {
      try {
        const repayPartTx = await this.cookHelper.populateTransaction.repayPart(
          toAddress,
          cauldronAddress,
          part
        );

        const repayPartByte =
          useValue1 || useValue2
            ? repayPartTx.data.substr(0, 138)
            : repayPartTx.data;

        cookData = await actions.call(
          cookData,
          this.cookHelper.address,
          repayPartByte,
          useValue1,
          useValue2,
          returnValues
        );

        return cookData;
      } catch (error) {
        console.log("getRepayPartEncode err:", error);
      }
    },
  },
};
