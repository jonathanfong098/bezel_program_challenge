import { Dialog } from '@headlessui/react';
import Image from 'next/image';

import { useFetchOrder, useOrderActions } from '@/hooks/bezel';

import {
  centsToDollars,
  commissionRate,
  formatAsPercentage,
  formatDollarAmount,
} from '@/helpers';

/**
 * The props for a modal component that displays actions for a particular order.
 * @property {boolean} isOpen - Indicates whether the modal is currently open.
 * @property {Function} closeModal - A function that can be called to close the modal.
 * @property {number} orderNumber - The order number for which actions are being displayed in the modal.
 */
interface ActionModalProps {
  isOpen: boolean;
  closeModal: () => void;
  orderNumber: number;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  closeModal,
  orderNumber,
}) => {
  const { data, error: getOrderError } = useFetchOrder(orderNumber);
  const {
    acceptOrder,
    rejectOrder,
    error: orderActionError,
  } = useOrderActions(orderNumber);

  let cr = '';
  let crPercent = '';
  if (data?.transactionInfo) {
    const crDecimal = commissionRate(data?.transactionInfo?.commission); // commission rate as a decimal value
    crPercent = formatAsPercentage(crDecimal); // commission rate as a percent
    cr = formatDollarAmount(
      centsToDollars(data?.transactionInfo?.sellingPrice * crDecimal)
    ); // calculate commission rate in dollars
  }

  // load the action modal if data exists and there are no errors in retrieving
  // data from Bezel API or if there is an error in accepting/declining the order
  if ((data && !getOrderError) || !orderActionError) {
    return (
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className='flex h-screen items-center justify-center bg-black/80'
      >
        <Dialog.Panel className='rounded-4xl relative h-fit w-fit bg-white px-14 py-12'>
          <div
            className='absolute right-8 top-8 h-7 w-7 hover:cursor-pointer'
            onClick={closeModal}
          >
            <Image
              src='/svg/exit.svg'
              alt='Watch'
              layout='fill'
              className='rounded-4xl object-cover'
            />
          </div>

          <div className='flex flex-row items-center'>
            {/* left side of modal */}
            <div className='mr-20 h-fit w-fit'>
              <div className='flex h-full w-96 flex-col items-center tracking-normal'>
                {/* order message */}
                <div className='text-grey-200 mb-5 mt-10 self-start text-lg'>
                  CONGRATS!{' '}
                </div>
                <div className='mb-12 self-start text-4xl text-green-500'>
                  Your Watch Sold!
                </div>
                <p className='text-grey-100 mb-24 self-start text-justify text-lg'>
                  You have 1 business day to accept the sale. If you do not
                  accept, it will be automatically rejected.
                </p>

                {/* accept and reject buttons */}
                <button
                  className='rounded-4xl my-4 h-fit w-full bg-green-800 py-5 font-semibold tracking-normal text-white'
                  onClick={() => {
                    acceptOrder(orderNumber);
                  }}
                >
                  Accept Sale
                </button>
                <button
                  className='rounded-4xl my-4 h-fit w-full py-5 font-semibold tracking-normal text-green-500'
                  onClick={() => {
                    rejectOrder(orderNumber);
                  }}
                >
                  Reject Sale
                </button>
              </div>
            </div>

            {/* right side of modal*/}
            <div className='bg-grey-300 rounded-4xl h-fit w-fit px-10 py-12'>
              <div className='divide-grey-50 border-grey-5 w-96 divide-y-2 border-t-2 tracking-normal'>
                {/* watch information*/}
                <div className='flex h-fit flex-row justify-between py-5'>
                  <div className='text-green-500 '>
                    <div>{`${data?.listingInfo?.brandName} ${data?.listingInfo?.displayName}`}</div>
                    <div>
                      {' '}
                      {data?.listingInfo?.watchDesignerName}{' '}
                      {data?.listingInfo?.referenceNumber}
                    </div>
                    <div className='text-grey-100 mt-2 capitalize'>
                      {data?.listingInfo?.condition.toLowerCase()} /{' '}
                      {data?.listingInfo?.manufactureYear}
                    </div>
                  </div>
                  {data?.listingInfo?.imageURI != undefined ? (
                    <div className='relative h-24 w-24'>
                      <Image
                        src={data?.listingInfo?.imageURI}
                        alt='Watch'
                        layout='fill'
                        className='rounded-3xl object-cover'
                      />
                    </div>
                  ) : (
                    <div className='rounded-4xl h-24 w-24 border-2 border-green-500' />
                  )}
                </div>

                {/* transaction information */}
                <div className='flex flex-col space-y-6 py-6'>
                  <div className='flex justify-between'>
                    <span className='text-grey-100 text-left'>
                      Selling Price
                    </span>
                    <span className='text-right text-green-500'>
                      {data?.transactionInfo?.sellingPrice
                        ? formatDollarAmount(
                            centsToDollars(data?.transactionInfo?.sellingPrice)
                          )
                        : ''}
                    </span>
                  </div>

                  <div className='text-grey-100 flex justify-between'>
                    <span className='text-left'>{`Level 1 Commission (${crPercent})`}</span>
                    <span className='text-right'>{cr}</span>
                  </div>

                  <div className='text-grey-100 flex justify-between'>
                    <span className='text-left'>Seller fee</span>
                    <span className='text-right'>
                      {data?.transactionInfo?.sellerFee
                        ? formatDollarAmount(
                            centsToDollars(data?.transactionInfo?.sellerFee)
                          )
                        : ''}
                    </span>
                  </div>

                  <div className='text-grey-100 flex justify-between'>
                    <span className='text-left'>Insured Shipping</span>
                    <span>
                      {data?.transactionInfo?.insuredShipping
                        ? formatDollarAmount(
                            centsToDollars(
                              data?.transactionInfo?.insuredShipping
                            )
                          )
                        : 'Free'}
                    </span>
                  </div>

                  <div className='flex justify-between text-green-100'>
                    <span className='text-left'>Bezel authentication</span>
                    <span className='text-right'>
                      {data?.transactionInfo?.authentication
                        ? formatDollarAmount(
                            centsToDollars(
                              data?.transactionInfo?.insuredShipping
                            )
                          )
                        : 'Free'}
                    </span>
                  </div>
                </div>

                {/* earnings */}
                <div className='flex justify-between pb-3 pt-5 font-semibold text-green-500'>
                  <span className='text-left'>Earnings</span>
                  <span className='text-right'>
                    {data?.transactionInfo.sellingPrice
                      ? formatDollarAmount(
                          centsToDollars(data?.transactionInfo?.earnings)
                        )
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  } else {
    return (
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className='flex h-screen items-center justify-center bg-black/80'
      >
        <Dialog.Panel className='rounded-4xl relative h-fit w-fit bg-white px-14 py-10'>
          <div className='text-4xl font-semibold text-red-500'>
            {getOrderError ? '' : getOrderError}
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }
};
