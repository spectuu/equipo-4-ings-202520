import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../api/token';
import Home from '../components/Home';

export default function IndexPage() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      <Head>
        <title>Medicod</title>
        <meta name="description" content="Gestión de medicamentos y recordatorios" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {authed ? (
        <Home />
      ) : (
        <div className="landing-container">
          <div className="landing-content">
            <h1 className="landing-title">Bienvenido a Medicod</h1>
            <p className="landing-subtitle">
              Organiza tu inventario de medicamentos y recibe recordatorios a tiempo.
            </p>
            <div className="landing-buttons">
              <Link href="/signup" className="cta-button primary">Crear Cuenta</Link>
              <Link href="/login" className="cta-button secondary">Iniciar Sesión</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
