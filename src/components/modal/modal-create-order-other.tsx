import { NextPage } from "next/types";
import Modal from "@/components/modal/modal";
import { CreateOrder, CreateOrderOther } from "@/types/order";
import { Form, Formik, FormikProps } from "formik";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import ButtonSubmit from "@/components/formik/button-submit";
import * as Yup from 'yup';
import { RefObject } from "react";
import { IoClose } from "react-icons/io5";


type Props = {
  show: boolean;
  onClickOverlay: (index?: number, initFormikValueOther?: CreateOrderOther) => void;
  formRef: RefObject<FormikProps<CreateOrder>>
  dataOtherIndex: number
  initFormikValue: CreateOrderOther
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  qty: Yup.number(),
  price: Yup.number(),
  total: Yup.number(),
});

const ModalCreateOrderOther: NextPage<Props> = ({ show, onClickOverlay, formRef, dataOtherIndex, initFormikValue }) => {

  const handleSubmit = (values: CreateOrderOther) => {
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = parseInt(values.total as string)
    if (dataOtherIndex !== -1) {
      formRef.current.setFieldValue('others', formRef.current.values.others.map((item, index) => index === dataOtherIndex ? values : item))
    } else {
      formRef.current.setFieldValue('others', [...formRef.current.values.others, values])
    }
    onClickOverlay()
  }

  const handleChangeQty = (e, values, setFieldValue) => {
    setFieldValue('qty', e.target.value)
    setFieldValue('total', values.price * e.target.value)
  }

  const handleChangePrice = (e, values, setFieldValue) => {
    setFieldValue('price', e.target.value)
    setFieldValue('total', values.qty * e.target.value)
  }

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Create Other</div>
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
                      label={'Nama Other'}
                      name={'name'}
                      type={'text'}
                      placeholder={'Nama Other'}
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
      </div>
    </Modal>
  )
}

export default ModalCreateOrderOther;