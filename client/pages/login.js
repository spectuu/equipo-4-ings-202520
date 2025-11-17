import Head from 'next/head'
import Link from 'next/link'
import LoginForm from '../components/LoginForm'

export default function Login() {
  return (
    <>
      <Head>
        <title>Iniciar Sesión - Medicod</title>
        <meta name="description" content="Inicia sesión en Medicod para gestionar tus medicamentos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <LoginForm />
    </>
  );
}