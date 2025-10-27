'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target,
  DollarSign,
  Calendar,
  Edit,
  Plus,
  TrendingUp,
  Star,
  StarOff,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface AnnualGoal {
  id: string;
  year: number;
  targetAmount: number;
  currentAmount: number;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AnnualGoalsPage() {
  const [annualGoals, setAnnualGoals] = useState<AnnualGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<AnnualGoal | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    targetAmount: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchAnnualGoals();
  }, []);

  const fetchAnnualGoals = async () => {
    try {
      const response = await fetch('/api/annual-goals');
      if (response.ok) {
        const data = await response.json();
        setAnnualGoals(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error('Error al cargar metas anuales:', error);
      toast.error('Error al cargar metas anuales');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/annual-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Meta anual creada exitosamente');
        fetchAnnualGoals();
        setIsCreateDialogOpen(false);
        setFormData({
          year: new Date().getFullYear(),
          targetAmount: '',
          description: '',
          isActive: true
        });
      } else {
        const error = await response.json();
        if (response.status === 409) {
          toast.error(`Ya existe una meta para el año ${formData.year}`);
        } else {
          toast.error(error.error || 'Error al crear meta anual');
        }
      }
    } catch (error) {
      console.error('Error al crear meta anual:', error);
      toast.error('Error al crear meta anual');
    }
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGoal) return;

    try {
      const response = await fetch('/api/annual-goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedGoal.id,
          ...formData
        }),
      });

      if (response.ok) {
        toast.success('Meta anual actualizada exitosamente');
        fetchAnnualGoals();
        setIsEditDialogOpen(false);
        setSelectedGoal(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al actualizar meta anual');
      }
    } catch (error) {
      console.error('Error al actualizar meta anual:', error);
      toast.error('Error al actualizar meta anual');
    }
  };

  const handleToggleFeatured = async (goal: AnnualGoal) => {
    // Si ya está destacada, permitir desmarcarla
    if (goal.isFeatured) {
      try {
        const response = await fetch('/api/annual-goals', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: goal.id,
            isFeatured: false
          }),
        });

        if (response.ok) {
          toast.success(`Meta ${goal.year} removida de destacados`);
          fetchAnnualGoals();
        } else {
          const error = await response.json();
          toast.error(error.error || 'Error al actualizar meta');
        }
      } catch (error) {
        console.error('Error al actualizar meta:', error);
        toast.error('Error al actualizar meta');
      }
      return;
    }

    // Verificar si ya hay una meta destacada
    const featuredGoals = annualGoals.filter(g => g.isFeatured);
    
    if (featuredGoals.length >= 1) {
      toast.error(`Ya existe una meta destacada (${featuredGoals[0].year}). Desmárcala primero para poder destacar esta meta.`);
      return;
    }

    try {
      const response = await fetch('/api/annual-goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: goal.id,
          isFeatured: true
        }),
      });

      if (response.ok) {
        toast.success(`Meta ${goal.year} destacada exitosamente`);
        fetchAnnualGoals();
      } else {
        const error = await response.json();
        if (error.code === 'FEATURED_LIMIT_REACHED') {
          toast.error(error.error);
        } else {
          toast.error(error.error || 'Error al actualizar meta');
        }
      }
    } catch (error) {
      console.error('Error al actualizar meta:', error);
      toast.error('Error al actualizar meta');
    }
  };

  const handleDeleteGoal = async (goal: AnnualGoal) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la meta de ${goal.year}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/annual-goals?id=${goal.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Meta anual eliminada exitosamente');
        fetchAnnualGoals();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar meta anual');
      }
    } catch (error) {
      console.error('Error al eliminar meta anual:', error);
      toast.error('Error al eliminar meta anual');
    }
  };

  const openEditDialog = (goal: AnnualGoal) => {
    setSelectedGoal(goal);
    setFormData({
      year: goal.year,
      targetAmount: goal.targetAmount.toString(),
      description: goal.description || '',
      isActive: goal.isActive
    });
    setIsEditDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return `Bs. ${amount.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const featuredGoals = annualGoals.filter(g => g.isFeatured);
  const hasFeaturedGoal = featuredGoals.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Metas Anuales
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona las metas de recaudación anuales
            </p>
          </div>
          <Badge variant={hasFeaturedGoal ? "destructive" : "secondary"}>
            Meta Destacada: {featuredGoals.length}/1
          </Badge>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Meta Anual</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetAmount">Monto Meta (Bs.)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción (Opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  Crear Meta
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de metas anuales */}
      <div className="grid gap-6">
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          annualGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Meta {goal.year}
                      </h3>
                      {goal.isFeatured && (
                        <Badge className="bg-yellow-500 text-white text-xs">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Destacada
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {goal.description || `Meta de recaudación para el año ${goal.year}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {goal.isFeatured ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(goal)}
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        title="Quitar de destacados"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(goal)}
                        disabled={hasFeaturedGoal}
                        title={hasFeaturedGoal ? `Ya existe una meta destacada (${featuredGoals[0].year}). Desmárcala primero.` : "Destacar esta meta"}
                      >
                        <StarOff className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(goal)}
                      title="Editar meta"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal)}
                      title="Eliminar meta"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progreso */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progreso de recaudación</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {Math.round(calculateProgress(goal.currentAmount, goal.targetAmount))}% completado
                  </p>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Meta: {formatCurrency(goal.targetAmount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Recaudado: {formatCurrency(goal.currentAmount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Creado: {new Date(goal.createdAt).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Meta Anual</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateGoal} className="space-y-4">
            <div>
              <Label htmlFor="edit-year">Año</Label>
              <Input
                id="edit-year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-targetAmount">Monto Meta (Bs.)</Label>
              <Input
                id="edit-targetAmount"
                type="number"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción (Opcional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit">
                Actualizar Meta
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
