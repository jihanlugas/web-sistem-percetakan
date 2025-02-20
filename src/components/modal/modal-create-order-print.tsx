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
import { displayMoney } from "@/utils/formater";
import TextFieldNumber from "../formik/text-field-number";


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
  paperId: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  isDuplex: Yup.boolean(),
  pageCount: Yup.number().nullable().required('Required field'),
  qty: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
});

const ModalCreateOrderPrint: NextPage<Props> = ({ show, onClickOverlay, formRef, dataPrintIndex, initFormikValue, papers, isLoadingPaper }) => {

  const handleSubmit = (values: CreateOrderPrint) => {
    values.pageCount = parseInt(values.pageCount as string)
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = (values.pageCount * values.qty * values.price) || 0
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
    }
  }

  const handleChangeDuplex = (e, values, setFieldValue) => {
    setFieldValue('isDuplex', e.target.checked)
    const paper = papers.find((paper) => paper.id === values.paperId)
    if (paper) {
      setFieldValue('price', e.target.checked ? paper.defaultPriceDuplex : paper.defaultPrice)
    }
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
                    />
                  </div>
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