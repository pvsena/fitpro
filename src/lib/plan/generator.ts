import type { UserProfile, Exercise } from '@/types/database'
import type { WorkoutPlanData, PlanDay, PlanExercise } from '@/lib/validations'

// Split configurations based on training days
type SplitType = 'full_body' | 'upper_lower' | 'push_pull_legs' | 'bro_split'

interface SplitConfig {
  name: string
  days: {
    name: string
    focus: string
    muscleGroups: string[]
  }[]
}

const SPLIT_CONFIGS: Record<number, SplitConfig> = {
  2: {
    name: 'Full Body',
    days: [
      { name: 'Treino A - Full Body', focus: 'full_body', muscleGroups: ['peito', 'costas', 'ombros', 'quadriceps', 'posteriores', 'biceps', 'triceps', 'abdomen'] },
      { name: 'Treino B - Full Body', focus: 'full_body', muscleGroups: ['costas', 'peito', 'ombros', 'gluteos', 'quadriceps', 'triceps', 'biceps', 'abdomen'] },
    ]
  },
  3: {
    name: 'Full Body 3x',
    days: [
      { name: 'Treino A - Full Body', focus: 'full_body', muscleGroups: ['peito', 'costas', 'quadriceps', 'ombros', 'biceps', 'abdomen'] },
      { name: 'Treino B - Full Body', focus: 'full_body', muscleGroups: ['costas', 'peito', 'posteriores', 'ombros', 'triceps', 'abdomen'] },
      { name: 'Treino C - Full Body', focus: 'full_body', muscleGroups: ['ombros', 'costas', 'gluteos', 'peito', 'biceps', 'triceps', 'panturrilhas'] },
    ]
  },
  4: {
    name: 'Upper/Lower',
    days: [
      { name: 'Treino A - Superior', focus: 'upper', muscleGroups: ['peito', 'costas', 'ombros', 'biceps', 'triceps'] },
      { name: 'Treino B - Inferior', focus: 'lower', muscleGroups: ['quadriceps', 'posteriores', 'gluteos', 'panturrilhas', 'abdomen'] },
      { name: 'Treino C - Superior', focus: 'upper', muscleGroups: ['costas', 'peito', 'ombros', 'triceps', 'biceps'] },
      { name: 'Treino D - Inferior', focus: 'lower', muscleGroups: ['posteriores', 'quadriceps', 'gluteos', 'panturrilhas', 'abdomen'] },
    ]
  },
  5: {
    name: 'Upper/Lower/Push/Pull/Legs',
    days: [
      { name: 'Treino A - Push', focus: 'push', muscleGroups: ['peito', 'ombros', 'triceps'] },
      { name: 'Treino B - Pull', focus: 'pull', muscleGroups: ['costas', 'biceps', 'antebracos'] },
      { name: 'Treino C - Legs', focus: 'legs', muscleGroups: ['quadriceps', 'posteriores', 'gluteos', 'panturrilhas'] },
      { name: 'Treino D - Superior', focus: 'upper', muscleGroups: ['peito', 'costas', 'ombros', 'biceps', 'triceps'] },
      { name: 'Treino E - Inferior + Core', focus: 'lower', muscleGroups: ['gluteos', 'quadriceps', 'posteriores', 'abdomen'] },
    ]
  },
  6: {
    name: 'Push/Pull/Legs 2x',
    days: [
      { name: 'Treino A - Push', focus: 'push', muscleGroups: ['peito', 'ombros', 'triceps'] },
      { name: 'Treino B - Pull', focus: 'pull', muscleGroups: ['costas', 'biceps', 'antebracos'] },
      { name: 'Treino C - Legs', focus: 'legs', muscleGroups: ['quadriceps', 'posteriores', 'gluteos', 'panturrilhas'] },
      { name: 'Treino D - Push', focus: 'push', muscleGroups: ['ombros', 'peito', 'triceps'] },
      { name: 'Treino E - Pull', focus: 'pull', muscleGroups: ['costas', 'biceps', 'abdomen'] },
      { name: 'Treino F - Legs', focus: 'legs', muscleGroups: ['gluteos', 'quadriceps', 'posteriores', 'panturrilhas', 'abdomen'] },
    ]
  },
}

