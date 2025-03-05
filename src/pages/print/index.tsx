import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import Table from "@/components/table/table";
import { Api } from "@/lib/api";
import { PrintView, PagePrint } from "@/types/print";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { displayBoolean, displayDateTime, displayMoney, displayNumber } from "@/utils/formater";
import { removeEmptyValues } from "@/utils/helper";
import notif from "@/utils/notif";
import { isEmptyObject } from "@/utils/validate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { CgChevronDown } from "react-icons/cg";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import ModalFilter from "@/components/modal/modal-filter-print";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = object

type PropsDropdownMore = {
  toggleModalDelete: (id: string, name: string) => void
}

const DropdownMore: NextPage<CellContext<PrintView, unknown> & PropsDropdownMore> = ({
  row,
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
    mutationKey: ['print', 'spk'],
    mutationFn: (id: string) => Api.getpdf('/print/' + id + "/spk"),
  })

  const generateSpk = async (id: string) => {
    mutateSpk(id, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
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
          <button onClick={() => generateSpk(row.original.id)} className={'px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left flex '}>
            <div className="mr-2">
              {'SPK'}
            </div>
            {isPendingSpk && <AiOutlineLoading3Quarters className={'animate-spin text-primary-500'} size={'1rem'} />}
          </button>
          <hr />
          <Link href={{ pathname: '/print/[id]', query: { id: row.original.id } }}>
            <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'} title='Edit'>
              {'Detail'}
            </div>
          </Link>
          <button onClick={() => handleClickDelete(row.original.id, row.original.name)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Index: NextPage<Props> = () => {

  const [print, setPrint] = useState<PrintView[]>([]);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const [filter, setFilter] = useState<PagePrint>({
    name: '',
    description: '',
    startTotalPrint: '',
    endTotalPrint: '',
    startDt: '',
    endDt: '',
  })

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PagePrint>({
    limit: 10,
    page: 1,
    preloads: "Company,Order",
  });

  const column: ColumnDef<PrintView>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Nama Print"}
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
      id: 'order_name',
      accessorKey: 'orderName',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Nama Order"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <>
            <div className='w-full capitalize'>
              {getValue() as string}
            </div>
          </>
        )
      },
    },
    {
      id: 'paper_name',
      accessorKey: 'paperName',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Nama Kertas"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <>
            <div className='w-full capitalize'>
              {getValue() as string}
            </div>
          </>
        )
      },
    },
    {
      id: 'is_duplex',
      accessorKey: 'isDuplex',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Timbal Balik"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <>
            <div className='w-full capitalize'>
              {displayBoolean(getValue() as boolean, "Ya", "Tidak")}
            </div>
          </>
        )
      },
    },
    {
      id: 'page_count',
      accessorKey: 'pageCount',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Jumlah Lembar"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <>
            <div className='w-full'>
              <span>{displayNumber(getValue() as number)}</span>
            </div>
          </>
        )
      },
    },
    {
      id: 'qty',
      accessorKey: 'qty',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Qty"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <>
            <div className='w-full'>
              <span>{displayNumber(getValue() as number)}</span>
            </div>
          </>
        )
      },
    },
    {
      id: 'price',
      accessorKey: 'price',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Harga"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <>
            <div className='w-full capitalize'>
              <span>{displayMoney(getValue() as number)}</span>
            </div>
          </>
        )
      },
    },
    {
      id: 'total',
      accessorKey: 'total',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Total Print"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <>
            <div className='w-full capitalize'>
              <span>{displayMoney(getValue() as number)}</span>
            </div>
          </>
        )
      },
    },
    {
      id: 'create_dt',
      accessorKey: 'createDt',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Tanggal"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <>
            <div className='w-full capitalize'>
              {displayDateTime(getValue() as string)}
            </div>
          </>
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
            toggleModalDelete={toggleModalDelete}
            {...props}
          />
        );
      },
    },
  ]

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['print', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/print', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['print', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/print/' + id)
  });

  const toggleModalFilter = () => {
    setShowModalFilter(!showModalFilter);
  }

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
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
      setPrint(data.payload.list);
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
        <title>{process.env.APP_NAME + ' - Print'}</title>
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
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Print', path: '' },
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
                  <Link href={{ pathname: '/print/new' }}>
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
                data={print}
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