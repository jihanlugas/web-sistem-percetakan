import 'react-toastify/dist/ReactToastify.css';
import 'animate.css/animate.min.css';
import '../styles/globals.css'
import '../styles/react-tooltip.css'
import Head from 'next/head';
import { NextPage } from 'next/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageWithLayoutType from '@/types/layout';
import { ToastContainer } from 'react-toastify';


type AppLayoutProps = {
  Component: PageWithLayoutType
  pageProps: any
}

const MyApp: NextPage<AppLayoutProps> = ({ Component, pageProps }) => {

  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const queryClient = new QueryClient();

  return (
    <>
      <ToastContainer />
      <Head>
        <title>{process.env.APP_NAME}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </QueryClientProvider>
    </>
  )
}

export default MyApp;
