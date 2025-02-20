import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import MainAuth from '@/components/layout/main-auth';
import { Api } from '@/lib/api';
import { CreatePrint } from '@/types/print';
import PageWithLayoutType from '@/types/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import DropdownField from '@/components/formik/dropdown-field';
import { OrderView, PageOrder } from '@/types/order';
import { use, useEffect, useRef, useState } from 'react';
import CheckboxField from '@/components/formik/checkbox-field';
import { PagePaper, PaperView } from '@/types/paper';
import TextFieldNumber from '@/components/formik/text-field-number';
import { displayMoney } from '@/utils/formater';


type Props = object

const schema = Yup.object().shape({
  orderId: Yup.string().required('Required field'),
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  qty: Yup.number().nullable().required('Required field'),
  paperId: Yup.string().required('Required field'),
  isDuplex: Yup.boolean(),
  pageCount: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
});

const pageRequestOrder: PageOrder = {
  limit: -1,
}

const initFormikValue: CreatePrint = {
  companyId: '',
  orderId: '',
  name: '',
  description: '',
  paperId: '',
  isDuplex: false,
  pageCount: '',
  qty: '',
  price: '',
  total: '',
}

const pageRequestPaper: PagePaper = {
  limit: -1,
}

const New: NextPage<Props> = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderView[]>([]);
  const [papers, setPapers] = useState<PaperView[]>([]);

  const { isLoading: isLoadingPaper, data: dataPaper } = useQuery({
    queryKey: ['paper', pageRequestPaper],
    queryFn: ({ queryKey }) => Api.get('/paper', queryKey[1] as object),
  });

  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { isLoading: isLoadingOrder, data: dataOrder } = useQuery({
    queryKey: ['order', pageRequestOrder],
    queryFn: ({ queryKey }) => Api.get('/order', queryKey[1] as object),
  });

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['print', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/print', val),
  });

  const handleSubmit = async (values: CreatePrint, formikHelpers: FormikHelpers<CreatePrint>) => {
    values.companyId = loginUser?.payload?.company?.id
    values.pageCount = parseInt(values.pageCount as string)
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = (values.pageCount * values.qty * values.price) || 0

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/print')
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

  const handleChangePaper = (e, values, setFieldValue) => {
    setFieldValue('paperId', e.target.value)
    const paper = papers.find((paper) => paper.id === e.target.value)
    if (paper) {
      const price = values.isDuplex ? paper.defaultPriceDuplex : paper.defaultPrice
      setFieldValue('price', price)
    }
  }

  const handleChangeDuplex = (e, values, setFieldValue) => {
    setFieldValue('isDuplex', e.target.checked)
    const paper = papers.find((paper) => paper.id === values.paperId)
    if (paper) {
      setFieldValue('price', e.target.checked ? paper.defaultPriceDuplex : paper.defaultPrice)
    }
  }
  useEffect(() => {
    if (dataOrder?.status) {
      setOrders(dataOrder.payload.list);
    }
  }, [dataOrder]);

  useEffect(() => {
    if (dataPaper?.status) {
      setPapers(dataPaper.payload.list);
    }
  }, [dataPaper]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Buat Print'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Print', path: '/print' },
            { name: 'Buat', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Buat Print</div>
          </div>
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl">
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
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Nama Print'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Print'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextAreaField
                        label={'Keterangan'}
                        name={'description'}
                        placeholder={'Keterangan'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <DropdownField
                        label={"Kertas"}
                        name={"paperId"}
                        items={papers}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingPaper}
                        placeholder="Pilih Kertas"
                        placeholderValue={""}
                        onChange={(e) => handleChangePaper(e, values, setFieldValue)}
                        field={true}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <CheckboxField
                        name="isDuplex"
                        label="Timbal Balik"
                        onChange={(e) => handleChangeDuplex(e, values, setFieldValue)}
                        field={true}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextFieldNumber
                        label={'Harga'}
                        name={'price'}
                        placeholder={'Harga'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextFieldNumber
                        label={'Jumlah Lembar'}
                        name={'pageCount'}
                        placeholder={'Jumlah Lembar'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextFieldNumber
                        label={'Qty'}
                        name={'qty'}
                        placeholder={'Qty'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl flex justify-end font-bold">
                      <div className="mr-4">Total Print</div>
                      <div>{displayMoney((parseInt(values.qty as string) * parseInt (values.pageCount as string) * parseInt(values.price as string)) || 0)}</div>
                    </div>
                    <div className="mb-8 max-w-xl">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div>
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(errors, null, 4)}
                    </div> */}
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

(New as PageWithLayoutType).layout = MainAuth;

export default New;