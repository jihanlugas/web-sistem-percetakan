import { NextPage } from "next/types";
import Modal from "@/components/modal/modal";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import ButtonSubmit from "@/components/formik/button-submit";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CreateDesign, UpdateDesign } from "@/types/design";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import notif from "@/utils/notif";
import { OrderView } from "@/types/order";
import TextFieldNumber from "../formik/text-field-number";
import { displayMoney } from "@/utils/formater";

type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string;
  order: OrderView
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  qty: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: CreateDesign = {
  companyId: '',
  orderId: '',
  name: '',
  description: '',
  qty: '',
  price: '',
  total: '',
}

const ModalEditOrderDesign: NextPage<Props> = ({ show, onClickOverlay, id, order }) => {

  const [selectedId, setSelectedId] = useState<string>('');
  const [initFormikValue, setInitFormikValue] = useState(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['design', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/design/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending: isPendingSubmit } = useMutation({
    mutationKey: ['design', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/design', val),
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['design', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/design/' + selectedId, val),
  });

  const handleSubmit = (values: CreateDesign | UpdateDesign, formikHelpers: FormikHelpers<CreateDesign | UpdateDesign>) => {
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = (values.qty * values.price) || 0
    if (selectedId) {
      const newData: UpdateDesign = {
        name: values.name,
        description: values.description,
        qty: values.qty,
        price: values.price,
        total: values.total,
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
      const newData: CreateDesign = {
        companyId: order.companyId,
        orderId: order.id,
        name: values.name,
        description: values.description,
        qty: values.qty,
        price: values.price,
        total: values.total,
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
          qty: data.payload.qty,
          price: data.payload.price,
          total: data.payload.total
        })
      }
    }
  }, [data])

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>{selectedId ? 'Edit Design' : 'Create Design'}</div>
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
              {({ values }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
                      <TextField
                        label={'Nama Design'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Design'}
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
                      <div className="mr-4">Total Design</div>
                      <div>{displayMoney((parseInt(values.qty as string) * parseInt(values.price as string)) || 0)}</div>
                    </div>
                    <div className="mb-4">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPendingSubmit || isPendingUpdate}
                        loading={isPendingSubmit || isPendingUpdate}
                      />
                    </div>
                    <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div>
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

export default ModalEditOrderDesign;