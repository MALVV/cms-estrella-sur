import { GaleriaProyecto } from '@/components/galeria-proyecto';

interface GaleriaPageProps {
  params: Promise<{ id: string }>;
}

export default async function GaleriaPage({ params }: GaleriaPageProps) {
  const { id } = await params;
  
  return <GaleriaProyecto projectId={id} />;
}

