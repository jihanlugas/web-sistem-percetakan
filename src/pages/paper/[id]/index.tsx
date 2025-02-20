import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { PaperView } from "@/types/paper";
import { displayDateTime, displayMoney } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditPaper from "@/components/modal/modal-edit-paper";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [paper, setPaper] = useState<PaperView>({})
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditPaper, setShowModalEditPaper] = useState<boolean>(false);

  const preloads = 'Company'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['paper', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/paper/' + id, { preloads }) : null
    },
  })

  const toggleModalEditPaper = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditPaper(!showModalEditPaper);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setPaper(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Paper Detail'}</title>
      </Head>
      <ModalEditPaper
        show={showModalEditPaper}
        onClickOverlay={toggleModalEditPaper}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Paper', path: '/paper' },
            { name: paper.name || id, path: '' },
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
                  <div>Paper</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Paper'
                    onClick={() => toggleModalEditPaper(paper.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="text-gray-600">{'Name'}</div>
                    <div className="">{paper.name}</div>
                    <div className="text-gray-600">{'Keterangan'}</div>
                    <div className="whitespace-pre-wrap">{paper.description || '-'}</div>
                    <div className="text-gray-600">{'Harga'}</div>
                    <div className="">{displayMoney(paper.defaultPrice)}</div>
                    <div className="text-gray-600">{'Harga Timbal Balik'}</div>
                    <div className="">{displayMoney(paper.defaultPriceDuplex)}</div>
                    <div className="text-gray-600">{'Create By'}</div>
                    <div className="">{paper.createName}</div>
                    <div className="text-gray-600">{'Create Date'}</div>
                    <div className="">{displayDateTime(paper.createDt)}</div>
                    <div className="text-gray-600">{'Last Update By'}</div>
                    <div className="">{paper.updateName}</div>
                    <div className="text-gray-600">{'Last Update Date'}</div>
                    <div className="">{displayDateTime(paper.updateDt)}</div>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(paper, null, 4)}
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