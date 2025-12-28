"use client";

import { useState } from "react";
import type { WorkoutPlanData, PlanDay, PlanExercise } from "@/lib/validations";
import { GeneratePlanButton } from "@/components/plan/generate-plan-button";
import { ChevronDown, ChevronUp, Clock, Repeat, Target, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanViewerProps {
  planData: WorkoutPlanData;
  planName: string;
  planDescription?: string;
  createdAt?: string;
}

function ExerciseCard({ exercise, index }: { exercise: PlanExercise; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "p-4 rounded-xl transition-all",
        expanded ? "bg-secondary" : "bg-card border border-border/50"
      )}
    >
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{exercise.name}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                {exercise.sets}x{exercise.reps}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {exercise.rest_seconds}s
              </span>
            </div>
          </div>
        </div>
        {exercise.notes && (
          <div className="flex-shrink-0">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        )}
      </div>
      {expanded && exercise.notes && (
        <div className="mt-3 ml-11">
          <p className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg">
            {exercise.notes}
          </p>
        </div>
      )}
    </div>
  );
}

function DaySection({ day, isActive, onToggle }: { day: PlanDay; isActive: boolean; onToggle: () => void }) {
  const focusLabels: Record<string, string> = {
    full_body: "Full Body",
    upper: "Superior",
    lower: "Inferior",
    push: "Push",
    pull: "Pull",
    legs: "Pernas",
  };

  const focusColors: Record<string, string> = {
    full_body: "bg-primary/20 text-primary",
    upper: "bg-blue-500/20 text-blue-400",
    lower: "bg-green-500/20 text-green-400",
    push: "bg-orange-500/20 text-orange-400",
    pull: "bg-purple-500/20 text-purple-400",
    legs: "bg-pink-500/20 text-pink-400",
  };

  return (
    <div className="card-elevated overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">{day.day_number}</span>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm">{day.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn("text-xs px-2 py-0.5 rounded-full", focusColors[day.focus] || "bg-secondary text-muted-foreground")}>
                {focusLabels[day.focus] || day.focus}
              </span>
              <span className="text-xs text-muted-foreground">
                {day.exercises.length} exercícios
              </span>
            </div>
          </div>
        </div>
        {isActive ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isActive && (
        <div className="px-4 pb-4 space-y-2">
          {day.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export function PlanViewer({ planData, planName, planDescription, createdAt }: PlanViewerProps) {
  const [activeDays, setActiveDays] = useState<number[]>([1]);

  const toggleDay = (dayNumber: number) => {
    setActiveDays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const splitLabels: Record<string, string> = {
    full_body: "Full Body",
    upper_lower: "Upper/Lower",
    ppl: "Push/Pull/Legs",
    bro_split: "Bro Split",
  };

  return (
    <div className="space-y-6 py-4">
      {/* Plan Header */}
      <div>
        <h1 className="text-xl font-bold">{planName}</h1>
        {planDescription && (
          <p className="text-sm text-muted-foreground mt-1">{planDescription}</p>
        )}
      </div>

      {/* Plan Info Pills */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
          <Target className="w-3.5 h-3.5" />
          {splitLabels[planData.split_type] || planData.split_type}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium">
          <Calendar className="w-3.5 h-3.5" />
          {planData.weeks} semanas
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium">
          {planData.days.length} treinos
        </span>
      </div>

      {planData.notes && (
        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
          <p className="text-sm text-muted-foreground">{planData.notes}</p>
        </div>
      )}

      {/* Days List */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Dias de Treino
        </h2>
        {planData.days.map((day) => (
          <DaySection
            key={day.day_number}
            day={day}
            isActive={activeDays.includes(day.day_number)}
            onToggle={() => toggleDay(day.day_number)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="pt-4 space-y-3">
        <GeneratePlanButton variant="secondary" label="Gerar Novo Plano" />
      </div>

      {/* Metadata */}
      {createdAt && (
        <div className="text-center text-xs text-muted-foreground pt-4">
          Criado em{" "}
          {new Date(createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      )}
    </div>
  );
}
