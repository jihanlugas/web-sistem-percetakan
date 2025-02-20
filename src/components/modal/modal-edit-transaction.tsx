import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdateTransaction } from "@/types/transaction";
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
import { OrderView, PageOrder } from "@/types/order";
import TextFieldNumber from "../formik/text-field-number";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  amount: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: UpdateTransaction = {
  orderId: '',
  name: '',
  description: '',
  type: '',
  amount: '',
}

const pageRequestOrder: PageOrder = {
  limit: -1,
}

const ModalEditTransaction: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [orders, setOrders] = useState<OrderView[]>([]);

  const [initFormikValue, setInitFormikValue] = useState<UpdateTransaction>(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['transaction', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/transaction/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['transaction', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/transaction/' + selectedId, val),
  });

  const { isLoading: isLoadingOrder, data: dataOrder } = useQuery({
    queryKey: ['order', pageRequestOrder],
    queryFn: ({ queryKey }) => Api.get('/order', queryKey[1] as object),
  });

  const handleSubmit = async (values: UpdateTransaction, formikHelpers: FormikHelpers<UpdateTransaction>) => {
    values.amount = parseInt(values.amount as string)

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

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          orderId: data.payload.orderId,
          name: data.payload.name,
          description: data.payload.description,
          amount: data.payload.amount,
          type: data.payload.type,
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
    if (dataOrder?.status) {
      setOrders(dataOrder.payload.list);
    }
  }, [dataOrder]);

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Transaction</div>
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
                        <DropdownField
                          label={"Order"}
                          name={"orderId"}
                          items={orders}
                          keyValue={"id"}
                          keyLabel={"name"}
                          isLoading={isLoadingOrder}
                          placeholder="Pilih Order"
                          placeholderValue={""}
                          field={true}
                          disabled
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Nama Transaction'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Nama Transaction'}
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
                          label={"Type"}
                          name={"type"}
                          items={[{ name: "Debit", id: 1 }, { name: "Kredit", id: -1 }]}
                          keyValue={"id"}
                          keyLabel={"name"}
                          field={true}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextFieldNumber
                          label={'Harga'}
                          name={'amount'}
                          placeholder={'Harga'}
                          required
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

export default ModalEditTransaction;