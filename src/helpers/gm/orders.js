import orderAbi from "@/utils/abi/gm/order";
import ERC20 from "@/utils/zeroXSwap/abi/ERC20";
import { Contract } from "ethers";

import {
  GM_ADDRESS,
  USDC_ADDRESS,
  WETH_ADDRESS,
  ZERO_ADDRESS,
} from "@/constants/gm";

export const ORDER_PENDING = 0;
export const ORDER_SUCCESS = 1;
export const ORDER_FAIL = 2;

export const ORDER_TYPE_UNKNOWN = 0;
export const ORDER_TYPE_LEVERAGE = 1;
export const ORDER_TYPE_DELEVERAGE = 2;

export const getOrderBalances = async (order, provider) => {
  const WETHContract = new Contract(WETH_ADDRESS, ERC20, provider);
  const USDCContract = new Contract(USDC_ADDRESS, ERC20, provider);
  const GMContract = new Contract(GM_ADDRESS, ERC20, provider);
  const balanceWETH = await WETHContract.balanceOf(order);
  const balanceUSDC = await USDCContract.balanceOf(order);
  const balanceGM = await GMContract.balanceOf(order);

  return {
    balanceWETH,
    balanceUSDC,
    balanceGM,
  };
};

export const getOrderStatus = async (
  cauldron,
  user,
  orderContract,
  provider
) => {
  const isActive = await orderContract.isActive();
  if (isActive) return ORDER_PENDING;

  const currentOrder = await cauldron.orders(user);
  const itsZero = currentOrder === ZERO_ADDRESS;
  if (itsZero) return ORDER_SUCCESS;

  return ORDER_FAIL;
};

export const getOrderType = async (balances, status) => {
  const hasUSDC = balances.balanceUSDC.gt(0);
  const hasGM = balances.balanceGM.gt(0);

  if (status === ORDER_SUCCESS && hasGM) {
    return ORDER_TYPE_DELEVERAGE;
  }

  if (status === ORDER_FAIL) {
    if (hasUSDC) return ORDER_TYPE_LEVERAGE;
    if (hasGM) return ORDER_TYPE_DELEVERAGE;
  }

  return ORDER_TYPE_UNKNOWN;
};

export const monitorOrderStatus = (order, cauldron, user, provider) => {
  const orderContract = new Contract(order, orderAbi, provider);

  return new Promise((resolve) => {
    const monitoringInterval = setInterval(async () => {
      const status = await getOrderStatus(
        cauldron,
        user,
        orderContract,
        provider
      );

      if (status !== ORDER_PENDING) {
        resolve(status);
        clearInterval(monitoringInterval)
      }
    }, 1000);
  });
};

export const saveOrder = (order, account) => {
  const itemName = `OrderGM-${account.toLowerCase()}`;
  const orders = [];

  const lsOrdersData = localStorage.getItem(itemName);
  const savedOrders = lsOrdersData ? JSON.parse(lsOrdersData) : [];

  const itsZero = order === ZERO_ADDRESS;

  const isOrderSaved = itsZero ? true : savedOrders.indexOf(order) !== -1;

  orders.push(...savedOrders);

  if (!isOrderSaved) {
    orders.push(order);
    localStorage.setItem(itemName, JSON.stringify(orders));
  }

  return orders;
};

export const deleteOrder = (order, account) => {
  const itemName = `OrderGM-${account.toLowerCase()}`;
  const lsOrdersData = localStorage.getItem(itemName);
  const savedOrders = lsOrdersData ? JSON.parse(lsOrdersData) : [];
  const filteredOrders = savedOrders.filter((item) => item !== order);
  localStorage.setItem(itemName, JSON.stringify(filteredOrders));
};
