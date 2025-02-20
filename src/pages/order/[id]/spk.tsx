import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import ModalDelete from "@/components/modal/modal-delete";
import ModalEditOrder from "@/components/modal/modal-edit-order";
import ModalOrderPhase from "@/components/modal/modal-order-phase";
import ModalEditOrderDesign from "@/components/modal/modal-edit-order-design";
import ModalEditOrderFinishing from "@/components/modal/modal-edit-order-finishing";
import ModalEditOrderOther from "@/components/modal/modal-edit-order-other";
import ModalEditOrderTransaction from "@/components/modal/modal-edit-order-transaction";
import ModalEditOrderPrint from "@/components/modal/modal-edit-order-print";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { OrderView } from "@/types/order";
import { displayBoolean, displayDateTime, displayMoney, displayNumber, displayPhoneNumber } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import { FaLongArrowAltRight } from "react-icons/fa";
import { RiPencilLine } from "react-icons/ri";
import { VscTrash } from "react-icons/vsc";
import { Tooltip } from "react-tooltip";
import html2pdf from "html2pdf.js"


type Props = {
  id: string
}

const Spk: NextPage<Props> = ({ id }) => {


  const [order, setOrder] = useState<OrderView>({})
  const [selectedId, setSelectedId] = useState<string>('')
  const [deleteId, setDeleteId] = useState<string>('')

  const [showModalEditOrder, setShowModalEditOrder] = useState<boolean>(false);
  const [showModalOrderPhase, setShowModalOrderPhase] = useState<boolean>(false);

  const [showModalEditOrderDesign, setShowModalEditOrderDesign] = useState<boolean>(false);
  const [showModalEditOrderPrint, setShowModalEditOrderPrint] = useState<boolean>(false);
  const [showModalEditOrderFinishing, setShowModalEditOrderFinishing] = useState<boolean>(false);
  const [showModalEditOrderOther, setShowModalEditOrderOther] = useState<boolean>(false);
  const [showModalEditOrderTransaction, setShowModalEditOrderTransaction] = useState<boolean>(false);

  const [showModalDeleteDesign, setShowModalDeleteDesign] = useState<boolean>(false);
  const [showModalDeletePrint, setShowModalDeletePrint] = useState<boolean>(false);
  const [showModalDeleteFinishing, setShowModalDeleteFinishing] = useState<boolean>(false);
  const [showModalDeleteOther, setShowModalDeleteOther] = useState<boolean>(false);
  const [showModalDeleteTransaction, setShowModalDeleteTransaction] = useState<boolean>(false);

  const preloads = 'Customer,Orderphases,Transactions,Designs,Prints,Prints.Paper,Finishings,Others'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['order', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/order/' + id, { preloads }) : null
    },
  })

  const { mutate: mutateDeleteDesign, isPending: isPendingDeleteDesign } = useMutation({
    mutationKey: ['design', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/design/' + id)
  });

  const { mutate: mutateDeletePrint, isPending: isPendingDeletePrint } = useMutation({
    mutationKey: ['print', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/print/' + id)
  });

  const { mutate: mutateDeleteFinishing, isPending: isPendingDeleteFinishing } = useMutation({
    mutationKey: ['finishing', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/finishing/' + id)
  });

  const { mutate: mutateDeleteOther, isPending: isPendingDeleteOther } = useMutation({
    mutationKey: ['other', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/other/' + id)
  });

  const { mutate: mutateDeleteTransaction, isPending: isPendingDeleteTransaction } = useMutation({
    mutationKey: ['transaction', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/transaction/' + id)
  });

  const toggleModalEditOrder = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditOrder(!showModalEditOrder);
  };

  const toggleModalOrderPhase = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalOrderPhase(!showModalOrderPhase);
  };

  const toogleModalEditOrderDesign = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditOrderDesign(!showModalEditOrderDesign)
  }

  const toogleModalEditOrderPrint = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditOrderPrint(!showModalEditOrderPrint)
  }

  const toogleModalEditOrderFinishing = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditOrderFinishing(!showModalEditOrderFinishing)
  }

  const toogleModalEditOrderOther = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditOrderOther(!showModalEditOrderOther)
  }

  const toogleModalEditOrderTransaction = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditOrderTransaction(!showModalEditOrderTransaction)
  }

  const toggleModalDeleteDesign = (id = '') => {
    setDeleteId(id);
    setShowModalDeleteDesign(!showModalDeleteDesign);
  };

  const toggleModalDeletePrint = (id = '') => {
    setDeleteId(id);
    setShowModalDeletePrint(!showModalDeletePrint);
  };

  const toggleModalDeleteFinishing = (id = '') => {
    setDeleteId(id);
    setShowModalDeleteFinishing(!showModalDeleteFinishing);
  };

  const toggleModalDeleteOther = (id = '') => {
    setDeleteId(id);
    setShowModalDeleteOther(!showModalDeleteOther);
  };

  const toggleModalDeleteTransaction = (id = '') => {
    setDeleteId(id);
    setShowModalDeleteTransaction(!showModalDeleteTransaction);
  };

  const handleDeleteDesign = () => {
    mutateDeleteDesign(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDeleteDesign();
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

  const handleDeletePrint = () => {
    mutateDeletePrint(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDeletePrint();
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

  const handleDeleteFinishing = () => {
    mutateDeleteFinishing(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDeleteFinishing();
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

  const handleDeleteOther = () => {
    mutateDeleteOther(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDeleteOther();
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

  const handleDeleteTransaction = () => {
    mutateDeleteTransaction(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDeleteTransaction();
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

  const generatePDF = () => {
    const element = document.getElementById('content-to-pdf'); // ID of the element to convert
    const options = {
      filename: 'download.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    // html2pdf().from(element).set(options).save();
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setOrder(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Order Detail'}</title>
      </Head>
      <ModalEditOrder
        show={showModalEditOrder}
        onClickOverlay={toggleModalEditOrder}
        id={selectedId}
      />
      <ModalOrderPhase
        show={showModalOrderPhase}
        onClickOverlay={toggleModalOrderPhase}
        id={selectedId}
      />
      <ModalEditOrderDesign
        show={showModalEditOrderDesign}
        onClickOverlay={toogleModalEditOrderDesign}
        id={selectedId}
        order={order}
      />
      <ModalEditOrderPrint
        show={showModalEditOrderPrint}
        onClickOverlay={toogleModalEditOrderPrint}
        id={selectedId}
        order={order}
      />
      <ModalEditOrderFinishing
        show={showModalEditOrderFinishing}
        onClickOverlay={toogleModalEditOrderFinishing}
        id={selectedId}
        order={order}
      />
      <ModalEditOrderOther
        show={showModalEditOrderOther}
        onClickOverlay={toogleModalEditOrderOther}
        id={selectedId}
        order={order}
      />
      <ModalEditOrderTransaction
        show={showModalEditOrderTransaction}
        onClickOverlay={toogleModalEditOrderTransaction}
        id={selectedId}
        order={order}
      />
      <ModalDelete
        show={showModalDeleteDesign}
        onClickOverlay={toggleModalDeleteDesign}
        onDelete={handleDeleteDesign}
        isLoading={isPendingDeleteDesign}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDelete>
      <ModalDelete
        show={showModalDeletePrint}
        onClickOverlay={toggleModalDeletePrint}
        onDelete={handleDeletePrint}
        isLoading={isPendingDeletePrint}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDelete>
      <ModalDelete
        show={showModalDeleteFinishing}
        onClickOverlay={toggleModalDeleteFinishing}
        onDelete={handleDeleteFinishing}
        isLoading={isPendingDeleteFinishing}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDelete>
      <ModalDelete
        show={showModalDeleteOther}
        onClickOverlay={toggleModalDeleteOther}
        onDelete={handleDeleteOther}
        isLoading={isPendingDeleteOther}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDelete>
      <ModalDelete
        show={showModalDeleteTransaction}
        onClickOverlay={toggleModalDeleteTransaction}
        onDelete={handleDeleteTransaction}
        isLoading={isPendingDeleteTransaction}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDelete>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Order', path: '/order' },
            { name: order.name || id, path: '/order/' + id },
            { name: 'SPK', path: '' },
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
            <div id="content-to-pdf">
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>SPK</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Download PDF'
                    onClick={() => generatePDF()}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
              </div>
              <div className="mb-4 max-w-4xl mx-auto shadow">
                TEst
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Spk as PageWithLayoutType).layout = MainAuth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Spk;