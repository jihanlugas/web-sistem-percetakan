import MainAuth from "@/components/layout/main-auth";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import Table from "@/components/table/table";
import { Api } from "@/lib/api";
import { OrderView, PageOrder } from "@/types/order";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { displayDateTime, displayMoney, displayPhoneNumber } from "@/utils/formater";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import notif from '@/utils/notif';
import Breadcrumb from "@/components/component/breadcrumb";
import { CgChevronDown } from "react-icons/cg";
import ModalOrderPhase from "@/components/modal/modal-order-phase";
import ModalOrderTransaction from "@/components/modal/modal-order-transaction";
import { Tooltip } from "react-tooltip";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import ModalFilter from "@/components/modal/modal-filter-order";
import { removeEmptyValues } from "@/utils/helper";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import { isEmptyObject } from "@/utils/validate";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = object

type PropsDropdownMore = {
  toggleModalOrderPhase: (id?: string, refresh?: boolean) => void
  toggleModalOrderTransaction: (id?: string, refresh?: boolean) => void
  toggleModalDelete: (id: string, name: string) => void
}

const DropdownMore: NextPage<CellContext<OrderView, unknown> & PropsDropdownMore> = ({
  row,
  toggleModalOrderPhase,
  toggleModalOrderTransaction,
  toggleModalDelete,
}) => {
  const refMore = useRef<HTMLDivElement>(null);
  const [moreBar, setMoreBar] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (moreBar && refMore.current && !refMore.current.contains(e.target)) {
        setMoreBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [moreBar]);

  const { mutate: mutateSpk, isPending: isPendingSpk } = useMutation({
    mutationKey: ['order', 'spk'],
    mutationFn: (id: string) => Api.getpdf('/order/' + id + "/spk"),
  })

  const { mutate: mutateInvoice, isPending: isPendingInvoice } = useMutation({
    mutationKey: ['order', 'invoice'],
    mutationFn: (id: string) => Api.getpdf('/order/' + id + "/invoice"),
  })

  const generateSpk = async (id: string) => {
    mutateSpk(id, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
  }

  const generateInvoice = async (id: string) => {
    mutateInvoice(id, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
  }

  const handleClickPhase = (id) => {
    setMoreBar(false);
    toggleModalOrderPhase(id, false);
  }

  const handleClickTransaction = (id) => {
    setMoreBar(false);
    toggleModalOrderTransaction(id, false);
  }

  const handleClickDelete = (id, name) => {
    setMoreBar(false);
    toggleModalDelete(id, name)
  }

  return (
    <div className="relative inline-block py-2 text-right" ref={refMore}>
      <button className="flex justify-center items-center text-primary-500" type="button" onClick={() => setMoreBar(!moreBar)} >
        <div>More</div>
        <CgChevronDown size={'1.2rem'} className={'ml-2'} />
      </button>
      <div className={`z-50 absolute right-0 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none duration-300 ease-in-out ${!moreBar && 'scale-0 shadow-none ring-0'}`}>
        <div className="" role="none">
          <button onClick={() => handleClickPhase(row.original.id)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Phase'}
          </button>
          <button onClick={() => handleClickTransaction(row.original.id)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Transaction'}
          </button>
          <hr />
          <button onClick={() => generateSpk(row.original.id)} className={'px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left flex '}>
            <div className="mr-2">
              {'SPK'}
            </div>
            {isPendingSpk && <AiOutlineLoading3Quarters className={'animate-spin text-primary-500'} size={'1rem'} />}
          </button>
          <button onClick={() => generateInvoice(row.original.id)} className={'px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left flex '}>
            <div className="mr-2">
              {'Invoice'}
            </div>
            {isPendingInvoice && <AiOutlineLoading3Quarters className={'animate-spin text-primary-500'} size={'1rem'} />}
          </button>
          <hr />
          <Link href={{ pathname: '/order/[id]', query: { id: row.original.id } }}>
            <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'} title='Edit'>
              {'Detail'}
            </div>
          </Link>
          {/* <Link href={{ pathname: '/order/[id]/edit', query: { id: row.original.id } }}>
            <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'} title='Edit'>
              {'Edit'}
            </div>
          </Link> */}
          <button onClick={() => handleClickDelete(row.original.id, row.original.name)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Index: NextPage<Props> = () => {

  const [order, setOrder] = useState<OrderView[]>([]);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalOrderPhase, setShowModalOrderPhase] = useState<boolean>(false);
  const [showModalOrderTransaction, setShowModalOrderTransaction] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const [filter, setFilter] = useState<PageOrder>({
    customerId: '',
    phaseId: '',
    name: '',
    description: '',
    startTotalOrder: '',
    endTotalOrder: '',
    startDt: '',
    endDt: '',
  })

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageOrder>({
    limit: 10,
    page: 1,
    preloads: "Orderphases,Customer,Transactions",
  });

  const column: ColumnDef<OrderView>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Nama Order"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <>
            <div className='w-full capitalize'>
              <span data-tooltip-id={`tootltip-name-${row.original.id}`}>{getValue() as string}</span>
              {row.original.description && (
                <Tooltip id={`tootltip-name-${row.original.id}`} clickable>
                  <div className="font-bold">Description</div>
                  <div className="whitespace-pre-line">{row.original.description}</div>
                </Tooltip>
              )}
            </div>
          </>
        )
      },
    },
    {
      id: 'customer_name',
      accessorKey: 'customerName',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Pelanggan"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-customerName-${row.original.id}`}>{getValue() as string}</span>
            {row.original.customer && (
              <Tooltip id={`tootltip-customerName-${row.original.id}`} clickable>
                <div className="font-bold">{row.original.customer.name}</div>
                {row.original.customer.phoneNumber && (
                  <div className="">{displayPhoneNumber(row.original.customer.phoneNumber)}</div>
                )}
                {row.original.customer.description && (
                  <div className="">{row.original.customer.description}</div>
                )}
              </Tooltip>
            )}
          </div>
        )
      },
    },
    {
      id: 'create_name',
      accessorKey: 'createName',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Customer Service"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            {getValue() as string}
          </div>
        )
      },
    },
    {
      id: 'orderphase_name',
      accessorKey: 'orderphaseName',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Phase"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className="w-full capitalize">
            <span data-tooltip-id={`tootltip-orderphases-${row.original.id}`}>{getValue() as string}</span>
            <Tooltip id={`tootltip-orderphases-${row.original.id}`} clickable>
              <div className="flex">
                {row.original.orderphases?.map((orderphase, key) => (
                  <div key={key} className="flex items-center">
                    {key !== 0 && (
                      <div className="w-8 flex justify-center items-center">
                        <FaLongArrowAltRight className="" size={"0.8rem"} />
                      </div>
                    )}
                    <div className="p-1 mx-2 w-30">
                      <div className="flex justify-center font-bold mb-2">{orderphase.name}</div>
                      <div className="flex justify-center">{orderphase.createName}</div>
                      <div className="flex justify-center text-xs">{displayDateTime(orderphase.createDt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      id: 'total_order',
      accessorKey: 'totalOrder',
      header: () => {
        return (
          <div className='whitespace-nowrap w-full text-center'>
            {"Total Order"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <>
            <div className='w-full capitalize text-right'>
              <span data-tooltip-id={`tootltip-totalOrder-${row.original.id}`}>{displayMoney(getValue() as number)}</span>
              <Tooltip id={`tootltip-totalOrder-${row.original.id}`} clickable>
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="mr-2">Total Design</div>
                    <div className="ml-2 font-bold">{displayMoney(row.original.totalDesign as number)}</div>
                  </div>
                  <div className="flex justify-between mb-1">
                    <div className="mr-2">Total Print</div>
                    <div className="ml-2 font-bold">{displayMoney(row.original.totalPrint as number)}</div>
                  </div>
                  <div className="flex justify-between mb-1">
                    <div className="mr-2">Total Finishing</div>
                    <div className="ml-2 font-bold">{displayMoney(row.original.totalFinishing as number)}</div>
                  </div>
                  <div className="flex justify-between mb-1">
                    <div className="mr-2">Total Other</div>
                    <div className="ml-2 font-bold">{displayMoney(row.original.totalOther as number)}</div>
                  </div>
                  <hr className="mb-1" />
                  <div className="flex justify-between mb-1">
                    <div className="mr-2">Total Order</div>
                    <div className="ml-2 font-bold">{displayMoney(row.original.totalOrder as number)}</div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </>
        )
      },
    },
    {
      id: 'total_transaction',
      accessorKey: 'totalTransaction',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Total Pembayaran"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <div className="" style={{ display: "ruby" }} data-tooltip-id={`tootltip-transactions-${row.original.id}`}>
              {row.original.outstanding === 0 && (
                <span className="h-8 w-8 mr-2">
                  <FaCheck className="text-green-500" size={"1.2rem"} />
                </span>
              )}
              <span>{displayMoney(getValue() as number)}</span>
            </div>
            {row.original.transactions && (
              <Tooltip id={`tootltip-transactions-${row.original.id}`} clickable>
                {row.original.transactions.map((transaction, key) => (
                  <div key={key} className="flex justify-between mb-1">
                    <div className="mr-2">
                      <div>{displayDateTime(transaction.createDt) + " | " + transaction.name}</div>
                    </div>
                    <div className="ml-2 font-bold flex items-center">{displayMoney(transaction.amount as number)}</div>
                  </div>
                ))}
                <hr className="mb-1" />
                <div className="flex justify-between mb-1">
                  <div className="mr-2">Total Pembayaran</div>
                  <div className="ml-2 font-bold text-green-500">{displayMoney(row.original.totalTransaction as number)}</div>
                </div>
                {row.original.outstanding > 0 ? (
                  <div className="flex justify-between mb-1">
                    <div className="mr-2">Sisa Tagihan</div>
                    <div className="ml-2 font-bold text-rose-500">{displayMoney(row.original.outstanding as number)}</div>
                  </div>
                ) : (
                  <div className="mb-2 font-bold flex justify-end items-center text-green-500">
                    <FaCheck className="mr-2" size={"1rem"} />
                    <div>Lunas</div>
                  </div>
                )}
              </Tooltip>
            )}
          </div>
        )
      },
    },
    {
      id: 'outstanding',
      accessorKey: 'outstanding',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Sisa Tagihan"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            {displayMoney(getValue() as number)}
          </div>
        )
      },
    },
    {
      id: 'create_dt',
      accessorKey: 'createDt',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Tanggal Order"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            {displayDateTime(getValue() as string)}
          </div>
        )
      },
    },
    {
      id: 'id',
      header: 'Action',
      enableSorting: false,
      enableResizing: false,
      size: 50,
      maxSize: 50,
      cell: (props) => {
        return (
          <DropdownMore
            toggleModalOrderPhase={toggleModalOrderPhase}
            toggleModalOrderTransaction={toggleModalOrderTransaction}
            toggleModalDelete={toggleModalDelete}
            {...props}
          />
        );
      },
    },
  ]

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['order', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/order', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['order', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/order/' + id)
  });

  const toggleModalFilter = () => {
    setShowModalFilter(!showModalFilter);
  }

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
  };

  const toggleModalOrderPhase = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalOrderPhase(!showModalOrderPhase);
  };

  const toggleModalOrderTransaction = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalOrderTransaction(!showModalOrderTransaction);
  };


  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDelete();
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
    if (data?.status) {
      setOrder(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  useEffect(() => {
    setPageRequest(removeEmptyValues({
      ...pageRequest,
      ...filter,
      startDt: filter.startDt ? new Date(filter.startDt as string) : '',
      endDt: filter.endDt ? new Date(new Date(filter.endDt as string).setHours(23, 59, 59, 999)) : '',
    }))
  }, [filter])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Order'}</title>
      </Head>
      <ModalFilter
        show={showModalFilter}
        onClickOverlay={toggleModalFilter}
        filter={filter}
        setFilter={setFilter}
      />
      <ModalDeleteVerify
        show={showModalDelete}
        onClickOverlay={toggleModalDelete}
        onDelete={handleDelete}
        verify={deleteVerify}
        isLoading={isPendingDelete}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDeleteVerify>
      <ModalOrderPhase
        show={showModalOrderPhase}
        onClickOverlay={toggleModalOrderPhase}
        id={selectedId}
      />
      <ModalOrderTransaction
        show={showModalOrderTransaction}
        onClickOverlay={toggleModalOrderTransaction}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Order', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div className='flex justify-between items-center px-2 mb-4'>
              <div>
                <div className='text-xl'>{ }</div>
              </div>
              <div className='flex'>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 shadow hover:scale-110' onClick={() => toggleModalFilter()}>
                    {isEmptyObject(removeEmptyValues(filter)) ? <TbFilter className='text-primary-500' size={'1.2rem'} /> : <TbFilterFilled className='text-primary-500' size={'1.2rem'} />}
                  </button>
                </div>
                <div className='ml-2'>
                  <Link href={{ pathname: '/order/new' }}>
                    <div className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 shadow hover:scale-110'>
                      <BiPlus className='text-primary-500' size={'1.2rem'} />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={order}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;