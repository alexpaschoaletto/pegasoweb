"use client"
import GlobalProvider from './src/contexts/GlobalContextProvider';
import Routes from './routes';

export default function Home() {
  return (
    <GlobalProvider>
        <Routes />
    </GlobalProvider>
  )
}
