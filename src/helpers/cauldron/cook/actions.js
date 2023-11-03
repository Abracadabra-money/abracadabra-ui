import { ethers } from "ethers";

const repay = (cookData, share, to, skim, value = 0) => {
  const methodId = 2;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["int256", "address", "bool"],
    [share, to, skim]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const removeCollateral = (cookData, fraction, to, value = 0) => {
  const methodId = 4;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["int256", "address"],
    [fraction, to]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const borrow = (cookData, amount, to, value = 0) => {
  const methodId = 5;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["int256", "address"],
    [amount, to]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const getRepayShare = (cookData, part, value = 0) => {
  const methodId = 6;

  const encode = ethers.utils.defaultAbiCoder.encode(["int256"], [part]);

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const getRepayPart = (cookData, amount, value = 0) => {
  const methodId = 7;

  const encode = ethers.utils.defaultAbiCoder.encode(["int256"], [amount]);

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const addCollateral = (cookData, share, to, skim, value = 0) => {
  const methodId = 10;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["int256", "address", "bool"],
    [share, to, skim]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const updateExchangeRate = (
  cookData,
  mustUpdate,
  minRate= "0x00",
  maxRate = "0x00",
  value = 0
) => {
  const methodId = 11;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["bool", "uint256", "uint256"],
    [mustUpdate, minRate, maxRate]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const bentoDeposit = (cookData, token, to, amount, share, value = 0) => {
  const methodId = 20;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "int256", "int256"],
    [token, to, amount, share]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const bentoWithdraw = (cookData, token, to, amount, share, value = 0) => {
  const methodId = 21;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "int256", "int256"],
    [token, to, amount, share]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const bentoSetApproval = (
  cookData,
  user,
  masterContract,
  approved,
  v,
  r,
  s,
  value = 0
) => {
  const methodId = 24;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "bool", "uint8", "bytes32", "bytes32"],
    [user, masterContract, approved, v, r, s]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const call = (
  cookData,
  callee,
  callData,
  useValue1,
  useValue2,
  returnValues,
  value = 0
) => {
  const methodId = 30;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["address", "bytes", "bool", "bool", "uint8"],
    [callee, callData, useValue1, useValue2, returnValues]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const createOrder = (cookData, value, inputToken, deposit, inputAmount, executionFee, minOutput, minOutLong) => {
  const methodId = 101;

  const encode = ethers.utils.defaultAbiCoder.encode(
    ["address", "bool", "uint128", "uint128", "uint128", "uint128"],
    [inputToken, deposit, inputAmount, executionFee, minOutput, minOutLong]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const actions = {
  repay,
  removeCollateral,
  borrow,
  getRepayShare,
  getRepayPart,
  addCollateral,
  updateExchangeRate,
  bentoDeposit,
  bentoWithdraw,
  bentoSetApproval,
  call,
  createOrder
};

export { actions };