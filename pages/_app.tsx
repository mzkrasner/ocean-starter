import '../styles/globals.css'
import '../styles/chat.scss';
import {CeramicWrapper} from "../context";
import type { AppProps } from 'next/app'


const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <CeramicWrapper>
      <Component {...pageProps} ceramic />
    </CeramicWrapper>
  );
}

export default MyApp