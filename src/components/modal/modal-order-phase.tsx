import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { AddPhase, OrderView } from "@/types/order";
import { displayDateTime } from "@/utils/formater";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { FaLongArrowAltRight } from "react-icons/fa";
import { PagePhase, PhaseView } from "@/types/phase";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import DropdownField from "@/components/formik/dropdown-field";
import ButtonSubmit from "@/components/formik/button-submit";
import notif from "@/utils/notif";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const pageRequestPhase: PagePhase = {
  limit: -1,
}

const schema = Yup.object().shape({
  orderphaseId: Yup.string().required('Required field'),
});

const ModalOrderPhase: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [order, setOrder] = useState<OrderView>({})
  const [phases, setPhases] = useState<PhaseView[]>([]);
  const [initFormikValue] = useState<AddPhase>({ orderphaseId: '' })

  const { isLoading: isLoadingPhase, data: dataPhase } = useQuery({
    queryKey: ['phase', pageRequestPhase],
    queryFn: ({ queryKey }) => Api.get('/phase', queryKey[1] as object),
  });

  const preloads = 'Company,Orderphases'
  const { data, isLoading } = useQuery({
    queryKey: ['order', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/order/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['order', selectedId, 'add-phase'],
    mutationFn: (val: FormikValues) => Api.post('/order/' + selectedId + "/add-phase", val),
  });

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setOrder(data.payload)
        // setInitFormikValue({orderphaseId: data.payload.orderphases[0].id})
      }
    }
  }, [data])

  useEffect(() => {
    if (dataPhase?.status) {
      setPhases(dataPhase.payload.list);
    }
  }, [dataPhase]);

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
    }
  }, [show, id])

  const handleSubmit = async (values: AddPhase, formikHelpers: FormikHelpers<AddPhase>) => {
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
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-4xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Phase</div>
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
            {order.orderphases && (
              <div>
                <div className="flex overflow-x-auto mb-8">
                  {order.orderphases?.map((orderphase, key) => {
                    return (
                      <div key={key} className="flex items-center">
                        {key !== 0 && (
                          <div className="w-16 flex justify-center items-center">
                            <FaLongArrowAltRight className="text-gray-500" size={"1.5rem"} />
                          </div>
                        )}
                        <div className="p-2 mx-4 w-36">
                          <div className="text-xl my-4 flex justify-center">{orderphase.name}</div>
                          <div className="flex justify-center">{orderphase.createName}</div>
                          <div className="text-sm text-gray-700 flex justify-center">{displayDateTime(orderphase.createDt)}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div>
              <hr className="mb-4" />
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="text-xl">New Phase</div>
                <div className="col-span-2">
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
                              label={"Phase"}
                              name={"orderphaseId"}
                              items={phases}
                              keyValue={"id"}
                              keyLabel={"name"}
                              placeholder="Pilih Phase"
                              placeholderValue={""}
                              isLoading={isLoadingPhase}
                              field={true}
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
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalOrderPhase;