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
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import ProgressBar from '../components/ProgressBar';
import { AuthProvider } from '../context/AuthProvider';
import Protected from '../components/Protected';
import { SplashScreen } from '../components/SplashScreen';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [loading, setLoading] = useState({
    isRouteChanging: false,
    initialLoad: true
  })
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient())

  const privatePages = ['/dashboard', '/analyze', '/archive', '/results', '/submissions', '/settings']

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

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js') // path to your bundled service worker with GoldenRetriever service worker
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope)
        })
        .catch((error) => {
          console.log(`Registration failed with ${error}`)
        })
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(prev => ({ ...prev, initialLoad: false }));
    }, 1000); // 3 seconds or adjust as per your need

    return () => clearTimeout(timer);
  }, []);


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
            <Hydrate state={pageProps.dehydratedState}>
              <ProgressBar isRouteChanging={loading.isRouteChanging} />
              <AuthProvider>
                {
                  loading.initialLoad ?
                    <SplashScreen />
                    :
                    <Layout>
                      <Protected pages={privatePages}>
                        <Component {...pageProps} />
                      </Protected>
                    </Layout>

                }
              </AuthProvider>
            </Hydrate>
          </QueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}
