import axios from 'axios';

/**
 * Represents information about a watch listing.
 * @property {string} displayName - The display name of the watch.
 * @property {string} brandName - The name of the brand that makes the watch.
 * @property {string} watchDesignerName - The name of the watch designer.
 * @property {string} referenceNumber - The reference number of the watch.
 * @property {string} condition - The condition of the watch.
 * @property {number} manufactureYear - The year the watch was manufactured.
 * @property {string} imageURI - The URI of the image associated with the watch listing.
 */
export interface ListingInfo {
  displayName: string;
  brandName: string;
  watchDesignerName: string;
  referenceNumber: string;
  condition: string;
  manufactureYear: number;
  imageURI: string;
}

/**
 * Represents information about a watch transaction.
 * @property {number} sellingPrice - The price at which the watch was sold.
 * @property {number} commission - The commission charged by the platform for the sale.
 * @property {number} sellerFee - The fee charged by the platform to the seller.
 * @property {number} insuredShipping - The cost of shipping the watch with insurance.
 * @property {number} authentication - The cost of authenticating the watch.
 * @property {number} earnings - The earnings made by the seller after all fees and costs have been deducted.
 */
export interface TransactionInfo {
  sellingPrice: number;
  commission: number;
  sellerFee: number;
  insuredShipping: number;
  authentication: number;
  earnings: number;
}

/**
 * Represents information about a watch order, including its listing and transaction details.
 * @property {ListingInfo} listingInfo - The information about the watch listing associated with the order.
 * @property {TransactionInfo} transactionInfo - The information about the transaction associated with the order.
 */
export interface OrderInfo {
  listingInfo: ListingInfo;
  transactionInfo: TransactionInfo;
}

/**
 * Represents information about the status of accepting or rejecting an order
 * @property {response} - Status of of accepting or rejecting an order
 */
export interface OrderResponse {
  response: string;
}

/**
 * Retrieves information about a watch order based on its order number.
 * @async
 * @param {number} orderNumber - The order number of the watch order to retrieve information for.
 * @returns {Promise<OrderInfo>} A promise that resolves with an object containing the order's listing and transaction details.
 * @throws {Error} Throws an error if the request to the Bezel API fails.
 */
export const getOrderInfo = async (orderNumber: number): Promise<OrderInfo> => {
  try {
    const url = `https://eb863a74-7a4e-4daf-9540-d2db8470c18e.mock.pstmn.io/marketplace/orders/${orderNumber}`;
    const response = await axios.get(url);

    const data = response.data;

    const listingInfo = {
      displayName: data.listing.model.displayName,
      brandName: data.listing.model.brand.displayName,
      watchDesignerName: 'James Cameron', // unsure which key from response data corresponds to watch designer's name
      referenceNumber: data.listing.model.referenceNumber,
      condition: data.listing.condition,
      manufactureYear: data.listing.manufactureYear,
      imageURI: data.listing.images[0].image.url,
    };

    const transactionInfo = {
      sellingPrice: data.salePriceCents,
      commission: data.commissionRateBips,
      sellerFee: data.sellerFeeCents,
      insuredShipping: 0, // unsure which key from response data corresponds to insured shipping
      authentication: 0, // unsure which key from response data corresponds to authentication
      earnings: data.payoutAmountCents, // assume payout is the same as earnings
    };

    const orderInfo = {
      listingInfo: listingInfo,
      transactionInfo: transactionInfo,
    };

    return orderInfo;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};

/**
 * Accepts a watch order by sending a POST request to Bezel API.
 * @async
 * @param {number} orderNumber - The order number of the watch order to accept.
 * @returns {Promise<{}>} A promise that resolves with the response data of the Bezel API request.
 * @throws {Error} Throws an error if the request to the Bezel API fails.
 */
export const acceptOrder = async (
  orderNumber: number
): Promise<OrderResponse> => {
  try {
    const url = `https://eb863a74-7a4e-4daf-9540-d2db8470c18e.mock.pstmn.io/marketplace/orders/${orderNumber}/accept`;
    const response = await axios.post(url);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};

/**
 * Rejects a watch order by sending a POST request to Bezel API.
 * @async
 * @param {number} orderNumber - The order number of the watch order to reject.
 * @returns {Promise<{}>} A promise that resolves with the response data of the Bezel API request.
 * @throws {Error} Throws an error if the request to the Bezel API fails.
 */
export const rejectOrder = async (
  orderNumber: number
): Promise<OrderResponse> => {
  try {
    const url = `https://eb863a74-7a4e-4daf-9540-d2db8470c18e.mock.pstmn.io/marketplace/orders/${orderNumber}/decline`;
    const response = await axios.post(url);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};
