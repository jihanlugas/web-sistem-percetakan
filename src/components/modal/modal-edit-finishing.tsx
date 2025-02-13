import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdateFinishing } from "@/types/finishing";
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


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  qty: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
  total: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: UpdateFinishing = {
  name: '',
  description: '',
  qty: '',
  price: '',
  total: '',
}

const ModalEditFinishing: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState<UpdateFinishing>(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['finishing', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/finishing/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['finishing', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/finishing/' + selectedId, val),
  });

  const handleSubmit = async (values: UpdateFinishing, formikHelpers: FormikHelpers<UpdateFinishing>) => {
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = parseInt(values.total as string)

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
          name: data.payload.name,
          description: data.payload.description,
          qty: data.payload.qty,
          price: data.payload.price,
          total: data.payload.total,
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

  const handleChangeQty = (e, values, setFieldValue) => {
    setFieldValue('qty', e.target.value)
    setFieldValue('total', values.price *e.target.value)
  }

  const handleChangePrice = (e, values, setFieldValue) => {
    setFieldValue('price', e.target.value)
    setFieldValue('total', values.qty * e.target.value)
  }

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Finishing</div>
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
                {({ values, setFieldValue }) => {
                  return (
                    <Form noValidate={true}>

                      <div className="mb-4">
                        <TextField
                          label={'Nama Finishing'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Nama Finishing'}
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
                          required
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
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Total'}
                          name={'total'}
                          type={'number'}
                          placeholder={'Total'}
                          field={true}
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

export default ModalEditFinishing;