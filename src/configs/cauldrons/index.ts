import ethereumCauldrons from "@/configs/cauldrons/ethereumCauldrons";
import fantomCauldrons from "@/configs/cauldrons/fantomCauldrons";
import avalancheCauldrons from "@/configs/cauldrons/avalancheCauldrons";
import arbitrumCauldrons from "@/configs/cauldrons/arbitrumCauldrons";
import bscCauldrons from "@/configs/cauldrons/bscCauldrons";
import optimismCauldrons from "@/configs/cauldrons/optimismCauldrons";
import kavaCauldrons from "@/configs/cauldrons/kavaCauldrons";
import beraCauldrons from "@/configs/cauldrons/beraCauldrons";
// import blastSepoliaCauldrons from "@/configs/cauldrons/blastSepoliaCauldrons";
import blastCauldrons from "@/configs/cauldrons/blastCauldrons";

export default [
  ...ethereumCauldrons,
  ...fantomCauldrons,
  ...avalancheCauldrons,
  ...arbitrumCauldrons,
  ...bscCauldrons,
  ...optimismCauldrons,
  ...kavaCauldrons,
  ...beraCauldrons,
  // ...blastSepoliaCauldrons,
  ...blastCauldrons
];
