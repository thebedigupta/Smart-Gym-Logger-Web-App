// Mock data for testing exercise logger without backend
export const mockExercises = [
  {
    _id: '1',
    name: 'Push-ups',
    description: 'A basic bodyweight exercise that targets chest, shoulders, and triceps',
    category: 'chest',
    muscleGroups: ['pectorals', 'deltoids', 'triceps'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    metrics: {
      primaryMetric: 'reps',
      hasWeight: false,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    _id: '2',
    name: 'Bench Press',
    description: 'Classic chest exercise using a barbell',
    category: 'chest',
    muscleGroups: ['pectorals', 'deltoids', 'triceps'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    metrics: {
      primaryMetric: 'reps',
      hasWeight: true,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    _id: '3',
    name: 'Squats',
    description: 'Fundamental leg exercise targeting quads, glutes, and hamstrings',
    category: 'legs',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    metrics: {
      primaryMetric: 'reps',
      hasWeight: false,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    _id: '4',
    name: 'Deadlift',
    description: 'Compound exercise targeting posterior chain',
    category: 'back',
    muscleGroups: ['latissimus_dorsi', 'hamstrings', 'glutes', 'trapezius'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    metrics: {
      primaryMetric: 'reps',
      hasWeight: true,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    _id: '5',
    name: 'Plank',
    description: 'Isometric core strengthening exercise',
    category: 'core',
    muscleGroups: ['abdominals', 'obliques'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    metrics: {
      primaryMetric: 'time',
      hasWeight: false,
      hasReps: false,
      hasTime: true,
      hasDistance: false
    }
  },
  {
    _id: '6',
    name: 'Running',
    description: 'Cardiovascular exercise',
    category: 'cardio',
    muscleGroups: ['heart', 'quadriceps', 'hamstrings', 'calves'],
    equipment: ['none'],
    difficulty: 'beginner',
    metrics: {
      primaryMetric: 'distance',
      hasWeight: false,
      hasReps: false,
      hasTime: true,
      hasDistance: true
    }
  },
  {
    _id: '7',
    name: 'Bicep Curls',
    description: 'Isolation exercise for biceps',
    category: 'arms',
    muscleGroups: ['biceps'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    metrics: {
      primaryMetric: 'reps',
      hasWeight: true,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    _id: '8',
    name: 'Pull-ups',
    description: 'Upper body pulling exercise',
    category: 'back',
    muscleGroups: ['latissimus_dorsi', 'rhomboids', 'biceps'],
    equipment: ['pull_up_bar'],
    difficulty: 'intermediate',
    metrics: {
      primaryMetric: 'reps',
      hasWeight: false,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  }
];