// Exercise configuration based on goal and level
interface ExerciseConfig {
  sets: number
  reps: string
  rest: number // seconds
}

const EXERCISE_CONFIGS: Record<string, Record<string, ExerciseConfig>> = {
  hipertrofia: {
    iniciante: { sets: 3, reps: '10-12', rest: 60 },
    intermediario: { sets: 4, reps: '8-12', rest: 90 },
    avancado: { sets: 4, reps: '6-10', rest: 120 },
  },
  emagrecimento: {
    iniciante: { sets: 3, reps: '12-15', rest: 45 },
    intermediario: { sets: 3, reps: '15-20', rest: 30 },
    avancado: { sets: 4, reps: '15-20', rest: 30 },
  },
  fortalecimento: {
    iniciante: { sets: 3, reps: '8-10', rest: 90 },
    intermediario: { sets: 4, reps: '6-8', rest: 120 },
    avancado: { sets: 5, reps: '4-6', rest: 180 },
  },
}

// Number of exercises per muscle group based on focus
const EXERCISES_PER_MUSCLE: Record<string, Record<string, number>> = {
  full_body: {
    main: 1, // Main muscle groups (peito, costas, quadriceps)
    secondary: 1, // Secondary (ombros, biceps, triceps)
    accessory: 1, // Accessory (panturrilhas, abdomen)
  },
  upper: {
    main: 2,
    secondary: 2,
    accessory: 1,
  },
  lower: {
    main: 2,
    secondary: 2,
    accessory: 1,
  },
  push: {
    main: 2,
    secondary: 2,
    accessory: 1,
  },
  pull: {
    main: 2,
    secondary: 2,
    accessory: 1,
  },
  legs: {
    main: 2,
    secondary: 2,
    accessory: 1,
  },
}

const MAIN_MUSCLES = ['peito', 'costas', 'quadriceps', 'posteriores', 'gluteos']
const SECONDARY_MUSCLES = ['ombros', 'biceps', 'triceps']
const ACCESSORY_MUSCLES = ['panturrilhas', 'abdomen', 'antebracos']

// Equipment compatibility mapping
const EQUIPMENT_COMPATIBILITY: Record<string, string[]> = {
  academia_completa: ['academia_completa', 'halteres', 'casa', 'elasticos'],
  halteres: ['halteres', 'casa'],
  casa: ['casa'],
  elasticos: ['elasticos', 'casa'],
}

function getMuscleCategory(muscle: string): 'main' | 'secondary' | 'accessory' {
  if (MAIN_MUSCLES.includes(muscle)) return 'main'
  if (SECONDARY_MUSCLES.includes(muscle)) return 'secondary'
  return 'accessory'
}

function filterExercisesByEquipment(exercises: Exercise[], userEquipment: string): Exercise[] {
  const compatibleEquipment = EQUIPMENT_COMPATIBILITY[userEquipment] || [userEquipment]
  return exercises.filter(ex => compatibleEquipment.includes(ex.equipment))
}

function filterExercisesByDifficulty(exercises: Exercise[], level: string): Exercise[] {
  const levelOrder = ['iniciante', 'intermediario', 'avancado']
  const maxLevelIndex = levelOrder.indexOf(level)

  return exercises.filter(ex => {
    const exLevelIndex = levelOrder.indexOf(ex.difficulty)
    return exLevelIndex <= maxLevelIndex
  })
}

function selectExercisesForMuscle(
  exercises: Exercise[],
  muscleGroup: string,
  count: number,
  usedExerciseIds: Set<string>
): Exercise[] {
  const muscleExercises = exercises.filter(
    ex => ex.muscle_group === muscleGroup && !usedExerciseIds.has(ex.id)
  )

  // Shuffle and pick
  const shuffled = muscleExercises.sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, count)

  selected.forEach(ex => usedExerciseIds.add(ex.id))

  return selected
}

