import { NextPage } from "next/types";
import Modal from "@/components/modal/modal";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import ButtonSubmit from "@/components/formik/button-submit";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CreateTransaction, UpdateTransaction } from "@/types/transaction";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import notif from "@/utils/notif";
import { OrderView } from "@/types/order";
import CheckboxField from "@/components/formik/checkbox-field";
import TextFieldNumber from "../formik/text-field-number";
import { TRANSACTION_TYPE_DEBIT } from "@/utils/constant";

type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string;
  order: OrderView
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  amount: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: CreateTransaction = {
  companyId: '',
  orderId: '',
  name: '',
  type: TRANSACTION_TYPE_DEBIT,
  description: '',
  amount: '',
}

const ModalEditOrderTransaction: NextPage<Props> = ({ show, onClickOverlay, id, order }) => {

  const [selectedId, setSelectedId] = useState<string>('');
  const [initFormikValue, setInitFormikValue] = useState(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['transaction', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/transaction/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending: isPendingSubmit } = useMutation({
    mutationKey: ['transaction', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/transaction', val),
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['transaction', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/transaction/' + selectedId, val),
  });

  const handleSubmit = (values: CreateTransaction | UpdateTransaction, formikHelpers: FormikHelpers<CreateTransaction | UpdateTransaction>) => {
    if (selectedId) {
      const newData: UpdateTransaction = {
        orderId: values.orderId,
        name: values.name,
        description: values.description,
        amount: values.amount,
        type: values.type,
      }
      mutateUpdate(newData, {
        onSuccess: ({ status, message, payload }) => {
          if (status) {
            notif.success(message);
            // formikHelpers.resetForm();
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
    } else {
      const newData: CreateTransaction = {
        companyId: order.companyId,
        orderId: order.id,
        name: values.name,
        description: values.description,
        type: values.type,
        amount: values.amount,
      }
      mutateSubmit(newData, {
        onSuccess: ({ status, message, payload }) => {
          if (status) {
            notif.success(message);
            // formikHelpers.resetForm();
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
  }

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
      setInitFormikValue(defaultInitFormikValue)
    }
  }, [show, id])

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          companyId: data.payload.companyId,
          orderId: data.payload.orderId,
          name: data.payload.name,
          description: data.payload.description,
          type: data.payload.type,
          amount: data.payload.amount,
        })
      }
    }
  }, [data])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>{selectedId ? 'Edit Transaction' : 'Create Transaction'}</div>
          <button type="button" onClick={() => onClickOverlay('')} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
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
                        label={'Name Transaction'}
                        name={'name'}
                        type={'text'}
                        placeholder={'DP 1, DP 25%, DP 50%, Pelunsan, ...'}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextFieldNumber
                        label={'Amount'}
                        name={'amount'}
                        placeholder={'10.000.000...'}
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
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPendingSubmit || isPendingUpdate}
                        loading={isPendingSubmit || isPendingUpdate}
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
        )}
      </div>
    </Modal>
  )
}

export default ModalEditOrderTransaction;