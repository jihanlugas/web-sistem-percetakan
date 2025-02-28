import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { TransactionView } from "@/types/transaction";
import { displayDateTime, displayMoney, displayNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditTransaction from "@/components/modal/modal-edit-transaction";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [transaction, setTransaction] = useState<TransactionView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditTransaction, setShowModalEditTransaction] = useState<boolean>(false);

  const preloads = 'Company'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['transaction', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/transaction/' + id, { preloads }) : null
    },
  })

  const toggleModalEditTransaction = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditTransaction(!showModalEditTransaction);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setTransaction(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Transaction Detail'}</title>
      </Head>
      <ModalEditTransaction
        show={showModalEditTransaction}
        onClickOverlay={toggleModalEditTransaction}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Transaction', path: '/transaction' },
            { name: transaction?.name || id, path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Transaction</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Transaction'
                    onClick={() => toggleModalEditTransaction(transaction?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="text-gray-600">{'Nama Transaction'}</div>
                    <div className="">{transaction?.name}</div>
                    <div className="text-gray-600">{'Keterangan'}</div>
                    <div className="whitespace-pre-wrap">{transaction?.description || '-'}</div>
                    <div className="text-gray-600">{'Nama Order'}</div>
                    <div className="">{transaction?.orderName}</div>
                    <div className="text-gray-600">{'Type'}</div>
                    <div className="">{transaction?.type === 1 ? 'Debit' : 'Kredit'}</div>
                    <div className="text-gray-600">{'Harga'}</div>
                    <div className="">{displayMoney(transaction?.amount)}</div>
                    <div className="text-gray-600">{'Create By'}</div>
                    <div className="">{transaction?.createName}</div>
                    <div className="text-gray-600">{'Create Date'}</div>
                    <div className="">{displayDateTime(transaction?.createDt)}</div>
                    <div className="text-gray-600">{'Last Update By'}</div>
                    <div className="">{transaction?.updateName}</div>
                    <div className="text-gray-600">{'Last Update Date'}</div>
                    <div className="">{displayDateTime(transaction?.updateDt)}</div>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(transaction, null, 4)}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAuth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;