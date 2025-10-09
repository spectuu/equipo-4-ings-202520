import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Medicod - Gestión de Medicamentos</title>
        <meta name="description" content="Sistema de gestión de medicamentos y recordatorios" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">Medicod</h1>
          <p className="landing-subtitle">Tu asistente personal para la gestión de medicamentos</p>
          
          <div className="landing-buttons">
            <Link href="/signup" className="cta-button primary">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
