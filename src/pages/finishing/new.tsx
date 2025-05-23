import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import MainAuth from '@/components/layout/main-auth';
import { Api } from '@/lib/api';
import { CreateFinishing } from '@/types/finishing';
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
import TextFieldNumber from '@/components/formik/text-field-number';
import { displayMoney } from '@/utils/formater';


type Props = object

const schema = Yup.object().shape({
  orderId: Yup.string().required('Required field'),
  name: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Must be 200 characters or less'),
  qty: Yup.number().nullable().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
});

const pageRequestOrder: PageOrder = {
  limit: -1,
}

const initFormikValue: CreateFinishing = {
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
    mutationKey: ['finishing', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/finishing', val),
  });

  const handleSubmit = async (values: CreateFinishing, formikHelpers: FormikHelpers<CreateFinishing>) => {
    values.companyId = loginUser?.payload?.company?.id
    values.qty = parseInt(values.qty as string)
    values.price = parseInt(values.price as string)
    values.total = (values.qty * values.price) || 0

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/finishing')
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
    if (dataOrder?.status) {
      setOrders(dataOrder.payload.list);
    }
  }, [dataOrder]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Buat Finishing'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Finishing', path: '/finishing' },
            { name: 'Buat', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Buat Finishing</div>
          </div>
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
                        label={'Nama Finishing'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Finishing'}
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
                      <TextFieldNumber
                        label={'Harga'}
                        name={'price'}
                        placeholder={'Harga'}
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
                      <div className="mr-4">Total Finishing</div>
                      <div>{displayMoney((parseInt(values.qty as string) * parseInt(values.price as string)) || 0)}</div>
                    </div>
                    <div className="mb-8 max-w-xl">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div> */}
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