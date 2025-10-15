import Head from 'next/head';
import Inventory from '../components/Inventory';

export default function InventoryPage() {
  return (
    <>
      <Head>
        <title>Inventario - Medicod</title>
        <meta name="description" content="Inventario de medicamentos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Inventory />
    </>
  );
}