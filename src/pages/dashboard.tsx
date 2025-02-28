import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAuth from '@/components/layout/main-auth';
import Breadcrumb from '@/components/component/breadcrumb';

const Index = () => {
  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Dashboard'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Dashboard', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>

        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;