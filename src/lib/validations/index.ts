import { z } from 'zod'

// Enums
export const genderEnum = z.enum(['masculino', 'feminino', 'outro'])
export const goalEnum = z.enum(['hipertrofia', 'emagrecimento', 'fortalecimento'])
export const experienceLevelEnum = z.enum(['iniciante', 'intermediario', 'avancado'])
export const equipmentEnum = z.enum(['academia_completa', 'casa', 'halteres', 'elasticos'])

// Body measurements schema (optional)
export const bodyMeasurementsSchema = z.object({
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  biceps_left: z.number().positive().optional(),
  biceps_right: z.number().positive().optional(),
  thigh_left: z.number().positive().optional(),
  thigh_right: z.number().positive().optional(),
  calf_left: z.number().positive().optional(),
  calf_right: z.number().positive().optional(),
}).optional()

// Bioimpedance schema (optional)
export const bioimpedanceSchema = z.object({
  body_fat_percentage: z.number().min(1).max(70).optional(),
  muscle_mass: z.number().positive().optional(),
  bone_mass: z.number().positive().optional(),
  water_percentage: z.number().min(20).max(80).optional(),
  visceral_fat: z.number().min(1).max(30).optional(),
  metabolic_age: z.number().min(10).max(100).optional(),
  bmr: z.number().positive().optional(), // Basal Metabolic Rate
}).optional()

// User profile schema
export const userProfileSchema = z.object({
  gender: genderEnum,
  age: z.number().int().min(10, 'Idade mínima: 10 anos').max(120, 'Idade máxima: 120 anos'),
  weight: z.number().positive('Peso deve ser positivo').max(500, 'Peso máximo: 500kg'),
  height: z.number().positive('Altura deve ser positiva').max(300, 'Altura máxima: 300cm'),
  goal: goalEnum,
  experience_level: experienceLevelEnum,
  training_days_per_week: z.number().int().min(2, 'Mínimo 2 dias').max(6, 'Máximo 6 dias'),
  equipment: equipmentEnum,
  restrictions: z.string().max(1000).optional().nullable(),
  body_measurements: bodyMeasurementsSchema.nullable(),
  bioimpedance: bioimpedanceSchema.nullable(),
})

export type UserProfileInput = z.infer<typeof userProfileSchema>

// Waitlist schema
export const waitlistSchema = z.object({
  email: z.string().email('Email inválido'),
  interests: z.object({
    ai_personalization: z.boolean().optional(),
    progress_tracking: z.boolean().optional(),
    nutrition_plan: z.boolean().optional(),
    video_tutorials: z.boolean().optional(),
    coach_support: z.boolean().optional(),
  }).optional(),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>

// Plan exercise schema
export const planExerciseSchema = z.object({
  exercise_id: z.string().uuid().optional(),
  name: z.string(),
  sets: z.number().int().positive(),
  reps: z.string(), // Can be "8-12" or "12" or "AMRAP"
  rest_seconds: z.number().int().positive(),
  notes: z.string().optional(),
})

// Plan day schema
export const planDaySchema = z.object({
  day_number: z.number().int().positive(),
  name: z.string(), // "Dia A - Peito e Tríceps"
  focus: z.string(), // "push", "pull", "legs", "upper", "lower", "full_body"
  exercises: z.array(planExerciseSchema),
})

// Full plan schema
export const workoutPlanDataSchema = z.object({
  split_type: z.string(),
  weeks: z.number().int().positive(),
  days: z.array(planDaySchema),
  notes: z.string().optional(),
})

export type WorkoutPlanData = z.infer<typeof workoutPlanDataSchema>
export type PlanDay = z.infer<typeof planDaySchema>
export type PlanExercise = z.infer<typeof planExerciseSchema>
