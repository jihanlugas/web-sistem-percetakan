import Modal from "@/components/modal/modal";
import { PagePrint } from "@/types/print";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import DateField from "@/components/formik/date-field";
import TextFieldNumber from "../formik/text-field-number";


type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PagePrint
  setFilter: Dispatch<SetStateAction<PagePrint>>
}

const schema = Yup.object().shape({
});

const ModalFilterPrint: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  const [initFormikValue, setInitFormikValue] = useState<PagePrint>(filter)

  const handleSubmit = async (values: PagePrint) => {
    setFilter(values)
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({
      orderName: '',
      name: '',
      description: '',
      startTotalPrint: '',
      endTotalPrint: '',
      startDt: '',
      endDt: '',
    })
    onClickOverlay()
  }

  const handleClearStartDt = (setFieldValue) => {
    setFieldValue('startDt', '')
  }

  const handleClearEndDt = (setFieldValue) => {
    setFieldValue('endDt', '')
  }

  useEffect(() => {
    if (show) {
      setInitFormikValue(filter)
    }
  }, [show])


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Filter Print</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4" />
        <div>
          <div className="ml-auto">
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
                      <TextField
                        label={'Nama Print'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Print'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Nama Order'}
                        name={'orderName'}
                        type={'text'}
                        placeholder={'Nama Order'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Keterangan'}
                        name={'description'}
                        placeholder={'Keterangan'}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <TextFieldNumber
                        label={'Total Print Mulai Dari'}
                        name={'startTotalPrint'}
                        placeholder={'Harga Mulai Dari'}
                      />
                      <TextFieldNumber
                        label={'Hingga'}
                        name={'endTotalPrint'}
                        placeholder={'Hingga'}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <DateField
                        label={'Tanggal Dari'}
                        name={'startDt'}
                        type={'date'}
                        handleClear={() => handleClearStartDt(setFieldValue)}
                      />
                      <DateField
                        label={'Hingga'}
                        name={'endDt'}
                        type={'date'}
                        handleClear={() => handleClearEndDt(setFieldValue)}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <ButtonSubmit
                        label={'Clear Filter'}
                        type="reset"
                        onClick={() => handleClear()}
                        className={'duration-300 border-2 text-gray-600 border-gray-400 hover:bg-gray-100 hover:border-gray-500 focus:border-gray-500 h-10 rounded-md font-semibold px-4 w-full shadow-lg shadow-gray-500/20'}
                      />
                      <ButtonSubmit
                        label={'Filter'}
                      />
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalFilterPrint;