import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { DesignView } from "@/types/design";
import { displayDateTime, displayMoney, displayNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditDesign from "@/components/modal/modal-edit-design";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [design, setDesign] = useState<DesignView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditDesign, setShowModalEditDesign] = useState<boolean>(false);

  const preloads = 'Company'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['design', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/design/' + id, { preloads }) : null
    },
  })

  const toggleModalEditDesign = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditDesign(!showModalEditDesign);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setDesign(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Design Detail'}</title>
      </Head>
      <ModalEditDesign
        show={showModalEditDesign}
        onClickOverlay={toggleModalEditDesign}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Design', path: '/design' },
            { name: design?.name || id, path: '' },
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
                  <div>Design</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Design'
                    onClick={() => toggleModalEditDesign(design?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="text-gray-600">{'Name'}</div>
                    <div className="">{design?.name}</div>
                    <div className="text-gray-600">{'Keterangan'}</div>
                    <div className="whitespace-pre-wrap">{design?.description || '-'}</div>
                    <div className="text-gray-600">{'Qty'}</div>
                    <div className="">{displayNumber(design?.qty)}</div>
                    <div className="text-gray-600">{'Harga'}</div>
                    <div className="">{displayMoney(design?.price)}</div>
                    <div className="text-gray-600">{'Total Harga'}</div>
                    <div className="">{displayMoney(design?.total)}</div>
                    <div className="text-gray-600">{'Create By'}</div>
                    <div className="">{design?.createName}</div>
                    <div className="text-gray-600">{'Create Date'}</div>
                    <div className="">{displayDateTime(design?.createDt)}</div>
                    <div className="text-gray-600">{'Last Update By'}</div>
                    <div className="">{design?.updateName}</div>
                    <div className="text-gray-600">{'Last Update Date'}</div>
                    <div className="">{displayDateTime(design?.updateDt)}</div>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(design, null, 4)}
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