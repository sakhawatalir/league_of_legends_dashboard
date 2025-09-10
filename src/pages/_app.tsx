import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";
import Layout from "../components/Layout"; 
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  // Check if page has custom layout like DashboardShell
  const getLayout = (Component as any).getLayout;

  return (
    <ApolloProvider client={client}>
      {getLayout ? (
        getLayout(<Component {...pageProps} />) 
      ) : (
        <Layout>
          <Component {...pageProps} />  
        </Layout>
      )}
    </ApolloProvider>
  );
}

export default MyApp;
