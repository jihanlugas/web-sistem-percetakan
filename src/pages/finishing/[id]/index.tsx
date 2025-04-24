import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { FinishingView } from "@/types/finishing";
import { displayDateTime, displayMoney, displayNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditFinishing from "@/components/component/modal-edit-finishing";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [finishing, setFinishing] = useState<FinishingView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditFinishing, setShowModalEditFinishing] = useState<boolean>(false);

  const preloads = 'Company'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['finishing', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/finishing/' + id, { preloads }) : null
    },
  })

  const toggleModalEditFinishing = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditFinishing(!showModalEditFinishing);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setFinishing(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Finishing Detail'}</title>
      </Head>
      <ModalEditFinishing
        show={showModalEditFinishing}
        onClickOverlay={toggleModalEditFinishing}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Finishing', path: '/finishing' },
            { name: finishing?.name || id, path: '' },
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
                  <div>Finishing</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Finishing'
                    onClick={() => toggleModalEditFinishing(finishing?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="text-gray-600">{'Name'}</div>
                    <div className="">{finishing?.name}</div>
                    <div className="text-gray-600">{'Keterangan'}</div>
                    <div className="whitespace-pre-wrap">{finishing?.description || '-'}</div>
                    <div className="text-gray-600">{'Qty'}</div>
                    <div className="">{displayNumber(finishing?.qty)}</div>
                    <div className="text-gray-600">{'Harga'}</div>
                    <div className="">{displayMoney(finishing?.price)}</div>
                    <div className="text-gray-600">{'Total Harga'}</div>
                    <div className="">{displayMoney(finishing?.total)}</div>
                    <div className="text-gray-600">{'Create By'}</div>
                    <div className="">{finishing?.createName}</div>
                    <div className="text-gray-600">{'Create Date'}</div>
                    <div className="">{displayDateTime(finishing?.createDt)}</div>
                    <div className="text-gray-600">{'Last Update By'}</div>
                    <div className="">{finishing?.updateName}</div>
                    <div className="text-gray-600">{'Last Update Date'}</div>
                    <div className="">{displayDateTime(finishing?.updateDt)}</div>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(finishing, null, 4)}
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