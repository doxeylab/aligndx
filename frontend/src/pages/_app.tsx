import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../config/theme';
import createEmotionCache from '../config/createEmotionCache';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import ProgressBar from '../components/ProgressBar';
import { AuthProvider } from '../context/AuthProvider';
import Protected from '../components/Protected';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
const queryClient = new QueryClient();

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [loading, setLoading] = useState({
    isRouteChanging: false,
  })
  const router = useRouter();
  const privatePages = ['/dashboard', '/analyze', '/results', '/submissions', '/settings']

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading((prevState) => ({
        ...prevState,
        isRouteChanging: true,
      }))
    }

    const handleRouteChangeEnd = () => {
      setLoading((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }))
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeEnd)
    router.events.on('routeChangeError', handleRouteChangeEnd)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeEnd)
      router.events.off('routeChangeError', handleRouteChangeEnd)
    }
  }, [router.events])

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <ProgressBar isRouteChanging={loading.isRouteChanging} />
            <AuthProvider>
              <Layout>
                <Protected pages={privatePages}>
                  <Component {...pageProps} />
                </Protected>
              </Layout>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}