function createPlanExercise(
  exercise: Exercise,
  config: ExerciseConfig
): PlanExercise {
  return {
    exercise_id: exercise.id,
    name: exercise.name,
    sets: config.sets,
    reps: config.reps,
    rest_seconds: config.rest,
    notes: exercise.instructions || undefined,
  }
}

export function generateWorkoutPlan(
  profile: UserProfile,
  exercises: Exercise[]
): WorkoutPlanData {
  const { goal, experience_level, training_days_per_week, equipment } = profile

  // Get split configuration
  const splitConfig = SPLIT_CONFIGS[training_days_per_week]
  if (!splitConfig) {
    throw new Error(`Invalid training days: ${training_days_per_week}`)
  }

  // Get exercise configuration
  const exerciseConfig = EXERCISE_CONFIGS[goal]?.[experience_level]
  if (!exerciseConfig) {
    throw new Error(`Invalid goal/level combination: ${goal}/${experience_level}`)
  }

  // Filter exercises by equipment and difficulty
  const availableExercises = filterExercisesByDifficulty(
    filterExercisesByEquipment(exercises, equipment),
    experience_level
  )

  if (availableExercises.length === 0) {
    throw new Error('No exercises available for this equipment/level combination')
  }

  // Track used exercises to avoid repetition across days
  const usedExerciseIds = new Set<string>()

  // Generate each training day
  const days: PlanDay[] = splitConfig.days.map((dayConfig, index) => {
    const dayExercises: PlanExercise[] = []
    const focusConfig = EXERCISES_PER_MUSCLE[dayConfig.focus] || EXERCISES_PER_MUSCLE.full_body

    // For each muscle group in the day
    for (const muscleGroup of dayConfig.muscleGroups) {
      const category = getMuscleCategory(muscleGroup)
      const count = focusConfig[category] || 1

      const selectedExercises = selectExercisesForMuscle(
        availableExercises,
        muscleGroup,
        count,
        usedExerciseIds
      )

      // If no exercises found for this muscle (due to equipment), try alternatives
      if (selectedExercises.length === 0) {
        // Try to find any exercise for this muscle without equipment restriction
        const anyMuscleExercise = exercises.filter(
          ex => ex.muscle_group === muscleGroup && !usedExerciseIds.has(ex.id)
        )[0]

        if (anyMuscleExercise) {
          usedExerciseIds.add(anyMuscleExercise.id)
          dayExercises.push(createPlanExercise(anyMuscleExercise, exerciseConfig))
        }
        continue
      }

      selectedExercises.forEach(ex => {
        dayExercises.push(createPlanExercise(ex, exerciseConfig))
      })
    }

    return {
      day_number: index + 1,
      name: dayConfig.name,
      focus: dayConfig.focus,
      exercises: dayExercises,
    }
  })

  // Generate plan name based on configuration
  const goalNames: Record<string, string> = {
    hipertrofia: 'Hipertrofia',
    emagrecimento: 'Emagrecimento',
    fortalecimento: 'Força',
  }

  const levelNames: Record<string, string> = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  }

  return {
    split_type: splitConfig.name,
    weeks: 4, // Default 4-week cycle
    days,
    notes: `Plano de ${goalNames[goal]} para nível ${levelNames[experience_level]}. ` +
           `${training_days_per_week}x por semana. ` +
           `Descanse 1-2 dias entre treinos quando possível. ` +
           `Aumente a carga progressivamente quando completar todas as séries com boa forma.`,
  }
}

export function generatePlanName(profile: UserProfile): string {
  const goalNames: Record<string, string> = {
    hipertrofia: 'Hipertrofia',
    emagrecimento: 'Emagrecimento',
    fortalecimento: 'Força',
  }

  const date = new Date().toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric'
  })

  return `Plano ${goalNames[profile.goal]} - ${date}`
}

export function generatePlanDescription(profile: UserProfile): string {
  const equipmentNames: Record<string, string> = {
    academia_completa: 'Academia Completa',
    casa: 'Treino em Casa',
    halteres: 'Halteres',
    elasticos: 'Elásticos',
  }

  return `Plano personalizado de ${profile.training_days_per_week}x/semana ` +
         `com ${equipmentNames[profile.equipment]}`
}
