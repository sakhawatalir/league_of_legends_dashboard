import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import Layout from '../components/Layout';
import client from '../lib/apollo-client';
import 'tailwindcss/tailwind.css';
import '../styles/globals.css'; 

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;