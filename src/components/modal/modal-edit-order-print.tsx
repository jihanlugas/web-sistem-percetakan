import { NextPage } from "next/types";
import Modal from "@/components/modal/modal";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import ButtonSubmit from "@/components/formik/button-submit";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CreatePrint, UpdatePrint } from "@/types/print";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import notif from "@/utils/notif";
import { OrderView } from "@/types/order";
import { PagePaper, PaperView } from "@/types/paper";
import DropdownField from "@/components/formik/dropdown-field";
import CheckboxField from "@/components/formik/checkbox-field";

type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string;
  order: OrderView
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  qty: Yup.number().nullable().required('Required field'),
  paperId: Yup.string().required('Required field'),
  isDuplex: Yup.boolean(),
  pageCount: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
  total: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: CreatePrint = {
  companyId: '',
  orderId: '',
  paperId: '',
  name: '',
  description: '',
  isDuplex: false,
  pageCount: '',
  qty: '',
  price: '',
  total: '',
}

const pageRequestPaper: PagePaper = {
  limit: -1,
}

const ModalEditOrderPrint: NextPage<Props> = ({ show, onClickOverlay, id, order }) => {

  const [selectedId, setSelectedId] = useState<string>('');
  const [initFormikValue, setInitFormikValue] = useState(defaultInitFormikValue)
  const [papers, setPapers] = useState<PaperView[]>([]);

  const { isLoading: isLoadingPaper, data: dataPaper } = useQuery({
    queryKey: ['paper', pageRequestPaper],
    queryFn: ({ queryKey }) => Api.get('/paper', queryKey[1] as object),
  });

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['print', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/print/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending: isPendingSubmit } = useMutation({
    mutationKey: ['print', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/print', val),
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['print', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/print/' + selectedId, val),
  });

  const handleSubmit = (values: CreatePrint | UpdatePrint, formikHelpers: FormikHelpers<CreatePrint | UpdatePrint>) => {
    if (selectedId) {
      const newData: UpdatePrint = {
        name: values.name,
        description: values.description,
        qty: values.qty,
        price: values.price,
        total: values.total,
        paperId: values.paperId,
        pageCount: values.pageCount,
        isDuplex: values.isDuplex,
      }
      mutateUpdate(newData, {
        onSuccess: ({ status, message, payload }) => {
          if (status) {
            notif.success(message);
            // formikHelpers.resetForm();
            onClickOverlay('', true)
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
    } else {
      const newData: CreatePrint = {
        companyId: order.companyId,
        orderId: order.id,
        paperId: values.paperId,
        name: values.name,
        description: values.description,
        pageCount: values.pageCount,
        isDuplex: values.isDuplex,
        qty: values.qty,
        price: values.price,
        total: values.total,
      }
      mutateSubmit(newData, {
        onSuccess: ({ status, message, payload }) => {
          if (status) {
            notif.success(message);
            // formikHelpers.resetForm();
            onClickOverlay('', true)
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
  }

  const handleChangePaper = (e, values, setFieldValue) => {
    setFieldValue('paperId', e.target.value)
    const paper = papers.find((paper) => paper.id === e.target.value)
    if (paper) {
      const price = values.isDuplex ? paper.defaultPriceDuplex : paper.defaultPrice
      setFieldValue('price', price)
      setFieldValue('total', price * values.qty * values.pageCount)
    }
  }

  const handleChangeDuplex = (e, values, setFieldValue) => {
    setFieldValue('isDuplex', e.target.checked)
    const paper = papers.find((paper) => paper.id === values.paperId)
    if (paper) {
      const price = e.target.checked ? paper.defaultPriceDuplex : paper.defaultPrice
      setFieldValue('price', e.target.checked ? paper.defaultPriceDuplex : paper.defaultPrice)
      setFieldValue('total', price * values.qty * values.pageCount)
    }
  }

  const handleChangePageCount = (e, values, setFieldValue) => {
    setFieldValue('pageCount', e.target.value)
    setFieldValue('total', values.price * values.qty * e.target.value)
  }

  const handleChangeQty = (e, values, setFieldValue) => {
    setFieldValue('qty', e.target.value)
    setFieldValue('total', values.price * values.pageCount * e.target.value)
  }

  const handleChangePrice = (e, values, setFieldValue) => {
    setFieldValue('price', e.target.value)
    setFieldValue('total', values.pageCount * values.qty * e.target.value)
  }

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
      setInitFormikValue(defaultInitFormikValue)
    }
  }, [show, id])

  useEffect(() => {
    if (dataPaper?.status) {
      setPapers(dataPaper.payload.list);
    }
  }, [dataPaper]);

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          companyId: data.payload.companyId,
          orderId: data.payload.orderId,
          name: data.payload.name,
          description: data.payload.description,
          paperId: data.payload.paperId,
          pageCount: data.payload.pageCount,
          isDuplex: data.payload.isDuplex,
          qty: data.payload.qty,
          price: data.payload.price,
          total: data.payload.total
        })
      }
    }
  }, [data])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>{selectedId ? 'Edit Print' : 'Create Print'}</div>
          <button type="button" onClick={() => onClickOverlay('')} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4" />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
                      <TextField
                        label={'Nama Print'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Print'}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <DropdownField
                        label={"Kertas"}
                        name={"paperId"}
                        items={papers}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingPaper}
                        placeholder="Pilih Kertas"
                        placeholderValue={""}
                        onChange={(e) => handleChangePaper(e, values, setFieldValue)}
                        field={true}
                      />
                    </div>
                    <div className="mb-4">
                      <CheckboxField
                        name="isDuplex"
                        label="Timbal Balik"
                        onChange={(e) => handleChangeDuplex(e, values, setFieldValue)}
                        field={true}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Jumlah Lembar'}
                        name={'pageCount'}
                        type={'number'}
                        placeholder={'Jumlah Lembar'}
                        field={true}
                        onChange={(e) => handleChangePageCount(e, values, setFieldValue)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Qty'}
                        name={'qty'}
                        type={'number'}
                        placeholder={'Qty'}
                        field={true}
                        onChange={(e) => handleChangeQty(e, values, setFieldValue)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Price'}
                        name={'price'}
                        type={'number'}
                        placeholder={'Price'}
                        field={true}
                        onChange={(e) => handleChangePrice(e, values, setFieldValue)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Total'}
                        name={'total'}
                        type={'number'}
                        placeholder={'Total'}
                        field={true}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Keterangan'}
                        name={'description'}
                        placeholder={'Keterangan'}
                      />
                    </div>
                    <div className="mb-4">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPendingSubmit || isPendingUpdate}
                        loading={isPendingSubmit || isPendingUpdate}
                      />
                    </div>
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                    {JSON.stringify(values, null, 4)}
                  </div>
                  <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                    {JSON.stringify(errors, null, 4)}
                  </div> */}
                  </Form>
                )
              }}
            </Formik>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalEditOrderPrint;