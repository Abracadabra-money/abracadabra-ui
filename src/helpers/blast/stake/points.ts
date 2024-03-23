import axios from "axios";
import type { Address } from "viem";

const GRAPHQL =
  "https://ymlcxloffmrsfereuhfa.supabase.co/graphql/v1?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbGN4bG9mZm1yc2ZlcmV1aGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NTM4MDMsImV4cCI6MjAyNTEyOTgwM30.hhfUPn4fw9WUdRpeXDIk6s5LskQ1HM4qMZy6G5AKjsk";

export const fetchPointsStatistics = async () => {
  try {
    const query = `{
        distributionAmountSum
        pendingDistributionAmountSum
        distributionAmountSumFromUsdbUnlockedLle: distributionAmountSumByReason(reason: "lle_deposit_usdb")
        pendingDistributionAmountSumFromUsdbUnlockedLle: pendingDistributionAmountSumByReason(reason: "lle_deposit_usdb")
        distributionAmountSumFromMimUnlockedLle: distributionAmountSumByReason(reason: "lle_deposit_mim")
        pendingDistributionAmountSumFromMimUnlockedLle: pendingDistributionAmountSumByReason(reason: "lle_deposit_mim")
        distributionAmountSumFromCauldron: distributionAmountSumByReason(reason: "cauldron_deposit_weth")
        pendingDistributionAmountSumFromCauldron: pendingDistributionAmountSumByReason(reason: "cauldron_deposit_weth")
        distributionAmountSumFromUsdbLockedLle: distributionAmountSumByReason(reason: "lle_lock_usdb")
        pendingDistributionAmountSumFromUsdbLockedLle: pendingDistributionAmountSumByReason(reason: "lle_lock_usdb")
        distributionAmountSumFromMimLockedLle: distributionAmountSumByReason(reason: "lle_lock_mim")
        pendingDistributionAmountSumFromMimLockedLle: pendingDistributionAmountSumByReason(reason: "lle_lock_mim")
        distributionAmountSumFromDepositBorrowedMimLle: distributionAmountSumByReason(reason: "lle_deposit_borrowed_mim")
        pendingDistributionAmountSumFromDepositBorrowedMimLle: pendingDistributionAmountSumByReason(reason: "lle_deposit_borrowed_mim")
        distributionAmountSumFromMimUsdbLpUnlocked: distributionAmountSumByReason(reason: "deposit_mim_usdb_lp")
        pendingDistributionAmountSumFromMimUsdbLpUnlocked: pendingDistributionAmountSumByReason(reason: "deposit_mim_usdb_lp")
        distributionAmountSumFromFounder: distributionAmountSumByReason(reason: "founder")
        pendingDistributionAmountSumFromFounder: pendingDistributionAmountSumByReason(reason: "founder")
      }`;

    const {
      data: { data },
    } = await axios.post(GRAPHQL, { query });

    const lleUnlockedKeys = [
      "distributionAmountSumFromUsdbUnlockedLle",
      "distributionAmountSumFromMimUnlockedLle",
      "distributionAmountSumFromDepositBorrowedMimLle",
    ];
    const pendingLleUnlockedKeys = [
      "pendingDistributionAmountSumFromUsdbUnlockedLle",
      "pendingDistributionAmountSumFromMimUnlockedLle",
      "pendingDistributionAmountSumFromDepositBorrowedMimLle",
    ];
    const lleLockedKeys = [
      "distributionAmountSumFromUsdbLockedLle",
      "distributionAmountSumFromMimLockedLle",
    ];
    const pendingLleLockedKeys = [
      "pendingDistributionAmountSumFromUsdbLockedLle",
      "pendingDistributionAmountSumFromMimLockedLle",
    ];

    const unlocked = lleUnlockedKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);
    const pendingUnlocked = pendingLleUnlockedKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);
    const locked = lleLockedKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);
    const pendingLocked = pendingLleLockedKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);

    return {
      total: Number(data.distributionAmountSum),
      totalPending: Number(data.pendingDistributionAmountSum),
      unlocked,
      pendingUnlocked,
      locked,
      pendingLocked,
      cauldron: Number(data.distributionAmountSumFromCauldron),
      pendingCauldron: Number(data.pendingDistributionAmountSumFromCauldron),
      lp: Number(data.distributionAmountSumFromMimUsdbLpUnlocked),
      pendingLp: Number(data.pendingDistributionAmountSumFromMimUsdbLpUnlocked),
      founder: Number(data.distributionAmountSumFromFounder),
      pendingFounder: Number(data.pendingDistributionAmountSumFromFounder),
    };
  } catch (error) {
    console.log("Error fetching points statistics", error);
    return {
      //todo Hardcoded just in case if graph wouldn`t be fixed 
      total: 102900000,
      totalPending: 0,
      unlocked: 0,
      pendingUnlocked: 0,
      locked: 0,
      pendingLocked: 0,
      cauldron: 0,
      pendingCauldron: 0,
      lp: 0,
      pendingLp: 0,
      founder: 0,
      pendingFounder: 0,
    };
  }
};

export const fetchUserPointsStatistics = async (address: Address) => {
  if (!address)
    return {
      total: 0,
      totalPending: 0,
      unlocked: 0,
      pendingUnlocked: 0,
      locked: 0,
      pendingLocked: 0,
      cauldron: 0,
      pendingCauldron: 0,
      lp: 0,
      pendingLp: 0,
      founder: 0,
      pendingFounder: 0,
    };

  try {
    const query = `{
        distributionAmountSumByAddress(address: "${address.toLowerCase()}")
        pendingDistributionAmountSumByAddress(address: "${address.toLowerCase()}")
        distributionAmountSumByAddressFromUsdbUnlockedLle: distributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_deposit_usdb")
        pendingDistributionAmountSumByAddressFromUsdbUnlockedLle: pendingDistributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_deposit_usdb")
        distributionAmountSumByAddressFromMimUnlockedLle: distributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_deposit_mim")
        pendingDistributionAmountSumByAddressFromMimUnlockedLle: pendingDistributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_deposit_mim")
        distributionAmountSumByAddressFromCauldron: distributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "cauldron_deposit_weth")
        pendingDistributionAmountSumByAddressFromCauldron: pendingDistributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "cauldron_deposit_weth")
        distributionAmountSumByAddressFromUsdbLockedLle: distributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_lock_usdb")
        pendingDistributionAmountSumByAddressFromUsdbLockedLle: pendingDistributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_lock_usdb")
        distributionAmountSumByAddressFromMimLockedLle: distributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_lock_mim")
        pendingDistributionAmountSumByAddressFromMimLockedLle: pendingDistributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_lock_mim")
        distributionAmountSumByAddressFromDepositBorrowedMimLle: distributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_deposit_borrowed_mim")
        pendingDistributionAmountSumByAddressFromDepositBorrowedMimLle: pendingDistributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "lle_deposit_borrowed_mim")
        distributionAmountSumByAddressFromMimUsdbLpUnlocked: distributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "deposit_mim_usdb_lp")
        pendingDistributionAmountSumByAddressFromMimUsdbLpUnlocked: pendingDistributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "deposit_mim_usdb_lp")
        distributionAmountSumByAddressFromFounder: distributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "founder")
        pendingDistributionAmountSumByAddressFromFounder: pendingDistributionAmountSumByAddressByReason(address: "${address.toLowerCase()}", reason: "founder")
      }`;

    const {
      data: { data },
    } = await axios.post(GRAPHQL, { query });

    const lleUnlockedKeys = [
      "distributionAmountSumByAddressFromUsdbUnlockedLle",
      "distributionAmountSumByAddressFromMimUnlockedLle",
      "distributionAmountSumByAddressFromDepositBorrowedMimLle",
    ];
    const pendingLleUnlockedKeys = [
      "pendingDistributionAmountSumByAddressFromUsdbUnlockedLle",
      "pendingDistributionAmountSumByAddressFromMimUnlockedLle",
      "pendingDistributionAmountSumByAddressFromDepositBorrowedMimLle",
    ];
    const lleLockedKeys = [
      "distributionAmountSumByAddressFromUsdbLockedLle",
      "distributionAmountSumByAddressFromMimLockedLle",
    ];
    const pendingLleLockedKeys = [
      "pendingDistributionAmountSumByAddressFromUsdbLockedLle",
      "pendingDistributionAmountSumByAddressFromMimLockedLle",
    ];

    const unlocked = lleUnlockedKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);
    const pendingUnlocked = pendingLleUnlockedKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);
    const locked = lleLockedKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);
    const pendingLocked = pendingLleLockedKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);

    return {
      total: Number(data.distributionAmountSumByAddress),
      totalPending: Number(data.pendingDistributionAmountSumByAddress),
      unlocked,
      pendingUnlocked,
      locked,
      pendingLocked,
      cauldron: Number(data.distributionAmountSumByAddressFromCauldron),
      pendingCauldron: Number(
        data.pendingDistributionAmountSumByAddressFromCauldron
      ),
      lp: Number(data.distributionAmountSumByAddressFromMimUsdbLpUnlocked),
      pendingLp: Number(
        data.pendingDistributionAmountSumByAddressFromMimUsdbLpUnlocked
      ),
      founder: Number(data.distributionAmountSumByAddressFromFounder),
      pendingFounder: Number(
        data.pendingDistributionAmountSumByAddressFromFounder
      ),
    };
  } catch (error) {
    console.log("Error fetching user points statistics", error);
    return {
      total: 0,
      totalPending: 0,
      unlocked: 0,
      pendingUnlocked: 0,
      locked: 0,
      pendingLocked: 0,
      cauldron: 0,
      pendingCauldron: 0,
      lp: 0,
      pendingLp: 0,
      founder: 0,
      pendingFounder: 0,
    };
  }
};
