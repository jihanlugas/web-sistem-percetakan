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
import { NextPage } from 'next';

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

type dashboardTransaction = {
  totalDebitCash: number
  totalKreditCash: number
  totalDebitTransfer: number
  totalKreditTransfer: number
  totalOrder: number
}

const Index = () => {

  const [chartTransaction, setChartTransaction] = useState<any>(null)
  const [transactionDay, setTransactionDay] = useState<dashboardTransaction>(null)
  const [transactionWeek, setTransactionWeek] = useState<dashboardTransaction>(null)
  const [transactionMonth, setTransactionMonth] = useState<dashboardTransaction>(null)

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
        setTransactionDay(data.payload?.transactionOneDay)
        setTransactionWeek(data.payload?.transactionOneWeek)
        setTransactionMonth(data.payload?.transactionOneMonth)
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

          <div className='bg-white p-4 rounded shadow md:col-span-3'>
            <div className='flex items-center'>
              <div className='mr-4 text-xl'>Transaksi</div>
              <div><BiLineChart className='' size={'1.2rem'} /></div>
            </div>
            {chartTransaction && (<Line className='max-h-96 w-full' options={options} data={chartTransaction} />)}
          </div>
          <GenerateTransaction title={'Transaksi 1 Bulan'} data={transactionMonth} />
          <GenerateTransaction title={'Transaksi 1 Minggu'} data={transactionWeek} />
          <GenerateTransaction title={'Transaksi 1 Hari'} data={transactionDay} />
        </div>
      </div>
    </>
  );
};

const GenerateTransaction: NextPage<{ title: string, data: dashboardTransaction }> = ({ title, data }) => {
  if (data == null) {
    return null
  }

  const totalDebit = data.totalDebitCash + data.totalDebitTransfer
  const totalKredit = data.totalKreditCash + data.totalKreditTransfer

  return (
    <div className='bg-white p-4 rounded shadow h-full flex flex-col justify-between'>
      <div className='flex items-center'>
        <div className='mr-4 text-xl'>{title}</div>
        <div><GrMoney className='' size={'1.2rem'} /></div>
      </div>
      <div className='p-6 text-2xl flex justify-center items-center font-bold'>
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
          <div>Pemasukan Cash</div>
          <div>{displayMoney(data.totalDebitCash)}</div>
        </div>
        <div className='flex justify-between text-green-500'>
          <div>Pemasukan Trasnfer</div>
          <div>{displayMoney(data.totalDebitTransfer)}</div>
        </div>
        <div className='flex justify-between text-rose-500'>
          <div>Pengeluaran Cash</div>
          <div>{displayMoney(data.totalKreditCash)}</div>
        </div>
        <div className='flex justify-between text-rose-500'>
          <div>Pengeluaran Trasnfer</div>
          <div>{displayMoney(data.totalKreditTransfer)}</div>
        </div>
        <div className='flex justify-between'>
          <div>Jumlah Order</div>
          <div>{displayNumber(data.totalOrder)}</div>
        </div>
      </div>
    </div>
  )
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;