import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { PrintView } from "@/types/print";
import { displayBoolean, displayDateTime, displayMoney, displayNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditPrint from "@/components/modal/modal-edit-print";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [print, setPrint] = useState<PrintView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditPrint, setShowModalEditPrint] = useState<boolean>(false);

  const preloads = 'Company'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['print', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/print/' + id, { preloads }) : null
    },
  })

  const toggleModalEditPrint = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditPrint(!showModalEditPrint);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setPrint(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Print Detail'}</title>
      </Head>
      <ModalEditPrint
        show={showModalEditPrint}
        onClickOverlay={toggleModalEditPrint}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Print', path: '/print' },
            { name: print?.name || id, path: '' },
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
                  <div>Print</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Print'
                    onClick={() => toggleModalEditPrint(print?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="text-gray-600">{'Name'}</div>
                    <div className="">{print?.name}</div>
                    <div className="text-gray-600">{'Keterangan'}</div>
                    <div className="whitespace-pre-wrap">{print?.description || '-'}</div>
                    <div className="text-gray-600">{'Kertas'}</div>
                    <div className="whitespace-pre-wrap">{print?.paperName || '-'}</div>
                    <div className="text-gray-600">{'Timbal Balik'}</div>
                    <div className="">{displayBoolean(print?.isDuplex, "Ya", "Tidak")}</div>
                    <div className="text-gray-600">{'Jumlah Lembar'}</div>
                    <div className="">{displayNumber(print?.pageCount)}</div>
                    <div className="text-gray-600">{'Qty'}</div>
                    <div className="">{displayNumber(print?.qty)}</div>
                    <div className="text-gray-600">{'Harga'}</div>
                    <div className="">{displayMoney(print?.price)}</div>
                    <div className="text-gray-600">{'Total Print'}</div>
                    <div className="">{displayMoney(print?.total)}</div>
                    <div className="text-gray-600">{'Create By'}</div>
                    <div className="">{print?.createName}</div>
                    <div className="text-gray-600">{'Create Date'}</div>
                    <div className="">{displayDateTime(print?.createDt)}</div>
                    <div className="text-gray-600">{'Last Update By'}</div>
                    <div className="">{print?.updateName}</div>
                    <div className="text-gray-600">{'Last Update Date'}</div>
                    <div className="">{displayDateTime(print?.updateDt)}</div>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(print, null, 4)}
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