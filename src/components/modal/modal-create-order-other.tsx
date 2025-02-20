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
import { displayMoney } from "@/utils/formater";
import TextFieldNumber from "../formik/text-field-number";


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
  qty: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
});

const ModalCreateOrderOther: NextPage<Props> = ({ show, onClickOverlay, formRef, dataOtherIndex, initFormikValue }) => {

  const handleSubmit = (values: CreateOrderOther) => {
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = (values.qty * values.price) || 0
    if (dataOtherIndex !== -1) {
      formRef.current.setFieldValue('others', formRef.current.values.others.map((item, index) => index === dataOtherIndex ? values : item))
    } else {
      formRef.current.setFieldValue('others', [...formRef.current.values.others, values])
    }
    onClickOverlay()
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
            {({ values }) => {
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
                    <TextAreaField
                      label={'Keterangan'}
                      name={'description'}
                      placeholder={'Keterangan'}
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
                      label={'Qty'}
                      name={'qty'}
                      placeholder={'Qty'}
                      required
                    />
                  </div>
                  <div className="mb-4 flex justify-end font-bold">
                    <div className="mr-4">Total Other</div>
                    <div>{displayMoney((parseInt(values.qty as string) * parseInt(values.price as string)) || 0)}</div>
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

export default ModalCreateOrderOther;