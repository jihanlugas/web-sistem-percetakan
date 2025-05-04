import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAuth from '@/components/layout/main-auth';
import Breadcrumb from '@/components/component/breadcrumb';
import { displayMoney, displayNumber, displayPhoneNumber } from '@/utils/formater';
import { GrMoney } from 'react-icons/gr';
import { Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { BiLineChart } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RiPencilLine } from 'react-icons/ri';
import { CompanyView } from '@/types/company';
import ModalEditCompany from '@/components/modal/modal-edit-company';


const Index = () => {

  const [company, setCompany] = useState<CompanyView>(null);
  const [showModalEditCompany, setShowModalEditCompany] = useState<boolean>(false);

  const { data: loginUser, isLoading, refetch } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const toggleModalEditCompany = (refresh = false) => {
    if (refresh) {
      refetch()
    }
    setShowModalEditCompany(!showModalEditCompany);
  };

  useEffect(() => {
    if (loginUser) {
      setCompany(loginUser.payload?.company)
    }
  }, [loginUser])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Setting'}</title>
      </Head>
      <ModalEditCompany
        show={showModalEditCompany}
        onClickOverlay={toggleModalEditCompany}
        company={company}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Setting', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Company</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Company'
                    onClick={() => toggleModalEditCompany()}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-4">{company?.name}</div>
                  <div className="text-gray-600">{'Description'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{company?.description || '-'}</div>
                  <div className="text-gray-600">{'Address'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{company?.address || '-'}</div>
                  <div className="text-gray-600">{'Email'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{company?.email || '-'}</div>
                  <div className="text-gray-600">{'No. Handpone'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{displayPhoneNumber(company?.phoneNumber) || '-'}</div>
                  <div className="text-gray-600">{'Invoice Note'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{company?.invoiceNote || '-'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;