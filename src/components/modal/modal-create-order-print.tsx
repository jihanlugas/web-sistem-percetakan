import { NextPage } from "next/types";
import Modal from "@/components/modal/modal";
import { CreateOrder, CreateOrderPrint } from "@/types/order";
import { Form, Formik, FormikProps } from "formik";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import ButtonSubmit from "@/components/formik/button-submit";
import * as Yup from 'yup';
import { RefObject } from "react";
import { PaperView } from "@/types/paper";
import DropdownField from "@/components/formik/dropdown-field";
import CheckboxField from "@/components/formik/checkbox-field";
import { IoClose } from "react-icons/io5";


type Props = {
  show: boolean;
  onClickOverlay: (index?: number, initFormikValuePrint?: CreateOrderPrint) => void;
  formRef: RefObject<FormikProps<CreateOrder>>
  dataPrintIndex: number
  initFormikValue: CreateOrderPrint
  papers: PaperView[]
  isLoadingPaper: boolean
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  paperId: Yup.string(),
  isDuplex: Yup.boolean(),
  pageCount: Yup.number(),
  qty: Yup.number(),
  price: Yup.number(),
  total: Yup.number(),
});

const ModalCreateOrderPrint: NextPage<Props> = ({ show, onClickOverlay, formRef, dataPrintIndex, initFormikValue, papers, isLoadingPaper }) => {

  const handleSubmit = (values: CreateOrderPrint) => {
    values.pageCount = parseInt(values.pageCount as string)
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = parseInt(values.total as string)
    if (dataPrintIndex !== -1) {
      formRef.current.setFieldValue('prints', formRef.current.values.prints.map((item, index) => index === dataPrintIndex ? values : item))
    } else {
      formRef.current.setFieldValue('prints', [...formRef.current.values.prints, values])
    }
    onClickOverlay()
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

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Create Print</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <div>
          <Formik
            initialValues={initFormikValue}
            validationSchema={schema}
            enableReinitialize={true}
            onSubmit={(values) => handleSubmit(values)}
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
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label={'Total'}
                      name={'total'}
                      type={'number'}
                      placeholder={'Total'}
                      field={true}
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
    </Modal>
  )
}

export default ModalCreateOrderPrint;