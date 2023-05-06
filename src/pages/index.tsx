import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { ActionModal } from '../components/ActionModal';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
// import Vercel from '~/svg/Vercel.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Layout>
      <Seo />
      <main>
        {/*test button to open modal*/}
        <button
          className='my-4 h-fit w-full rounded-3xl bg-green-800 py-5 font-semibold text-white'
          onClick={openModal}
        >
          Open Action Modal
        </button>

        <ActionModal
          isOpen={isOpen}
          closeModal={closeModal}
          orderNumber={123}
        />
      </main>
    </Layout>
  );
}
