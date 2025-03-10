import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdatePaper } from "@/types/paper";
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
import TextFieldNumber from "../formik/text-field-number";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  defaultPrice: Yup.number().nullable().required('Required field'),
  defaultPriceDuplex: Yup.number().nullable().required('Required field'),
});

const defaultInitFormikValue: UpdatePaper = {
  name: '',
  description: '',
  defaultPrice: '',
  defaultPriceDuplex: '',
}

const ModalEditPaper: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState<UpdatePaper>(defaultInitFormikValue)

  const preloads = 'Company'
  const { data, isLoading } = useQuery({
    queryKey: ['paper', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/paper/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['paper', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/paper/' + selectedId, val),
  });

  const handleSubmit = async (values: UpdatePaper, formikHelpers: FormikHelpers<UpdatePaper>) => {
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
          defaultPrice: data.payload.defaultPrice,
          defaultPriceDuplex: data.payload.defaultPriceDuplex,
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

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Paper</div>
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
                          label={'Nama Paper'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Nama Paper'}
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
                          name={'defaultPrice'}
                          placeholder={'Harga'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextFieldNumber
                          label={'Harga Timbal Balik'}
                          name={'defaultPriceDuplex'}
                          placeholder={'Harga Timbal Balik'}
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

export default ModalEditPaper;