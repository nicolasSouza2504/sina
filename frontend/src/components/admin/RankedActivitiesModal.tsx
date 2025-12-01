"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users, BookOpen, Clock } from "lucide-react";
import type { RankedKnowledgeTrail } from "@/lib/interfaces/rankedKnowledgeTrailInterfaces";

interface RankedActivitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trail: RankedKnowledgeTrail | null;
}

export default function RankedActivitiesModal({
  open,
  onOpenChange,
  trail,
}: RankedActivitiesModalProps) {
  if (!trail) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            {trail.name}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            {trail.tasks.length} {trail.tasks.length === 1 ? 'atividade ranqueada' : 'atividades ranqueadas'}
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {trail.tasks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-600">Nenhuma atividade encontrada nesta trilha</p>
            </div>
          ) : (
            trail.tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-yellow-600 rounded-lg">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 truncate">
                        {task.name}
                      </h4>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>
                          Início: {new Date(task.startDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-green-600" />
                        <span>
                          {task.quantitySubmissions} {task.quantitySubmissions === 1 ? 'submissão' : 'submissões'}
                        </span>
                      </div>

                      {task.lastSubmission && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-purple-600" />
                          <span>
                            Última: {new Date(task.lastSubmission).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 whitespace-nowrap">
                      ID: {task.id}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 whitespace-nowrap">
                      Ranqueada
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
