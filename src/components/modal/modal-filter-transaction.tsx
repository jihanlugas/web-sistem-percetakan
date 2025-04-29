import Modal from "@/components/modal/modal";
import { PageTransaction } from "@/types/transaction";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import DateField from "@/components/formik/date-field";
import DropdownField from "@/components/formik/dropdown-field";
import TextFieldNumber from "../formik/text-field-number";
import { TRANSACTION_TYPE_DEBIT, TRANSACTION_TYPE_KREDIT } from "@/utils/constant";


type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PageTransaction
  setFilter: Dispatch<SetStateAction<PageTransaction>>
}

const schema = Yup.object().shape({
});

const ModalFilterTransaction: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  const [initFormikValue, setInitFormikValue] = useState<PageTransaction>(filter)

  const handleSubmit = async (values: PageTransaction) => {
    setFilter(values)
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({
      orderName: '',
      name: '',
      description: '',
      type: '',
      startAmount: '',
      endAmount: '',
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
          <div>Filter Transaksi</div>
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
                        label={'Nama Transaksi'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Transaksi'}
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
                    <div className="mb-4">
                      <DropdownField
                        label={"Type"}
                        name={"type"}
                        items={[{name: "Pemasukan", id: TRANSACTION_TYPE_DEBIT}, {name: "Pengeluaran", id: TRANSACTION_TYPE_KREDIT}]}
                        keyValue={"id"}
                        keyLabel={"name"}
                        placeholder="Pilih Type"
                        placeholderValue={""}
                        field={true}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <TextFieldNumber
                        label={'Harga Mulai Dari'}
                        name={'startAmount'}
                        placeholder={'Harga Mulai Dari'}
                      />
                      <TextFieldNumber
                        label={'Hingga'}
                        name={'endAmount'}
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

export default ModalFilterTransaction;