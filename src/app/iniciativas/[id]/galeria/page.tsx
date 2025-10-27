import { GaleriaIniciativa } from '@/components/galeria-iniciativa';

interface GaleriaPageProps {
  params: Promise<{ id: string }>;
}

export default async function GaleriaPage({ params }: GaleriaPageProps) {
  const { id } = await params;
  
  return <GaleriaIniciativa initiativeId={id} />;
}

