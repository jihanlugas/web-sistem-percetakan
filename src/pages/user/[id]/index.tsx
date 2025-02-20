import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { UserView } from "@/types/user";
import { displayDate, displayDateTime, displayPhoneNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditUser from "@/components/modal/modal-edit-user";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [user, setUser] = useState<UserView>({})
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditUser, setShowModalEditUser] = useState<boolean>(false);

  const preloads = 'Company'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/user/' + id, { preloads }) : null
    },
  })

  const toggleModalEditUser = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditUser(!showModalEditUser);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setUser(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - User Detail'}</title>
      </Head>
      <ModalEditUser
        show={showModalEditUser}
        onClickOverlay={toggleModalEditUser}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'User', path: '/user' },
            { name: user.fullname || id, path: '' },
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
                  <div>User</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit User'
                    onClick={() => toggleModalEditUser(user.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-4">{user.fullname}</div>
                  <div className="text-gray-600">{'Username'}</div>
                  <div className="col-span-4">{user.username}</div>
                  <div className="text-gray-600">{'Email'}</div>
                  <div className="col-span-4">{user.email}</div>
                  <div className="text-gray-600">{'No. Handphone'}</div>
                  <div className="col-span-4">{displayPhoneNumber(user.phoneNumber)}</div>
                  <div className="text-gray-600">{'Alamat'}</div>
                  <div className="col-span-4 whitespace-pre-wrap">{user.address || '-'}</div>
                  <div className="text-gray-600">{'Tempat Lahir'}</div>
                  <div className="col-span-4">{user.birthPlace}</div>
                  <div className="text-gray-600">{'Tanggal Lahir'}</div>
                  <div className="col-span-4">{displayDate(user.birthDt)}</div>
                  <div className="text-gray-600">{'Create By'}</div>
                  <div className="col-span-4">{user.createName}</div>
                  <div className="text-gray-600">{'Create Date'}</div>
                  <div className="col-span-4">{displayDateTime(user.createDt)}</div>
                  <div className="text-gray-600">{'Last Update By'}</div>
                  <div className="col-span-4">{user.updateName}</div>
                  <div className="text-gray-600">{'Last Update Date'}</div>
                  <div className="col-span-4">{displayDateTime(user.updateDt)}</div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(user, null, 4)}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAuth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;