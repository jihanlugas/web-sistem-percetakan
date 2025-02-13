import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainUser from '@/components/layout/main-user';

const Index = () => {
  return (
    <>
      <Head>
        <title>{process.env.APP_NAME}</title>
      </Head>
      <div className='p-4'>
        Home
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainUser;

export default Index;