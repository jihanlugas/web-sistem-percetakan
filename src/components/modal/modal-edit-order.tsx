import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdateOrder } from "@/types/order";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import DropdownField from "@/components/formik/dropdown-field";
import ButtonSubmit from "@/components/formik/button-submit";
import notif from "@/utils/notif";
import { CustomerView, PageCustomer } from "@/types/customer";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import CheckboxField from "@/components/formik/checkbox-field";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}
const pageRequestCustomer: PageCustomer = {
  limit: -1,
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
});

const defaultInitFormikValue: UpdateOrder = {
  customerId: '',
  description: '',
  name: '',
  isDone: false
}

const ModalEditOrder: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [customers, setCustomers] = useState<CustomerView[]>([]);

  const [initFormikValue, setInitFormikValue] = useState<UpdateOrder>(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['order', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/order/' + selectedId, { preloads }) : null
    },
  })

  const { isLoading: isLoadingCustomer, data: dataCustomer } = useQuery({
    queryKey: ['customer', pageRequestCustomer],
    queryFn: ({ queryKey }) => Api.get('/customer', queryKey[1] as object),
  });

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['order', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/order/' + selectedId, val),
  });


  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          customerId: data.payload.customerId,
          description: data.payload.description,
          name: data.payload.name,
          isDone: data.payload.isDone
        })
      }
    }
  }, [data])

  useEffect(() => {
    if (dataCustomer?.status) {
      setCustomers(dataCustomer.payload.list);
    }
  }, [dataCustomer]);

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
    }
  }, [show, id])

  const handleSubmit = async (values: UpdateOrder, formikHelpers: FormikHelpers<UpdateOrder>) => {
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

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Order</div>
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
                {({ }) => {
                  return (
                    <Form noValidate={true}>
                      <div className="mb-4">
                        <TextField
                          label={'Nama Order'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Nama Order'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <CheckboxField
                          label={'Lunas'}
                          name={'isDone'}
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
                          field={true}
                        />
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

export default ModalEditOrder;