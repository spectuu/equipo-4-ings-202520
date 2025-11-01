import Head from 'next/head';
import Reminders from '../components/reminders';

export default function RemindersPage() {
  return (
    <>
      <Head>
        <title>Recordatorios - Medicod</title>
        <meta name="description" content="Gestión de recordatorios de Medicod" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Reminders />
    </>
  );
}
