import orderAbi from "@/utils/abi/gm/order";
import ERC20 from "@/utils/zeroXSwap/abi/ERC20";
import { Contract } from "ethers";

import {
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
  const balanceWETH = await WETHContract.balanceOf(order);
  const balanceUSDC = await USDCContract.balanceOf(order);

  return {
    balanceWETH,
    balanceUSDC
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
  const isDeposit = await orderContract.depositType();
  const { balanceUSDC } = await getOrderBalances(orderContract.address, provider);
  
  if(isDeposit && itsZero || isDeposit && balanceUSDC.eq(0)) return ORDER_SUCCESS;

  if(!isDeposit && balanceUSDC.gt(0)) return ORDER_SUCCESS;

  return ORDER_FAIL;
};

export const getOrderType = async (order, provider) => {
  const orderContract = new Contract(order, orderAbi, provider);
  const isDeposit = await orderContract.depositType();

  if(isDeposit) return ORDER_TYPE_LEVERAGE;

  return ORDER_TYPE_DELEVERAGE;
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
