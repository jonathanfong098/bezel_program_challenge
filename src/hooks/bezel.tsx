import { useEffect, useState } from 'react';

import {
  acceptOrder,
  getOrderInfo,
  OrderInfo,
  rejectOrder,
} from '@/pages/api/bezel';

/**
 * An object containing information about an order and any errors that occur while fetching the order.
 * @property {OrderInfo|undefined} - The information about the order, if it has been successfully fetched.
 * @property {Error|undefined} - An error object that describes any errors that occurred while fetching the order, if applicable.
 */
export interface Order {
  data: OrderInfo | undefined;
  error: Error | undefined;
}

/**
 * An object containing functions for accepting and rejecting an order, as well as any errors that occur while performing those actions.
 * @property {function} acceptOrder - Accepts an order with the specified order number, or the default order number if none is provided.
 * @property {function} rejectOrder - Rejects an order with the specified order number, or the default order number if none is provided.
 * @property {Error} error - An error object that describes any errors that occurred while accepting or rejecting the order
 */
export interface OrderActions {
  acceptOrder: (numberOrder: number) => Promise<void>;
  rejectOrder: (numberOrder: number) => Promise<void>;
  error: Error | undefined;
}

/**
 * Custom React Hook that fetches order information for a given order number using the getOrderInfo function.
 * @param {number} orderNumber - The number of the order to fetch information for.
 * @returns {Order} An object containing the order data and any errors that occurred during the fetch.
 */
export const useFetchOrder = (orderNumber: number): Order => {
  const [data, setData] = useState<OrderInfo>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const fetchOrder = async (orderNumber: number) => {
      try {
        const response = await getOrderInfo(orderNumber);
        setData(response);
      } catch (error) {
        setError(error as Error);
      }
    };

    fetchOrder(orderNumber);
  }, [orderNumber]);

  return {
    data: data,
    error: error,
  };
};

/**
 * Custom React Hook that provides functions for accepting or rejecting an order using the acceptOrder and rejectOrder functions.
 * @param {number} orderNumber - The number of the order to accept or reject.
 * @returns {OrderActions} An object containing functions for accepting and rejecting the order, as well as any errors that occur.
 */
export const useOrderActions = (orderNumber: number): OrderActions => {
  const [error, setError] = useState<Error>();

  /**
   * Accepts an order with the specified order number, or the default order number if none is provided.
   * @async
   * @param {number} [orderNum=orderNumber] - The order number to accept. Defaults to the value of the `orderNumber` parameter passed to `useOrderActions`.
   * @returns {Promise<void>} - A promise that resolves when the order is successfully accepted.
   * @throws {Error} - Throws an error if error occurs while accepting the order.
   */
  const accept = async (orderNum: number = orderNumber) => {
    try {
      const response = await acceptOrder(orderNum);
      // eslint-disable-next-line no-console
      console.log('Accepted Order'); // display in console that order was accepted

      // implement further if need to use response data
      // eslint-disable-next-line no-console
      console.log(response);
    } catch (error) {
      setError(error as Error);
    }
  };

  /**
   * Rejects an order with the specified order number, or the default order number if none is provided.
   * @async
   * @param {number} [orderNum=orderNumber] - The order number to reject. Defaults to the value of the `orderNumber` parameter passed to `useOrderActions`.
   * @returns {Promise<void>} - A promise that resolves when the order is successfully rejected.
   * @throws {Error} - Throws an error if error occurs while accepting the order.
   */
  const reject = async (orderNum: number = orderNumber) => {
    try {
      const response = await rejectOrder(orderNum);
      // eslint-disable-next-line no-console
      console.log('Rejected Order'); // display in console that order was rejected

      // implement further if need to use response data
      // eslint-disable-next-line no-console
      console.log(response);
    } catch (error) {
      setError(error as Error);
    }
  };

  return {
    acceptOrder: accept,
    rejectOrder: reject,
    error: error,
  };
};
