import Modal from "@/components/modal/modal";
import { CompanyView, UpdateCompany } from "@/types/company";
import notif from "@/utils/notif";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import * as Yup from 'yup';
import TextField from "../formik/text-field";
import TextAreaField from "../formik/text-area-field";
import ButtonSubmit from "../formik/button-submit";
import { useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";

type Props = {
  show: boolean;
  onClickOverlay: (refresh?: boolean) => void;
  company: CompanyView
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  description: Yup.string(),
  email: Yup.string().email('Invalid email').required('Required field'),
  phoneNumber: Yup.string().required('Required field').min(8, "Phone number must be at least 8 characters").max(15, 'Phone number must be 15 characters or less'),
  address: Yup.string(),
  invoiceNote: Yup.string(),
});


const defaultInitFormikValue: UpdateCompany = {
  name: '',
  description: '',
  email: '',
  phoneNumber: '',
  address: '',
  invoiceNote: '',
}

const ModalEditCompany: NextPage<Props> = ({ show, onClickOverlay, company }) => {

  const [initFormikValue, setInitFormikValue] = useState<UpdateCompany>(defaultInitFormikValue)

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['order', 'update', company?.id],
    mutationFn: (val: FormikValues) => Api.put('/company/' + company.id, val),
  });

  const handleSubmit = async (values: UpdateCompany, formikHelpers: FormikHelpers<UpdateCompany>) => {
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          onClickOverlay(true)
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
    if (show) {
      setInitFormikValue({
        name: company.name,
        description: company.description,
        email: company.email,
        phoneNumber: company.phoneNumber,
        address: company.address,
        invoiceNote: company.invoiceNote,
      })
    } else {
    }
  }, [show])

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay(true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Company</div>
          <button type="button" onClick={() => onClickOverlay(true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4" />
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
                        label={'Nama Company'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Nama Company'}
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
                      <TextField
                        label={'Email'}
                        name={'email'}
                        type={'email'}
                        placeholder={'Email'}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'No. Handphone'}
                        name={'phoneNumber'}
                        type={'text'}
                        placeholder={'No. Handphone'}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Alamat'}
                        name={'address'}
                        placeholder={'Alamat'}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Catatan Invoice'}
                        name={'invoiceNote'}
                        placeholder={'Catatan Invoice'}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <ButtonSubmit
                        label={'Simpan'}
                      // disabled={isPending}
                      // loading={isPending}
                      />
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditCompany;