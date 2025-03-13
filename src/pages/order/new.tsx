import Breadcrumb from "@/components/component/breadcrumb";
import DropdownField from "@/components/formik/dropdown-field";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import MainAuth from "@/components/layout/main-auth";
import ModalCreateOrderPrint from "@/components/modal/modal-create-order-print";
import ModalCreateOrderOther from "@/components/modal/modal-create-order-other";
import { Api } from "@/lib/api";
import { CustomerView, PageCustomer } from "@/types/customer";
import PageWithLayoutType from "@/types/layout";
import { CreateOrder, CreateOrderPrint, CreateOrderOther } from "@/types/order";
import { displayMoney, displayNumber, displayBoolean } from "@/utils/formater";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikHelpers, FieldArray, FormikProps, FormikValues } from "formik";
import Head from "next/head";
import { NextPage } from "next/types";
import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { RiPencilLine } from "react-icons/ri";
import { VscTrash } from "react-icons/vsc";
import * as Yup from 'yup';
import { PagePaper, PaperView } from "@/types/paper";
import { PagePhase, PhaseView } from "@/types/phase";
import notif from "@/utils/notif";
import ButtonSubmit from "@/components/formik/button-submit";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";

type Props = object

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
});

const pageRequestCustomer: PageCustomer = {
  limit: -1,
}

const pageRequestPaper: PagePaper = {
  limit: -1,
}

const pageRequestPhase: PagePhase = {
  limit: -1,
}

const defaultInitFormikValuePrint: CreateOrderPrint = {
  name: '',
  description: '',
  paperId: '',
  isDuplex: false,
  pageCount: '',
  qty: '',
  price: '',
  total: ''
}

const defaultInitFormikValueOther: CreateOrderOther = {
  name: '',
  description: '',
  qty: '',
  price: '',
  total: ''
}

const initFormikValue: CreateOrder = {
  companyId: '',
  customerId: '',
  orderphaseId: '',
  name: '',
  description: '',
  newCustomer: '',
  newCustomerPhone: '',
  prints: [],
  others: [],
}

