import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { isAuthenticated } from '../api/token'
import Home from '../components/Home'

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (authenticated) {
    return (
      <>
        <Head>
          <title>Medicod - Dashboard</title>
          <meta name="description" content="Dashboard de gestión de medicamentos" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Home />
      </>
    );
  }

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
            <Link href="/login" className="cta-button secondary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
