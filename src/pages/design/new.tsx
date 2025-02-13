import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import MainAuth from '@/components/layout/main-auth';
import { Api } from '@/lib/api';
import { CreateDesign } from '@/types/design';
import PageWithLayoutType from '@/types/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import DropdownField from '@/components/formik/dropdown-field';
import { OrderView, PageOrder } from '@/types/order';
import { useEffect, useState } from 'react';


type Props = object

const schema = Yup.object().shape({
  orderId: Yup.string().required('Required field'),
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  qty: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
  total: Yup.number().nullable().required('Required field'),
});

const pageRequestOrder: PageOrder = {
  limit: -1,
}

const initFormikValue: CreateDesign = {
  companyId: '',
  orderId: '',
  name: '',
  description: '',
  qty: '',
  price: '',
  total: '',
}

const New: NextPage<Props> = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderView[]>([]);

  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { isLoading: isLoadingOrder, data: dataOrder } = useQuery({
    queryKey: ['order', pageRequestOrder],
    queryFn: ({ queryKey }) => Api.get('/order', queryKey[1] as object),
  });

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['design', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/design', val),
  });

  const handleSubmit = async (values: CreateDesign, formikHelpers: FormikHelpers<CreateDesign>) => {
    values.companyId = loginUser?.payload?.company?.id
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = parseInt(values.total as string)

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/design')
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

  const handleChangeQty = (e, values, setFieldValue) => {
    setFieldValue('qty', e.target.value)
    setFieldValue('total', values.price *e.target.value)
  }

  const handleChangePrice = (e, values, setFieldValue) => {
    setFieldValue('price', e.target.value)
    setFieldValue('total', values.qty * e.target.value)
  }

  useEffect(() => {
    if (dataOrder?.status) {
      setOrders(dataOrder.payload.list);
    }
  }, [dataOrder]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Buat Design'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Design', path: '/design' },
            { name: 'Buat', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Buat Design</div>
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
                        label={'Nama Design'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Design'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
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
                    <div className="mb-4 max-w-xl">
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
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Total'}
                        name={'total'}
                        type={'number'}
                        placeholder={'Total'}
                        field={true}
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