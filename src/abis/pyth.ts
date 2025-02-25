import { parseAbi } from "viem";

export default parseAbi([
  "function getUpdateFee( bytes[] calldata updateData ) public view returns (uint feeAmount)",
  "function updatePriceFeeds(bytes[] calldata updateData) external payable",
]);
