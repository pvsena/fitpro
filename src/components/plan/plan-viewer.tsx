"use client";

import { useState } from "react";
import type { WorkoutPlanData, PlanDay, PlanExercise } from "@/lib/validations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PlanViewerProps {
  planData: WorkoutPlanData;
  planName: string;
  planDescription?: string;
}

function ExerciseCard({ exercise, index }: { exercise: PlanExercise; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">{index + 1}</span>
          </div>
          <div>
            <h4 className="font-medium">{exercise.name}</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {exercise.sets} séries
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {exercise.reps} reps
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exercise.rest_seconds}s descanso
              </Badge>
            </div>
          </div>
        </div>
        {exercise.notes && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Ocultar" : "Ver dicas"}
          </button>
        )}
      </div>
      {expanded && exercise.notes && (
        <div className="mt-3 pl-11">
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
            {exercise.notes}
          </p>
        </div>
      )}
    </div>
  );
}

function DayCard({ day }: { day: PlanDay }) {
  const focusLabels: Record<string, string> = {
    full_body: "Full Body",
    upper: "Superior",
    lower: "Inferior",
    push: "Push",
    pull: "Pull",
    legs: "Pernas",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{day.name}</CardTitle>
            <CardDescription>
              {day.exercises.length} exercícios
            </CardDescription>
          </div>
          <Badge>{focusLabels[day.focus] || day.focus}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {day.exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} index={index} />
        ))}
      </CardContent>
    </Card>
  );
}

export function PlanViewer({ planData, planName, planDescription }: PlanViewerProps) {
  const [activeDay, setActiveDay] = useState("1");

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div>
        <h1 className="text-2xl font-bold">{planName}</h1>
        {planDescription && (
          <p className="text-muted-foreground mt-1">{planDescription}</p>
        )}
      </div>

      {/* Plan Info */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary">{planData.split_type}</Badge>
        <Badge variant="secondary">{planData.weeks} semanas</Badge>
        <Badge variant="secondary">{planData.days.length} treinos</Badge>
      </div>

      {planData.notes && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm">{planData.notes}</p>
        </div>
      )}

      <Separator />

      {/* Days Navigation */}
      <Tabs value={activeDay} onValueChange={setActiveDay}>
        <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent p-0">
          {planData.days.map((day) => (
            <TabsTrigger
              key={day.day_number}
              value={day.day_number.toString()}
              className="flex-1 min-w-[100px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Dia {day.day_number}
            </TabsTrigger>
          ))}
        </TabsList>

        {planData.days.map((day) => (
          <TabsContent key={day.day_number} value={day.day_number.toString()} className="mt-6">
            <DayCard day={day} />
          </TabsContent>
        ))}
      </Tabs>

      {/* All Days View (for printing/overview) */}
      <div className="hidden print:block space-y-6">
        {planData.days.map((day) => (
          <DayCard key={day.day_number} day={day} />
        ))}
      </div>
    </div>
  );
}
