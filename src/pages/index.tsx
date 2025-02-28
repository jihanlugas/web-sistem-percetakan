import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAuth from '@/components/layout/main-auth';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import Dashboard from './dashboard';

const Index = () => {
  return <Dashboard />;
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;