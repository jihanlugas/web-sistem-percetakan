import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { PageOrder } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import DropdownField from "@/components/formik/dropdown-field";
import ButtonSubmit from "@/components/formik/button-submit";
import { CustomerView, PageCustomer } from "@/types/customer";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import { PagePhase, PhaseView } from "@/types/phase";
import DateField from "@/components/formik/date-field";


type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PageOrder
  setFilter: Dispatch<SetStateAction<PageOrder>>
}
const pageRequestCustomer: PageCustomer = {
  limit: -1,
}

const pageRequestPhase: PagePhase = {
  limit: -1,
}

const schema = Yup.object().shape({
});

const ModalFilterOrder: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  const [customers, setCustomers] = useState<CustomerView[]>([]);
  const [phases, setPhases] = useState<PhaseView[]>([]);

  const [initFormikValue, setInitFormikValue] = useState<PageOrder>(filter)

  const { isLoading: isLoadingCustomer, data: dataCustomer } = useQuery({
    queryKey: ['customer', pageRequestCustomer],
    queryFn: ({ queryKey }) => Api.get('/customer', queryKey[1] as object),
  });

  const { isLoading: isLoadingPhase, data: dataPhase } = useQuery({
    queryKey: ['phase', pageRequestPhase],
    queryFn: ({ queryKey }) => Api.get('/phase', queryKey[1] as object),
  });

  const handleSubmit = async (values: PageOrder) => {
    setFilter(values)
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({
      customerId: '',
      phaseId: '',
      name: '',
      description: '',
      isDone: '',
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
    if (dataCustomer?.status) {
      setCustomers(dataCustomer.payload.list);
    }
  }, [dataCustomer]);

  useEffect(() => {
    if (dataPhase?.status) {
      setPhases(dataPhase.payload.list);
    }
  }, [dataPhase]);

  useEffect(() => {
    if (show) {
      setInitFormikValue(filter)
    }
  }, [show])


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Filter Order</div>
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
                        label={'Nama Order'}
                        name={'name'}
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
                        label={"Pelanggan"}
                        name={"customerId"}
                        items={customers}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingCustomer}
                        placeholder="Pilih Pelanggan"
                        placeholderValue={""}
                      />
                    </div>
                    <div className="mb-4">
                      <DropdownField
                        label={"Phase"}
                        name={"phaseId"}
                        items={phases}
                        keyValue={"id"}
                        keyLabel={"name"}
                        placeholder="Pilih Phase"
                        placeholderValue={""}
                        isLoading={isLoadingPhase}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <DateField
                        label={'Tanggal Order Dari'}
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

export default ModalFilterOrder;