const New: NextPage<Props> = () => {

  const router = useRouter();

  const formRef = useRef<FormikProps<CreateOrder> | null>(null)

  const [customers, setCustomers] = useState<CustomerView[]>([]);
  const [papers, setPapers] = useState<PaperView[]>([]);
  const [phases, setPhases] = useState<PhaseView[]>([]);


  const [showModalCreateOrderPrint, setShowModalCreateOrderPrint] = useState<boolean>(false);
  const [initFormikValuePrint, setInitFormikValuePrint] = useState<CreateOrderPrint>(defaultInitFormikValuePrint);
  const [dataPrintIndex, setDataPrintIndex] = useState<number>(-1);

  const [showModalCreateOrderOther, setShowModalCreateOrderOther] = useState<boolean>(false);
  const [initFormikValueOther, setInitFormikValueOther] = useState<CreateOrderOther>(defaultInitFormikValueOther);
  const [dataOtherIndex, setDataOtherIndex] = useState<number>(-1);

  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { isLoading: isLoadingCustomer, data: dataCustomer } = useQuery({
    queryKey: ['customer', pageRequestCustomer],
    queryFn: ({ queryKey }) => Api.get('/customer', queryKey[1] as object),
  });

  const { isLoading: isLoadingPaper, data: dataPaper } = useQuery({
    queryKey: ['paper', pageRequestPaper],
    queryFn: ({ queryKey }) => Api.get('/paper', queryKey[1] as object),
  });

  const { isLoading: isLoadingPhase, data: dataPhase } = useQuery({
    queryKey: ['phase', pageRequestPhase],
    queryFn: ({ queryKey }) => Api.get('/phase', queryKey[1] as object),
  });

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['order', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/order', val),
  });

  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);

  useEffect(() => {
    if (dataCustomer?.status) {
      setCustomers(dataCustomer.payload.list);
    }
  }, [dataCustomer]);

  useEffect(() => {
    if (dataPaper?.status) {
      setPapers(dataPaper.payload.list);
    }
  }, [dataPaper]);

  useEffect(() => {
    if (dataPhase?.status) {
      setPhases(dataPhase.payload.list);
    }
  }, [dataPhase]);

  const toggleModalCreateOrderPrint = (index: number = -1, initFormikValuePrint: CreateOrderPrint = defaultInitFormikValuePrint) => {
    setDataPrintIndex(index);
    setInitFormikValuePrint(initFormikValuePrint);
    setShowModalCreateOrderPrint(!showModalCreateOrderPrint);
  }

  const toggleModalCreateOrderOther = (index: number = -1, initFormikValueOther: CreateOrderOther = defaultInitFormikValueOther) => {
    setDataOtherIndex(index);
    setInitFormikValueOther(initFormikValueOther);
    setShowModalCreateOrderOther(!showModalCreateOrderOther);
  }

  const handleChangeCustomerType = (setFieldValue, val: boolean) => {
    setIsNewCustomer(val);
    setFieldValue('customerId', '');
    setFieldValue('newCustomer', '');
    setFieldValue('newCustomerPhone', '');
  }

  const handleSubmit = async (values: CreateOrder, formikHelpers: FormikHelpers<CreateOrder>) => {
    values.companyId = loginUser?.payload?.company?.id
    if (values.orderphaseId === "") {
      values.orderphaseId = phases[0]?.id
    }

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/order')
        } else if (payload?.listError) {
          formikHelpers.setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Buat Order'}</title>
      </Head>
      <ModalCreateOrderPrint
        show={showModalCreateOrderPrint}
        onClickOverlay={toggleModalCreateOrderPrint}
        formRef={formRef}
        dataPrintIndex={dataPrintIndex}
        initFormikValue={initFormikValuePrint}
        papers={papers}
        isLoadingPaper={isLoadingPaper}
      />
      <ModalCreateOrderOther
        show={showModalCreateOrderOther}
        onClickOverlay={toggleModalCreateOrderOther}
        formRef={formRef}
        dataOtherIndex={dataOtherIndex}
        initFormikValue={initFormikValueOther}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Order', path: '/order' },
            { name: 'Buat', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Buat Order</div>
          </div>
          <div>
            <Formik
              innerRef={formRef}
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl ">
                      <div className="flex items-center">
                        <label className="flex items-center mr-4">
                          <input type="radio" className="h-4 w-4 mr-2 accent-current" name="custamerType" value={"old"} onChange={() => handleChangeCustomerType(setFieldValue, false)} checked={!isNewCustomer} />
                          <span>Pelanggan Lama</span>
                        </label>
                        <label className="flex items-center mr-4">
                          <input type="radio" className="h-4 w-4 mr-2 accent-current" name="custamerType" value={"new"} onChange={() => handleChangeCustomerType(setFieldValue, true)} checked={isNewCustomer} />
                          <span>Pelanggan Baru</span>
                        </label>
                      </div>
                    </div>
                    {isNewCustomer ? (
                      <>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Nama Pelanggan'}
                            name={'newCustomer'}
                            type={'text'}
                            placeholder={'Nama Pelanggan'}
                          />
                        </div>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'No Handphone Pelanggan'}
                            name={'newCustomerPhone'}
                            type={'text'}
                            placeholder={'628...'}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="mb-4 max-w-xl">
                        <DropdownField
                          label={"Pelanggan"}
                          name={"customerId"}
                          items={customers}
                          keyValue={"id"}
                          keyLabel={"name"}
                          isLoading={isLoadingCustomer}
                          placeholder="Pilih Pelanggan"
                          placeholderValue={""}
                          field={true}
                        />
                      </div>
                    )}
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Nama Order'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Order'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextAreaField
                        label={'Keterangan'}
                        name={'description'}
                        placeholder={'Keterangan'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <DropdownField
                        label={"Phase"}
                        name={"orderphaseId"}
                        items={phases}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingPhase}
                        field={true}
                        required
                      />
                    </div>
                    <div className="mt-8 mb-8">
                      <FieldArray
                        name={'prints'}
                        render={(arrayHelpers) => (
                          <div className="mb-12">
                            <div className="text-xl flex justify-between items-center mb-2">
                              <div>Print</div>
                              <button
                                className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                type="button"
                                title='Tambah Print'
                                onClick={() => toggleModalCreateOrderPrint()}
                              >
                                <BiPlus className='text-primary-500' size={'1.2rem'} />
                              </button>
                            </div>
                            <table className="w-full table-auto">
                              <thead className="">
                                <tr className="text-left border-2 border-gray-400">
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Name</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Kertas</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Timbal Balik</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Jumlah Lembar</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Qty</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Harga</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Total Print</div>
                                  </th>
                                  <th className="border-2 border-gray-400 w-32">
                                    <div className="p-2 text-lg font-normal">Action</div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.prints.length > 0 ? (
                                  <>
                                    {values.prints.map((item, index) => (
                                      <tr key={index} className="p-4 border-2 border-gray-400">
                                        <td className="border-2 border-gray-400 ">
                                          <div className="p-2">
                                            <span data-tooltip-id={`tootltip-order-new-prints-name-${index}`}>
                                              {item.name}
                                            </span>
                                            {item.description && (
                                              <Tooltip id={`tootltip-order-new-prints-name-${index}`}>
                                                <div className="font-bold">Description</div>
                                                <div className="whitespace-pre-line">{item.description}</div>
                                              </Tooltip>
                                            )}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 ">
                                          <div className="p-2">
                                            <span data-tooltip-id={`tootltip-order-new-prints-paper-${index}`}>
                                              {papers.find((paper) => paper.id === item.paperId)?.name}
                                            </span>
                                          </div>
                                          {papers.find((paper) => paper.id === item.paperId)?.description && (
                                            <Tooltip id={`tootltip-order-new-prints-paper-${index}`}>
                                              <div className="font-bold">Paper Description</div>
                                              <div className="whitespace-pre-line">{papers.find((paper) => paper.id === item.paperId)?.description}</div>
                                            </Tooltip>
                                          )}
                                        </td>
                                        <td className="border-2 border-gray-400 ">
                                          <div className="p-2">
                                            {displayBoolean(item.isDuplex, 'Ya', 'Tidak')}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-right">
                                          <div className="p-2">
                                            {displayNumber(item.pageCount as number)}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-right">
                                          <div className="p-2">
                                            {displayNumber(item.qty as number)}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-right">
                                          <div className="p-2">
                                            {displayMoney(item.price as number)}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-right">
                                          <div className="p-2">
                                            {displayMoney(item.total as number)}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-center">
                                          <div className="p-2 w-full flex justify-center items-center">
                                            <button
                                              className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                              type="button"
                                              title='Edit'
                                              onClick={() => toggleModalCreateOrderPrint(index, item)}
                                            >
                                              <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                                            </button>
                                            <button
                                              className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                              type="button"
                                              title='Delete'
                                              onClick={() => arrayHelpers.remove(index)}
                                            >
                                              <VscTrash className='text-rose-500' size={'1.2rem'} />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="p-4 border-gray-400 border-b-2">
                                      <td colSpan={7} className="text-right font-bold">
                                        <div className="p-2"><span className="mr-4">{"Total Print"}</span><span>{displayMoney(values.prints.reduce((total, print) => total + (print.total as number), 0))}</span></div>
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <tr className="border-2 border-gray-400">
                                    <td colSpan={8} className="">
                                      <div className="w-full flex justify-center items-center p-8">No Data</div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      />
                      <FieldArray
                        name={'others'}
                        render={(arrayHelpers) => (
                          <div className="mb-12">
                            <div className="text-xl flex justify-between items-center mb-2">
                              <div>Other</div>
                              <button
                                className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                type="button"
                                title='Tambah Other'
                                onClick={() => toggleModalCreateOrderOther()}
                              >
                                <BiPlus className='text-primary-500' size={'1.2rem'} />
                              </button>
                            </div>
                            <table className="w-full table-auto">
                              <thead className="">
                                <tr className="text-left border-2 border-gray-400">
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Name</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Qty</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Harga</div>
                                  </th>
                                  <th className="border-2 border-gray-400">
                                    <div className="p-2 text-lg font-normal">Tota Other</div>
                                  </th>
                                  <th className="border-2 border-gray-400 w-32">
                                    <div className="p-2 text-lg font-normal">Action</div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.others.length > 0 ? (
                                  <>
                                    {values.others.map((item, index) => (
                                      <tr key={index} className="p-4 border-2 border-gray-400">
                                        <td className="border-2 border-gray-400 ">
                                          <div className="p-2">
                                            <span data-tooltip-id={`tootltip-order-new-others-name-${index}`}>
                                              {item.name}
                                            </span>
                                            {item.description && (
                                              <Tooltip id={`tootltip-order-new-others-name-${index}`}>
                                                <div className="font-bold">Description</div>
                                                <div className="whitespace-pre-line">{item.description}</div>
                                              </Tooltip>
                                            )}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-right">
                                          <div className="p-2">
                                            {displayNumber(item.qty as number)}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-right">
                                          <div className="p-2">
                                            {displayMoney(item.price as number)}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-right">
                                          <div className="p-2">
                                            {displayMoney(item.total as number)}
                                          </div>
                                        </td>
                                        <td className="border-2 border-gray-400 text-center">
                                          <div className="p-2 w-full flex justify-center items-center">
                                            <button
                                              type="button"
                                              className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                              title='Edit'
                                              onClick={() => toggleModalCreateOrderOther(index, item)}
                                            >
                                              <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                                            </button>
                                            <button
                                              type="button"
                                              className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                                              title='Delete'
                                              onClick={() => arrayHelpers.remove(index)}
                                            >
                                              <VscTrash className='text-rose-500' size={'1.2rem'} />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="p-4 border-gray-400 border-b-2">
                                      <td colSpan={4} className="text-right font-bold">
                                        <div className="p-2"><span className="mr-4">{"Total Other"}</span><span>{displayMoney(values.others.reduce((total, other) => total + (other.total as number), 0))}</span></div>
                                      </td>
                                    </tr>
                                  </>
                                ) : (
                                  <tr className="border-2 border-gray-400">
                                    <td colSpan={5} className="">
                                      <div className="w-full flex justify-center items-center p-8">No Data</div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      />
                    </div>
                    <div className="mb-8 max-w-xl ml-auto">
                      {/* <div className="text-xl mb-4">
                        <div>Summary</div>
                      </div> */}
                      <div className="text-lg font-bold">
                        <div className="grid grid-cols-3">
                          <div className=" col-span-3 flex justify-between items-center">
                            <div>Total Print</div>
                            <div>{displayMoney(values.prints.reduce((total, print) => total + (print.total as number), 0))}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3">
                          <div className=" col-span-3 flex justify-between items-center">
                            <div>Total Other</div>
                            <div>{displayMoney(values.others.reduce((total, other) => total + (other.total as number), 0))}</div>
                          </div>
                        </div>
                        <hr className="my-4 border-2" />
                        <div className="grid grid-cols-3">
                          <div className=" col-span-3 flex justify-between items-center">
                            <div>Total Order</div>
                            <div>{displayMoney(values.prints.reduce((total, print) => total + (print.total as number), 0) + values.others.reduce((total, other) => total + (other.total as number), 0))}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-8 max-w-xl ml-auto">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div>
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(errors, null, 4)}
                    </div> */}
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

(New as PageWithLayoutType).layout = MainAuth;

export default New;