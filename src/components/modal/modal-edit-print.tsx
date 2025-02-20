import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdatePrint } from "@/types/print";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import notif from "@/utils/notif";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import DropdownField from "@/components/formik/dropdown-field";
import CheckboxField from "@/components/formik/checkbox-field";
import { PagePaper, PaperView } from "@/types/paper";
import TextFieldNumber from "@/components/formik/text-field-number";
import { displayMoney } from "@/utils/formater";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  paperId: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  isDuplex: Yup.boolean(),
  pageCount: Yup.number().nullable().required('Required field'),
  qty: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: UpdatePrint = {
  name: '',
  description: '',
  paperId: '',
  isDuplex: false,
  pageCount: '',
  qty: '',
  price: '',
  total: '',
}

const pageRequestPaper: PagePaper = {
  limit: -1,
}
const ModalEditPrint: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [papers, setPapers] = useState<PaperView[]>([]);

  const { isLoading: isLoadingPaper, data: dataPaper } = useQuery({
    queryKey: ['paper', pageRequestPaper],
    queryFn: ({ queryKey }) => Api.get('/paper', queryKey[1] as object),
  });

  const [initFormikValue, setInitFormikValue] = useState<UpdatePrint>(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['print', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/print/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['print', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/print/' + selectedId, val),
  });

  const handleSubmit = async (values: UpdatePrint, formikHelpers: FormikHelpers<UpdatePrint>) => {
    values.pageCount = parseInt(values.pageCount as string)
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = (values.pageCount * values.qty * values.price) || 0

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
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

  const handleChangePaper = (e, values, setFieldValue) => {
    setFieldValue('paperId', e.target.value)
    const paper = papers.find((paper) => paper.id === e.target.value)
    if (paper) {
      const price = values.isDuplex ? paper.defaultPriceDuplex : paper.defaultPrice
      setFieldValue('price', price)
    }
  }

  const handleChangeDuplex = (e, values, setFieldValue) => {
    setFieldValue('isDuplex', e.target.checked)
    const paper = papers.find((paper) => paper.id === values.paperId)
    if (paper) {
      setFieldValue('price', e.target.checked ? paper.defaultPriceDuplex : paper.defaultPrice)
    }
  }

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          name: data.payload.name,
          description: data.payload.description,
          paperId: data.payload.paperId,
          isDuplex: data.payload.isDuplex,
          pageCount: data.payload.pageCount,
          qty: data.payload.qty,
          price: data.payload.price,
          total: data.payload.total,
        })
      }
    }
  }, [data])

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
    }
  }, [show, id])

  useEffect(() => {
    if (dataPaper?.status) {
      setPapers(dataPaper.payload.list);
    }
  }, [dataPaper]);

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Print</div>
          <button type="button" onClick={() => onClickOverlay('', true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
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
            <div className="ml-auto">
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
                        <TextAreaField
                          label={'Keterangan'}
                          name={'description'}
                          placeholder={'Keterangan'}
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
                        <TextFieldNumber
                          label={'Harga'}
                          name={'price'}
                          placeholder={'Harga'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextFieldNumber
                          label={'Jumlah Lembar'}
                          name={'pageCount'}
                          placeholder={'Jumlah Lembar'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextFieldNumber
                          label={'Qty'}
                          name={'qty'}
                          placeholder={'Qty'}
                          required
                        />
                      </div>
                      <div className="mb-4 flex justify-end font-bold">
                        <div className="mr-4">Total Print</div>
                        <div>{displayMoney((parseInt(values.qty as string) * parseInt(values.pageCount as string) * parseInt(values.price as string)) || 0)}</div>
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Simpan'}
                          disabled={isPending}
                          loading={isPending}
                        />
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalEditPrint;