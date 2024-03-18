import axios from "axios";
import type { Address } from "viem";

const GRAPHQL =
  "https://ymlcxloffmrsfereuhfa.supabase.co/graphql/v1?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbGN4bG9mZm1yc2ZlcmV1aGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NTM4MDMsImV4cCI6MjAyNTEyOTgwM30.hhfUPn4fw9WUdRpeXDIk6s5LskQ1HM4qMZy6G5AKjsk";

export const fetchPointsStatistics = async () => {
  try {
    const query = `{
        distributionAmountSum
        pendingDistributionAmountSum
        distributionAmountAvgSumForAddresses
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
      }`;

    const {
      data: { data },
    } = await axios.post(GRAPHQL, { query });

    const lleKeys = [
      "distributionAmountSumFromUsdbUnlockedLle",
      "distributionAmountSumFromMimUnlockedLle",
      "distributionAmountSumFromUsdbLockedLle",
      "distributionAmountSumFromMimLockedLle",
      "distributionAmountSumFromDepositBorrowedMimLle",
    ];
    const pendingLleKeys = [
      "pendingDistributionAmountSumFromUsdbUnlockedLle",
      "pendingDistributionAmountSumFromMimUnlockedLle",
      "pendingDistributionAmountSumFromUsdbLockedLle",
      "pendingDistributionAmountSumFromMimLockedLle",
      "pendingDistributionAmountSumFromDepositBorrowedMimLle",
    ];

    const distributionAmountSumFromLle = lleKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);
    const pendingDistributionAmountSumFromLle = pendingLleKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);

    return {
      distributionAmountSum: Number(data.distributionAmountSum),
      pendingDistributionAmountSum: Number(data.pendingDistributionAmountSum),
      distributionAmountAvgSumForAddresses: Number(
        data.distributionAmountAvgSumForAddresses
      ),
      distributionAmountSumFromLle,
      pendingDistributionAmountSumFromLle,
      distributionAmountSumFromCauldron: Number(
        data.distributionAmountSumFromCauldron
      ),
      pendingDistributionAmountSumFromCauldron: Number(
        data.pendingDistributionAmountSumFromCauldron
      ),
    };
  } catch (error) {
    console.log("Error fetching points statistics", error);
    return {
      distributionAmountSum: 0,
      pendingDistributionAmountSum: 0,
      distributionAmountAvgSumForAddresses: 0,
      distributionAmountSumFromLle: 0,
      pendingDistributionAmountSumFromLle: 0,
      distributionAmountSumFromCauldron: 0,
      pendingDistributionAmountSumFromCauldron: 0,
    };
  }
};

export const fetchUserPointsStatistics = async (address: Address) => {
  if (!address)
    return {
      distributionAmountSumByAddress: 0,
      pendingDistributionAmountSumByAddress: 0,
      distributionAmountSumByAddressFromLle: 0,
      pendingDistributionAmountSumByAddressFromLle: 0,
      distributionAmountSumByAddressFromCauldron: 0,
      pendingDistributionAmountSumByAddressFromCauldron: 0,
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
      }`;

    const {
      data: { data },
    } = await axios.post(GRAPHQL, { query });

    const lleKeys = [
      "distributionAmountSumByAddressFromUsdbUnlockedLle",
      "distributionAmountSumByAddressFromMimUnlockedLle",
      "distributionAmountSumByAddressFromUsdbLockedLle",
      "distributionAmountSumByAddressFromMimLockedLle",
      "distributionAmountSumByAddressFromDepositBorrowedMimLle",
    ];
    const pendingLleKeys = [
      "pendingDistributionAmountSumByAddressFromUsdbUnlockedLle",
      "pendingDistributionAmountSumByAddressFromMimUnlockedLle",
      "pendingDistributionAmountSumByAddressFromUsdbLockedLle",
      "pendingDistributionAmountSumByAddressFromMimLockedLle",
      "pendingDistributionAmountSumByAddressFromDepositBorrowedMimLle",
    ];

    const distributionAmountSumByAddressFromLle = lleKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);
    const pendingDistributionAmountSumByAddressFromLle = pendingLleKeys
      .map((key) => Number(data[key]))
      .reduce((a, b) => a + b, 0);

    return {
      distributionAmountSumByAddress: Number(
        data.distributionAmountSumByAddress
      ),
      pendingDistributionAmountSumByAddress: Number(
        data.pendingDistributionAmountSumByAddress
      ),
      distributionAmountSumByAddressFromLle,
      pendingDistributionAmountSumByAddressFromLle,
      distributionAmountSumByAddressFromCauldron: Number(
        data.distributionAmountSumByAddressFromCauldron
      ),
      pendingDistributionAmountSumByAddressFromCauldron: Number(
        data.pendingDistributionAmountSumByAddressFromCauldron
      ),
    };
  } catch (error) {
    console.log("Error fetching user points statistics", error);
    return {
      distributionAmountSumByAddress: 0,
      pendingDistributionAmountSumByAddress: 0,
      distributionAmountSumByAddressFromLle: 0,
      pendingDistributionAmountSumByAddressFromLle: 0,
      distributionAmountSumByAddressFromCauldron: 0,
      pendingDistributionAmountSumByAddressFromCauldron: 0,
    };
  }
};
