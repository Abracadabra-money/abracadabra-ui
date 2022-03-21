import mainnetPools from "@/utils/borrowPools/mainnetPools";
import fantomPools from "@/utils/borrowPools/fantomPools";
import avalanchePools from "@/utils/borrowPools/avalanchePools";
import arbitrumPools from "@/utils/borrowPools/arbitrumPools";
import bscPools from "@/utils/borrowPools/bscPools";

export default [
  ...mainnetPools,
  ...fantomPools,
  ...avalanchePools,
  ...arbitrumPools,
  ...bscPools,
];
