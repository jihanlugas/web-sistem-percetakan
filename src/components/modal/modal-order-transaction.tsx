import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { AddTransaction, OrderView } from "@/types/order";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import notif from "@/utils/notif";
import { displayBoolean, displayMoney, displayNumber } from "@/utils/formater";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import CheckboxField from "@/components/formik/checkbox-field";
import { Tooltip } from "react-tooltip";
import TextFieldNumber from "../formik/text-field-number";
import { FiCopy, FiCheck } from 'react-icons/fi';
import { copyToClipboardWithFallback } from "@/utils/helper";


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

const defaultInitFormikValue: AddTransaction = {
  name: '',
  description: '',
  amount: '',
}

const ModalOrderTransaction: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false);

  const [order, setOrder] = useState<OrderView>(null)
  const [initFormikValue] = useState<AddTransaction>(defaultInitFormikValue)

  const preloads = 'Company,Customer,Prints,Prints.Paper,Finishings,Transactions'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['order', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/order/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['order', selectedId, 'add-transaction'],
    mutationFn: (val: FormikValues) => Api.post('/order/' + selectedId + "/add-transaction", val),
  });

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setOrder(data.payload)

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

  const handleSubmit = async (values: AddTransaction, formikHelpers: FormikHelpers<AddTransaction>) => {
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          refetch();
          formikHelpers.resetForm();
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

  const copyToClipboard = async (text: string) => {
    const success = await copyToClipboardWithFallback(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    }
  };

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-4xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Transaksi</div>
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
            <div>
              <div className="mb-4">
                <div className="mb-4 text-lg">Order</div>
                <div className="text-sm">
                  {order?.prints && (
                    <div>
                      <div className="mb-2 text-lg">Print</div>
                      <table className="w-full table-auto">
                        <thead className="">
                          <tr className="text-left border-2 border-gray-400">
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Name</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Kertas</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Timbal Balik</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Jumlah Lembar</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Qty</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Harga</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Total</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order?.prints?.length > 0 ? (
                            <>
                              {order?.prints.map((print, index) => (
                                <tr key={index} className="p-4 border-2 border-gray-400">
                                  <td className="border-2 border-gray-400 ">
                                    <div className="p-2">
                                      <div data-tooltip-id={`tootltip-order-transaction-prints-name-${print.id}`}>
                                        {print.name}
                                      </div>
                                      {print.description && (
                                        <Tooltip id={`tootltip-order-transaction-prints-name-${print.id}`}>
                                          <div className="font-bold">Description</div>
                                          <div className="whitespace-pre-line">{print.description}</div>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 ">
                                    <div className="p-2">
                                      {print.paper?.name || '-'}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 ">
                                    <div className="p-2">
                                      {displayBoolean(print.isDuplex, 'Ya', 'Tidak')}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 text-right">
                                    <div className="p-2">
                                      {displayNumber(print.pageCount as number)}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 text-right">
                                    <div className="p-2">
                                      {displayNumber(print.qty as number)}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 text-right">
                                    <div className="p-2">
                                      {displayMoney(print.price as number)}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 text-right">
                                    <div className="p-2">
                                      {displayMoney(print.total as number)}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              <tr className="p-4 border-gray-400">
                                <td colSpan={7} className="text-right font-bold">
                                  <div className="p-2"><span className="mr-4">{"Total Print"}</span><span>{displayMoney(order?.prints.reduce((total, print) => total + (print.total as number), 0))}</span></div>
                                </td>
                              </tr>
                            </>
                          ) : (
                            <tr className="border-2 border-gray-400">
                              <td colSpan={8} className="">
                                <div className="w-full flex justify-center items-center p-4">No Data</div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {order?.finishings && (
                    <div>
                      <div className="mb-2 text-lg">Finishing</div>
                      <table className="w-full table-auto">
                        <thead className="">
                          <tr className="text-left border-2 border-gray-400">
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Name</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Qty</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Harga</div>
                            </th>
                            <th className="border-2 border-gray-400">
                              <div className="p-2 text-base font-normal">Total</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order?.finishings?.length > 0 ? (
                            <>
                              {order?.finishings.map((finishing, index) => (
                                <tr key={index} className="p-4 border-2 border-gray-400">
                                  <td className="border-2 border-gray-400 ">
                                    <div className="p-2">
                                      <span data-tooltip-id={`tootltip-order-transaction-finishings-name-${finishing.id}`}>
                                        {finishing.name}
                                      </span>
                                      {finishing.description && (
                                        <Tooltip id={`tootltip-order-transaction-finishings-name-${finishing.id}`}>
                                          <div className="font-bold">Description</div>
                                          <div className="whitespace-pre-line">{finishing.description}</div>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 text-right">
                                    <div className="p-2">
                                      {displayNumber(finishing.qty as number)}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 text-right">
                                    <div className="p-2">
                                      {displayMoney(finishing.price as number)}
                                    </div>
                                  </td>
                                  <td className="border-2 border-gray-400 text-right">
                                    <div className="p-2">
                                      {displayMoney(finishing.total as number)}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              <tr className="p-4 border-gray-400">
                                <td colSpan={5} className="text-right font-bold">
                                  <div className="p-2"><span className="mr-4">{"Total Finishing"}</span><span>{displayMoney(order?.finishings.reduce((total, finishing) => total + (finishing.total as number), 0))}</span></div>
                                </td>
                              </tr>
                            </>
                          ) : (
                            <tr className="border-2 border-gray-400">
                              <td colSpan={6} className="">
                                <div className="w-full flex justify-center items-center p-4">No Data</div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              <hr className="mb-4" />
              <div className="mb-4">
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="text-lg">Total Order</div>
                  <div className="col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <div>Print</div>
                      <div>{displayMoney(order?.totalPrint)}</div>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div>Finishing</div>
                      <div>{displayMoney(order?.totalFinishing)}</div>
                    </div>
                    <hr className="mb-2" />
                    <div className="flex justify-between items-center mb-2">
                      <div>Total Order</div>
                      <div>{displayMoney(order?.totalPrint + order?.totalFinishing)}</div>
                    </div>
                    {order?.transactions?.length > 0 && (
                      <>
                        {order?.transactions.map((transaction, key) => (
                          <div key={key} className="flex justify-between items-center mb-2 text-green-500">
                            <div>{transaction.name}</div>
                            <div>{displayMoney(transaction.amount)}</div>
                          </div>
                        ))}
                      </>
                    )}
                    <hr className="mb-2" />
                    <div className="flex justify-between items-center mb-2 text-rose-500">
                      <div>Sisa Pembayaran</div>
                      <div className="flex items-center">
                        <button
                          onClick={() => copyToClipboard(order?.outstanding.toString())}
                          className="p-2"
                          aria-label="Copy Text"
                          title="Copy Text"
                        >
                          {copied ? <FiCheck className="text-green-500" size={"1.2rem"} /> : <FiCopy className="text-gray-700" size={"1.2rem"}/>}
                        </button>
                        <div>{displayMoney(order?.outstanding)}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              {order?.outstanding > 0 && (
                <div className="mb-4">
                  <hr className="mb-4" />
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="text-lg">Buat Transaksi</div>
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
                                <TextField
                                  label={'Name Transaksi'}
                                  name={'name'}
                                  type={'text'}
                                  placeholder={'DP 1, DP 25%, DP 50%, Pelunsan, ...'}
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
                                  label={'Amount'}
                                  name={'amount'}
                                  placeholder={'10.000.000...'}
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
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalOrderTransaction;