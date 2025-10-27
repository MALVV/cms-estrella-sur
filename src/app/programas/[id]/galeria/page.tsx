import { GaleriaPrograma } from '@/components/galeria-programa';

interface GaleriaPageProps {
  params: Promise<{ id: string }>;
}

export default async function GaleriaPage({ params }: GaleriaPageProps) {
  const { id } = await params;
  
  return <GaleriaPrograma programId={id} />;
}
