import Head from 'next/head'
import Link from 'next/link'
import SignupForm from '../components/SignupForm'

export default function Signup() {
  return (
    <>
      <Head>
        <title>Crear Cuenta - Medicod</title>
        <meta name="description" content="Crea tu cuenta en Medicod para gestionar tus medicamentos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <SignupForm />
    </>
  )
}
