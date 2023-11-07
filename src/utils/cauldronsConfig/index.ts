import ethereumCauldrons from "@/utils/cauldronsConfig/ethereumCauldrons";
import fantomCauldrons from "@/utils/cauldronsConfig/fantomCauldrons";
import avalancheCauldrons from "@/utils/cauldronsConfig/avalancheCauldrons";
import arbitrumCauldrons from "@/utils/cauldronsConfig/arbitrumCauldrons";
import bscCauldrons from "@/utils/cauldronsConfig/bscCauldrons";
import optimismCauldrons from "@/utils/cauldronsConfig/optimismCauldrons";
import kavaCauldrons from "@/utils/cauldronsConfig/kavaCauldrons";

export default [
  ...ethereumCauldrons,
  ...fantomCauldrons,
  ...avalancheCauldrons,
  ...arbitrumCauldrons,
  ...bscCauldrons,
  ...optimismCauldrons,
  ...kavaCauldrons,
];
