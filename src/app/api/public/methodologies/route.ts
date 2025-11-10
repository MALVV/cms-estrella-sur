import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// GET /api/public/methodologies - Obtener todas las metodologías activas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectorsParam = searchParams.get('sectors');
    const ageGroup = searchParams.get('ageGroup');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100'); // Aumentado a 100 para no limitar resultados

    const where: any = {
      isActive: true,
    };

    // Mapear sectores del formato español al enum de Prisma
    const sectorMap: Record<string, 'HEALTH' | 'EDUCATION' | 'LIVELIHOODS' | 'PROTECTION' | 'SUSTAINABILITY' | 'EARLY_CHILD_DEVELOPMENT' | 'CHILDREN_IN_CRISIS'> = {
      'SALUD': 'HEALTH',
      'EDUCACION': 'EDUCATION',
      'MEDIOS_DE_VIDA': 'LIVELIHOODS',
      'PROTECCION': 'PROTECTION',
      'SOSTENIBILIDAD': 'SUSTAINABILITY',
      'DESARROLLO_INFANTIL_TEMPRANO': 'EARLY_CHILD_DEVELOPMENT',
      'NINEZ_EN_CRISIS': 'CHILDREN_IN_CRISIS',
    };

    // Valores válidos del enum de Prisma
    const validSectors = ['HEALTH', 'EDUCATION', 'LIVELIHOODS', 'PROTECTION', 'SUSTAINABILITY', 'EARLY_CHILD_DEVELOPMENT', 'CHILDREN_IN_CRISIS'] as const;
    type ValidSector = typeof validSectors[number];

    // Función tipo guard para validar sectores
    const isValidSector = (s: string): s is ValidSector => {
      return validSectors.includes(s as ValidSector);
    };

    let mappedSectors: Array<ValidSector> = [];

    // Filtrar por sectores
    if (sectorsParam) {
      // Si viene como string separado por comas, dividirlo
      const sectorValues = sectorsParam.split(',').map(s => s.trim());
      mappedSectors = sectorValues
        .map((s: string): ValidSector | null => {
          // Si ya está en formato enum, validar que sea válido
          if (isValidSector(s)) {
            return s;
          }
          // Si está en formato español, mapearlo
          if (sectorMap[s]) {
            return sectorMap[s];
          }
          return null;
        })
        .filter((s): s is ValidSector => s !== null);

      if (mappedSectors.length > 0) {
        // Usar hasSome para filtrar metodologías que tengan al menos uno de los sectores especificados
        where.sectors = {
          hasSome: mappedSectors,
        };
      }
    }

    // Filtrar por grupo de edad
    if (ageGroup) {
      where.ageGroup = {
        contains: ageGroup,
        mode: 'insensitive',
      };
    }

    // Filtrar por búsqueda de texto
    if (search) {
      const searchConditions = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { targetAudience: { contains: search, mode: 'insensitive' } },
        { objectives: { contains: search, mode: 'insensitive' } },
      ];
      
      // Si hay otros filtros además de isActive, usar AND para combinar
      const hasOtherFilters = sectorsParam || ageGroup;
      
      if (hasOtherFilters) {
        // Construir condiciones AND
        const andConditions: any[] = [
          { isActive: true }
        ];
        
        if (mappedSectors.length > 0) {
          andConditions.push({ sectors: { hasSome: mappedSectors } });
        }
        
        if (ageGroup) {
          andConditions.push({ ageGroup: { contains: ageGroup, mode: 'insensitive' } });
        }
        
        andConditions.push({ OR: searchConditions });
        
        where.AND = andConditions;
        // Remover propiedades individuales que ahora están en AND
        delete where.sectors;
        delete where.ageGroup;
        delete where.isActive;
      } else {
        where.OR = searchConditions;
      }
    }

    const methodologies = await prisma.methodology.findMany({
      where,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json(methodologies);
  } catch (error) {
    console.error('Error fetching methodologies:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/public/methodologies - Crear nueva metodología (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = authResult.user;
    if (user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'No tienes permisos para crear metodologías' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      imageUrl,
      imageAlt,
      ageGroup,
      sectors,
      targetAudience,
      objectives,
      implementation,
      results,
      methodology,
      resources,
      evaluation,
    } = body;

    if (!title || !description || !shortDescription || !ageGroup || !sectors || !targetAudience || !objectives || !implementation || !results) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Mapear sectores del formato español al enum de Prisma y validar
    const sectorMap: Record<string, 'HEALTH' | 'EDUCATION' | 'LIVELIHOODS' | 'PROTECTION' | 'SUSTAINABILITY' | 'EARLY_CHILD_DEVELOPMENT' | 'CHILDREN_IN_CRISIS'> = {
      'SALUD': 'HEALTH',
      'EDUCACION': 'EDUCATION',
      'MEDIOS_DE_VIDA': 'LIVELIHOODS',
      'PROTECCION': 'PROTECTION',
      'SOSTENIBILIDAD': 'SUSTAINABILITY',
      'DESARROLLO_INFANTIL_TEMPRANO': 'EARLY_CHILD_DEVELOPMENT',
      'NINEZ_EN_CRISIS': 'CHILDREN_IN_CRISIS',
    };

    // Valores válidos del enum de Prisma
    const validSectors = ['HEALTH', 'EDUCATION', 'LIVELIHOODS', 'PROTECTION', 'SUSTAINABILITY', 'EARLY_CHILD_DEVELOPMENT', 'CHILDREN_IN_CRISIS'] as const;
    type ValidSector = typeof validSectors[number];

    // Función tipo guard para validar sectores
    const isValidSector = (s: string): s is ValidSector => {
      return validSectors.includes(s as ValidSector);
    };

    // Mapear y validar sectores
    let mappedSectors: Array<ValidSector> = [];
    if (sectors && Array.isArray(sectors)) {
      mappedSectors = sectors
        .map((s: string): ValidSector | null => {
          // Si ya está en formato enum, validar que sea válido
          if (isValidSector(s)) {
            return s;
          }
          // Si está en formato español, mapearlo
          if (sectorMap[s]) {
            return sectorMap[s];
          }
          // Si no coincide con ninguno, retornar null para filtrarlo
          return null;
        })
        .filter((s): s is ValidSector => s !== null);
    }

    if (mappedSectors.length === 0) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un sector válido' },
        { status: 400 }
      );
    }

    const newMethodology = await prisma.methodology.create({
      data: {
        title,
        description,
        shortDescription,
        imageUrl,
        imageAlt,
        ageGroup,
        sectors: mappedSectors,
        targetAudience,
        objectives,
        implementation,
        results,
        methodology,
        resources,
        evaluation,
        createdBy: user.id,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newMethodology, { status: 201 });
  } catch (error) {
    console.error('Error creating methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
