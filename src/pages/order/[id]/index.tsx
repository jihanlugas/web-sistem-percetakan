import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import ModalDelete from "@/components/modal/modal-delete";
import ModalEditOrder from "@/components/modal/modal-edit-order";
import ModalOrderPhase from "@/components/modal/modal-order-phase";
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
import { FaFilePdf } from "react-icons/fa6";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [order, setOrder] = useState<OrderView>(null)
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

  const { mutate: mutateSpk, isPending: isPendingSpk } = useMutation({
    mutationKey: ['print', 'spk'],
    mutationFn: (id: string) => Api.getpdfdisplay('/print/' + id + "/spk"),
  })

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

  const generateSpk = async (id: string) => {
    mutateSpk(id, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
  }

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
      <ModalEditOrderPrint
        show={showModalEditOrderPrint}
        onClickOverlay={toogleModalEditOrderPrint}
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
            { name: order?.name || id, path: '' },
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
                  <div>Order</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Order'
                    onClick={() => toggleModalEditOrder(order?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-4">{order?.name}</div>
                  <div className="text-gray-600">{'Description'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{order?.description || '-'}</div>
                  <div className="text-gray-600">{'Total Print'}</div>
                  <div className="col-span-4">{displayMoney(order?.totalPrint)}</div>
                  <div className="text-gray-600">{'Total Other'}</div>
                  <div className="col-span-4">{displayMoney(order?.totalOther)}</div>
                  <div className="text-gray-600 font-bold">{'Total Order'}</div>
                  <div className="col-span-4 font-bold">{displayMoney(order?.totalOrder)}</div>
                  <div className="text-gray-600 font-bold">{'Total Pembayaran'}</div>
                  <div className="col-span-4 text-green-500 font-bold">{displayMoney(order?.totalTransaction)}</div>
                  <div className="text-gray-600 font-bold">{'Sisa Pembayaran'}</div>
                  <div className="col-span-4 text-rose-500 font-bold">{displayMoney(order?.outstanding)}</div>
                  <div className="text-gray-600">{'Transaction Status'}</div>
                  {order?.outstanding > 0 ? (
                    <div className="col-span-4 text-rose-500 font-bold capitalize">{'Unpaid'}</div>
                  ) : (
                    <div className="col-span-4 text-green-500 font-bold capitalize">{'Full Paid'}</div>
                  )}
                  <div className="text-gray-600">{'Create By'}</div>
                  <div className="col-span-4">{order?.createName}</div>
                  <div className="text-gray-600">{'Create Date'}</div>
                  <div className="col-span-4">{displayDateTime(order?.createDt)}</div>
                  <div className="text-gray-600">{'Last Update By'}</div>
                  <div className="col-span-4">{order?.updateName}</div>
                  <div className="text-gray-600">{'Last Update Date'}</div>
                  <div className="col-span-4">{displayDateTime(order?.updateDt)}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-lg mb-4">Customer</div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-4">{order?.customer?.name || '-'}</div>
                  <div className="text-gray-600">{'Phone Number'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{displayPhoneNumber(order?.customer?.phoneNumber) || '-'}</div>
                  <div className="text-gray-600">{'Description'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{order?.customer?.description || '-'}</div>
                </div>
              </div>
              <hr className="mb-4" />
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Phase</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Delete'
                    onClick={() => toggleModalOrderPhase(order?.id)}
                  >
                    <BiPlus className='text-primary-500' size={'1.2rem'} />
                  </button>
                </div>
                <div>
                  <div className="flex overflow-x-auto mb-8">
                    {order?.orderphases?.map((orderphase, key) => {
                      return (
                        <div key={key} className="flex items-center">
                          {key !== 0 && (
                            <div className="w-16 flex justify-center items-center">
                              <FaLongArrowAltRight className="text-gray-500" size={"1.5rem"} />
                            </div>
                          )}
                          <div className="p-2 mx-4 w-36">
                            <div className="text-xl my-4 flex justify-center">{orderphase.name}</div>
                            <div className="flex justify-center">{orderphase.createName}</div>
                            <div className="text-sm text-gray-700 flex justify-center">{displayDateTime(orderphase.createDt)}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <hr className="mb-4" />
              <div className="mb-4">
                <div className="text-xl mb-4">Detail</div>
                <div className="text-sm">
                  <div>
                    <div className="text-xl flex justify-between items-center mb-2">
                      <div>Print</div>
                      <button
                        className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                        type="button"
                        title='Delete'
                        onClick={() => toogleModalEditOrderPrint()}
                      >
                        <BiPlus className='text-primary-500' size={'1.2rem'} />
                      </button>
                    </div>
                    <table className="w-full table-auto mb-12">
                      <thead className="">
                        <tr className="text-left border-2 border-gray-400">
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Name</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Kertas</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Timbal Balik</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Jumlah Lembar</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Qty</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Harga</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Total</div>
                          </th>
                          <th className="border-2 border-gray-400 w-32">
                            <div className="p-2 text-base font-normal">Action</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.prints?.length > 0 ? (
                          <>
                            {order?.prints.map((print, index) => (
                              <tr key={index} className="p-4 border-2 border-gray-400">
                                <td className="border-2 border-gray-400 ">
                                  <div className="p-2">
                                    <div data-tooltip-id={`tootltip-order-detail-transaction-prints-name-${print.id}`}>
                                      {print.name}
                                    </div>
                                    {print.description && (
                                      <Tooltip id={`tootltip-order-detail-transaction-prints-name-${print.id}`}>
                                        <div className="font-bold">Description</div>
                                        <div className="whitespace-pre-line">{print.description}</div>
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 ">
                                  <div className="p-2">
                                    <div data-tooltip-id={`tootltip-order-detail-transaction-prints-paper-${print.paper?.id}`}>
                                      {print.paper?.name || '-'}
                                    </div>
                                    {print.paper?.description && (
                                      <Tooltip id={`tootltip-order-detail-transaction-prints-paper-${print.paper?.id}`}>
                                        <div className="font-bold">Description</div>
                                        <div className="whitespace-pre-line">{print.paper?.description}</div>
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 ">
                                  <div className="p-2">
                                    {displayBoolean(print.isDuplex, 'Ya', 'Tidak')}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayNumber(print.pageCount as number)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayNumber(print.qty as number)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayMoney(print.price as number)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayMoney(print.total as number)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-center">
                                  <div className="p-2 w-full flex justify-center items-center">
                                    <button
                                      className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                      type="button"
                                      title={'SPK Print ' + print.name}
                                      disabled={isPendingSpk}
                                      onClick={() => generateSpk(print.id)}
                                    >
                                      <FaFilePdf className={'text-primary-500'} size={'1rem'} />
                                    </button>
                                    <button
                                      className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                      type="button"
                                      title='Edit'
                                      onClick={() => toogleModalEditOrderPrint(print.id)}
                                    >
                                      <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                                    </button>
                                    <button
                                      className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                      type="button"
                                      title='Delete'
                                      onClick={() => toggleModalDeletePrint(print.id)}
                                    >
                                      <VscTrash className='text-rose-500' size={'1.2rem'} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            <tr className="p-4 border-gray-400">
                              <td colSpan={7} className="text-right font-bold">
                                <div className="p-2"><span className="mr-4">{"Total Print"}</span><span>{displayMoney(order?.prints.reduce((total, print) => total + (print.total as number), 0))}</span></div>
                              </td>
                            </tr>
                          </>
                        ) : (
                          <tr className="border-2 border-gray-400">
                            <td colSpan={8} className="">
                              <div className="w-full flex justify-center items-center p-4">No Data</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="text-xl flex justify-between items-center mb-2">
                      <div>Other</div>
                      <button
                        className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                        type="button"
                        title='Delete'
                        onClick={() => toogleModalEditOrderOther()}
                      >
                        <BiPlus className='text-primary-500' size={'1.2rem'} />
                      </button>
                    </div>
                    <table className="w-full table-auto mb-12">
                      <thead className="">
                        <tr className="text-left border-2 border-gray-400">
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Name</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Qty</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Harga</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Total</div>
                          </th>
                          <th className="border-2 border-gray-400 w-32">
                            <div className="p-2 text-base font-normal">Action</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.others?.length > 0 ? (
                          <>
                            {order?.others.map((other, index) => (
                              <tr key={index} className="p-4 border-2 border-gray-400">
                                <td className="border-2 border-gray-400 ">
                                  <div className="p-2">
                                    <span data-tooltip-id={`tootltip-order-detail-transaction-others-name-${other.id}`}>
                                      {other.name}
                                    </span>
                                    {other.description && (
                                      <Tooltip id={`tootltip-order-detail-transaction-others-name-${other.id}`}>
                                        <div className="font-bold">Description</div>
                                        <div className="whitespace-pre-line">{other.description}</div>
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayNumber(other.qty as number)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayMoney(other.price as number)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayMoney(other.total as number)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-center">
                                  <div className="p-2 w-full flex justify-center items-center">
                                    <button
                                      className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                      type="button"
                                      title='Edit'
                                      onClick={() => toogleModalEditOrderOther(other.id)}
                                    >
                                      <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                                    </button>
                                    <button
                                      className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                      type="button"
                                      title='Delete'
                                      onClick={() => toggleModalDeleteOther(other.id)}
                                    >
                                      <VscTrash className='text-rose-500' size={'1.2rem'} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            <tr className="p-4 border-gray-400">
                              <td colSpan={4} className="text-right font-bold">
                                <div className="p-2"><span className="mr-4">{"Total Other"}</span><span>{displayMoney(order?.others.reduce((total, other) => total + (other.total as number), 0))}</span></div>
                              </td>
                            </tr>
                          </>
                        ) : (
                          <tr className="border-2 border-gray-400">
                            <td colSpan={5} className="">
                              <div className="w-full flex justify-center items-center p-4">No Data</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="text-xl flex justify-between items-center mb-2">
                      <div>Transaction</div>
                      <button
                        className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                        type="button"
                        title='Delete'
                        onClick={() => toogleModalEditOrderTransaction()}
                      >
                        <BiPlus className='text-primary-500' size={'1.2rem'} />
                      </button>
                    </div>
                    <table className="w-full table-auto mb-12">
                      <thead className="">
                        <tr className="text-left border-2 border-gray-400">
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Date</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Create Name</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Name</div>
                          </th>
                          <th className="border-2 border-gray-400">
                            <div className="p-2 text-base font-normal">Amount</div>
                          </th>
                          <th className="border-2 border-gray-400 w-32">
                            <div className="p-2 text-base font-normal">Action</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.transactions?.length > 0 ? (
                          <>
                            {order?.transactions.map((transaction, index) => (
                              <tr key={index} className="p-4 border-2 border-gray-400">
                                <td className="border-2 border-gray-400">
                                  <div className="p-2">
                                    {displayDateTime(transaction.createDt)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400">
                                  <div className="p-2">
                                    {transaction.createName}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 ">
                                  <div className="p-2">
                                    <span data-tooltip-id={`tootltip-order-detail-transaction-transactions-name-${transaction.id}`}>
                                      {transaction.name}
                                    </span>
                                    {transaction.description && (
                                      <Tooltip id={`tootltip-order-detail-transaction-transactions-name-${transaction.id}`}>
                                        <div className="font-bold">Description</div>
                                        <div className="whitespace-pre-line">{transaction.description}</div>
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-right">
                                  <div className="p-2">
                                    {displayMoney(transaction.amount as number)}
                                  </div>
                                </td>
                                <td className="border-2 border-gray-400 text-center">
                                  <div className="p-2 w-full flex justify-center items-center">
                                    <button
                                      className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                      type="button"
                                      title='Edit'
                                      onClick={() => toogleModalEditOrderTransaction(transaction.id)}
                                    >
                                      <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                                    </button>
                                    <button
                                      className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                      type="button"
                                      title='Delete'
                                      onClick={() => toggleModalDeleteTransaction(transaction.id)}
                                    >
                                      <VscTrash className='text-rose-500' size={'1.2rem'} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            <tr className="p-4 border-gray-400">
                              <td colSpan={5} className="text-right font-bold">
                                <div className="p-2"><span className="mr-4">{"Total Transaction"}</span><span>{displayMoney(order?.transactions.reduce((total, transaction) => total + (transaction.amount as number), 0))}</span></div>
                              </td>
                            </tr>
                          </>
                        ) : (
                          <tr className="border-2 border-gray-400">
                            <td colSpan={5} className="">
                              <div className="w-full flex justify-center items-center p-4">No Data</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(order, null, 4)}
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