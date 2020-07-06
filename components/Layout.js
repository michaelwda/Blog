import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import globalStyles from '@styles/global.js'

export default function Layout({ children, pageTitle, description, ...props }) {
  return (
    <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
            <meta name="Description" content={description}></meta>
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;800;900&display=swap" />
            <title>{pageTitle}</title>
        </Head>
        
        <style jsx global>
            {globalStyles}
        </style>
  
        <Header />
        <div className="content">{children}</div>
      
        <Footer />
    </>
  )
}