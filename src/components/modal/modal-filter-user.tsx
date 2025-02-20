import Modal from "@/components/modal/modal";
import { PageUser } from "@/types/user";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import DateField from "@/components/formik/date-field";


type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PageUser
  setFilter: Dispatch<SetStateAction<PageUser>>
}

const schema = Yup.object().shape({
});

const ModalFilterUser: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  const [initFormikValue, setInitFormikValue] = useState<PageUser>(filter)

  const handleSubmit = async (values: PageUser) => {
    setFilter(values)
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({
      companyId: '',
      fullname: '',
      email: '',
      phoneNumber: '',
      username: '',
      address: '',
      birthPlace: '',
      createName: '',
      startDt: '',
      endDt: '',
    })
    onClickOverlay()
  }

  // const handleClearStartDt = (setFieldValue) => {
  //   setFieldValue('startDt', '')
  // }

  // const handleClearEndDt = (setFieldValue) => {
  //   setFieldValue('endDt', '')
  // }

  useEffect(() => {
    if (show) {
      setInitFormikValue(filter)
    }
  }, [show])


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Filter User</div>
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
                        label={'Nama User'}
                        name={'fullname'}
                        type={'text'}
                        placeholder={'Nama User'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Username'}
                        name={'username'}
                        type={'text'}
                        placeholder={'Username'}
                        className={'lowercase'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Email'}
                        name={'email'}
                        type={'email'}
                        placeholder={'Email'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'No. Handphone'}
                        name={'phoneNumber'}
                        type={'text'}
                        placeholder={'No. Handphone'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Alamat'}
                        name={'address'}
                        placeholder={'Alamat'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Tempat Lahir'}
                        name={'birthPlace'}
                        type={'text'}
                        placeholder={'Tempat Lahir'}
                      />
                    </div>
                    {/* <div className="mb-4 grid grid-cols-2 gap-2">
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
                    </div> */}
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

export default ModalFilterUser;