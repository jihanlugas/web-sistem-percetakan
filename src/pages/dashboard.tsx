import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAuth from '@/components/layout/main-auth';
import Breadcrumb from '@/components/component/breadcrumb';
import { displayMoney, displayNumber } from '@/utils/formater';
import { GrMoney } from 'react-icons/gr';
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { BiLineChart } from 'react-icons/bi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);


const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};


// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
// const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: [1, 2, 3, 4, 5, 6, 7],
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       data: [1, 5, 6, 7, 2, 3, 4],
//       borderColor: 'rgb(53, 162, 235)',
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };

const Index = () => {

  const [chartTransaction, setChartTransaction] = useState<any>(null)
  const [totalDebit, setTotalDebit] = useState<number>(0)
  const [totalKredit, setTotalKredit] = useState<number>(0)
  const [totalOrder, setTotalOrder] = useState<number>(0)

  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['order', loginUser?.payload?.company?.id],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/dashboard/' + id) : null
    },
  })

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setChartTransaction(data.payload?.chartTransaction)
        setTotalDebit(data.payload?.totalDebit)
        setTotalKredit(data.payload?.totalKredit)
        setTotalOrder(data.payload?.totalOrder)
      }
    }
  }, [data])

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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-lg'>
          <div className='bg-white p-4 rounded shadow h-full flex flex-col justify-between'>
            <div className='flex items-center'>
              <div className='mr-4 text-2xl'>Transaksi</div>
              <div><GrMoney className='' size={'1.5rem'} /></div>
            </div>
            <div className='p-8 text-4xl flex justify-center items-center font-bold'>
              {(totalDebit - totalKredit > 0) ? (
                <div className='my-auto text-green-500'>{displayMoney(totalDebit - totalKredit)}</div>
              ) : (totalDebit - totalKredit < 0) ? (
                <div className='my-auto  text-rose-500'>{displayMoney(totalDebit - totalKredit)}</div>
              ) : (
                <div className='my-auto'>{displayMoney(totalDebit - totalKredit)}</div>
              )}
            </div>
            <div className=''>
              <div className='flex justify-between text-green-500'>
                <div>Pemasukan</div>
                <div>{displayMoney(totalDebit)}</div>
              </div>
              <div className='flex justify-between text-rose-500'>
                <div>Pengeluaran</div>
                <div>{displayMoney(totalKredit)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Jumlah Order</div>
                <div>{displayNumber(totalOrder)}</div>
              </div>
            </div>
            {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className=''>
                <div className='flex justify-center items-center bg-green-500 p-4 rounded text-gray-50 font-bold shadow'>
                  <div className='mr-2'><FaArrowDownLong className='' size={'1.2rem'} /></div>
                  <div className=''>{displayMoney(totalDebit)}</div>
                </div>
              </div>
              <div className=''>
                <div className='flex justify-center items-center bg-rose-500 p-4 rounded text-gray-50 font-bold shadow'>
                  <div className='mr-2'><FaArrowUpLong className='' size={'1.2rem'} /></div>
                  <div className=''>{displayMoney(totalKredit)}</div>
                </div>
              </div>
            </div> */}
          </div>
          <div className='bg-white p-4 rounded shadow md:col-span-2'>
            <div className='flex items-center'>
              <div className='mr-4 text-2xl'>Transaksi</div>
              <div><BiLineChart className='' size={'1.5rem'} /></div>
            </div>
            {chartTransaction && (<Line className='max-h-96 w-full' options={options} data={chartTransaction} />)}
          </div>
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;