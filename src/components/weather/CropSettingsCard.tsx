"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCrops, CropSetting } from "@/hooks/useCrops";
import { Settings, Plus, Trash2, Edit2, X, Save, LogIn } from "lucide-react";
import Link from "next/link";

interface CropFormData {
  cropName: string;
  baseTemp: string;
  seasonStartDate: string;
  targetGDD: string;
}

const EMPTY_FORM: CropFormData = {
  cropName: "",
  baseTemp: "10",
  seasonStartDate: "",
  targetGDD: "1500",
};

export function CropSettingsCard() {
  const { crops, isLoading, isAuthenticated, saveCrop, removeCrop, isSaving } =
    useCrops();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCrop, setEditingCrop] = useState<string | null>(null);
  const [formData, setFormData] = useState<CropFormData>(EMPTY_FORM);
  const [cropToRemove, setCropToRemove] = useState<CropSetting | null>(null);

  // Non autenticato
  if (!isAuthenticated) {
    return (
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-500" />
            Colture Personalizzate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Accedi per salvare le tue colture personalizzate
            </p>
            <Link href="/login">
              <Button size="sm" variant="outline">
                <LogIn className="h-4 w-4 mr-2" />
                Accedi
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleStartAdd = () => {
    setFormData(EMPTY_FORM);
    setIsAdding(true);
    setEditingCrop(null);
  };

  const handleStartEdit = (crop: CropSetting) => {
    setFormData({
      cropName: crop.cropName,
      baseTemp: crop.baseTemp.toString(),
      seasonStartDate: crop.seasonStartDate,
      targetGDD: crop.targetGDD.toString(),
    });
    setEditingCrop(crop.cropName);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingCrop(null);
    setFormData(EMPTY_FORM);
  };

  const handleSave = () => {
    if (!formData.cropName || !formData.seasonStartDate) {
      return;
    }

    saveCrop({
      cropName: formData.cropName,
      baseTemp: parseFloat(formData.baseTemp),
      seasonStartDate: formData.seasonStartDate,
      targetGDD: parseInt(formData.targetGDD),
    });

    handleCancel();
  };

  const handleConfirmRemove = () => {
    if (cropToRemove) {
      removeCrop(cropToRemove.cropName);
      setCropToRemove(null);
    }
  };

  const isFormValid =
    formData.cropName.trim() !== "" &&
    formData.seasonStartDate !== "" &&
    !isNaN(parseFloat(formData.baseTemp)) &&
    !isNaN(parseInt(formData.targetGDD));

  return (
    <>
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              Colture Personalizzate
            </CardTitle>
            {!isAdding && !editingCrop && (
              <Button size="sm" variant="outline" onClick={handleStartAdd}>
                <Plus className="h-4 w-4 mr-1" />
                Aggiungi
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded" />
              <div className="h-12 bg-slate-100 dark:bg-slate-700 rounded" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Form aggiunta/modifica */}
              {(isAdding || editingCrop) && (
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Nome coltura
                      </label>
                      <input
                        type="text"
                        value={formData.cropName}
                        onChange={(e) =>
                          setFormData({ ...formData, cropName: e.target.value })
                        }
                        disabled={!!editingCrop}
                        className="w-full mt-1 px-2 py-1.5 text-sm border rounded bg-white dark:bg-slate-800 dark:border-slate-600 disabled:opacity-50"
                        placeholder="Es. Pomodoro"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Temp. base (°C)
                      </label>
                      <input
                        type="number"
                        value={formData.baseTemp}
                        onChange={(e) =>
                          setFormData({ ...formData, baseTemp: e.target.value })
                        }
                        className="w-full mt-1 px-2 py-1.5 text-sm border rounded bg-white dark:bg-slate-800 dark:border-slate-600"
                        step="0.5"
                        min="-10"
                        max="30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Inizio stagione
                      </label>
                      <input
                        type="date"
                        value={formData.seasonStartDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seasonStartDate: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-2 py-1.5 text-sm border rounded bg-white dark:bg-slate-800 dark:border-slate-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        GDD maturazione
                      </label>
                      <input
                        type="number"
                        value={formData.targetGDD}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetGDD: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-2 py-1.5 text-sm border rounded bg-white dark:bg-slate-800 dark:border-slate-600"
                        step="100"
                        min="100"
                        max="5000"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Annulla
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={!isFormValid || isSaving}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salva
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista colture salvate */}
              {crops.length === 0 && !isAdding ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  Nessuna coltura personalizzata. Clicca &quot;Aggiungi&quot;
                  per iniziare.
                </p>
              ) : (
                crops.map((crop) => (
                  <div
                    key={crop.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{crop.cropName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tbase: {crop.baseTemp}°C • GDD: {crop.targetGDD} •
                        Inizio:{" "}
                        {new Date(crop.seasonStartDate).toLocaleDateString(
                          "it-IT",
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(crop)}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                        aria-label="Modifica"
                      >
                        <Edit2 className="h-4 w-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => setCropToRemove(crop)}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        aria-label="Rimuovi"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!cropToRemove}
        title="Rimuovi coltura"
        message={`Sei sicuro di voler rimuovere "${cropToRemove?.cropName}"?`}
        confirmLabel="Rimuovi"
        cancelLabel="Annulla"
        onConfirm={handleConfirmRemove}
        onCancel={() => setCropToRemove(null)}
        variant="danger"
      />
    </>
  );
}
