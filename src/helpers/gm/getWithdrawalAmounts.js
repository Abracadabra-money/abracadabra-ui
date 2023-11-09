import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";
import { Contract } from "ethers";

const getWithdrawalAmounts = async (amount, signer) => {
  const GMXReader = "0xf60becbba223EEA9495Da3f606753867eC10d139";
  const market = "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8";
  const GMXReaderContract = new Contract(GMXReader, GMXReaderAbi, signer);

  const marketTuple = await GMXReaderContract.getMarket(market);
  const uiFeeReceiver = "0x0000000000000000000000000000000000000000";

  // ....
};

export default getWithdrawalAmounts;
