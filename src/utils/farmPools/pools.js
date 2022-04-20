import mainnetPools from "@/utils/farmPools/mainnetPools";
import arbitrumPools from "@/utils/farmPools/arbitrumPools";
import fantomPools from "@/utils/farmPools/fantomPools";
import avaxPools from "@/utils/farmPools/avaxPools";

export default [
  ...mainnetPools,
  ...arbitrumPools,
  ...fantomPools,
  ...avaxPools,
];
