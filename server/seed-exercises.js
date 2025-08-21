const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');
require('dotenv').config();

const defaultExercises = [
  {
    name: 'Push-ups',
    description: 'A basic bodyweight exercise that targets chest, shoulders, and triceps',
    category: 'chest',
    muscleGroups: ['pectorals', 'deltoids', 'triceps'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until chest nearly touches the floor',
      'Push back up to starting position',
      'Keep your body in a straight line throughout'
    ],
    tips: [
      'Keep core engaged',
      'Don\'t let hips sag',
      'Control the movement - don\'t rush'
    ],
    metrics: {
      primaryMetric: 'reps',
      hasWeight: false,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    name: 'Bench Press',
    description: 'Classic chest exercise using a barbell',
    category: 'chest',
    muscleGroups: ['pectorals', 'deltoids', 'triceps'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Lie on bench with feet flat on floor',
      'Grip barbell with hands slightly wider than shoulders',
      'Lower bar to chest with control',
      'Press bar back up to starting position'
    ],
    tips: [
      'Keep shoulder blades retracted',
      'Don\'t bounce the bar off your chest',
      'Use a spotter for heavy weights'
    ],
    metrics: {
      primaryMetric: 'reps',
      hasWeight: true,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    name: 'Squats',
    description: 'Fundamental leg exercise targeting quads, glutes, and hamstrings',
    category: 'legs',
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower body by bending knees and pushing hips back',
      'Keep chest up and knees tracking over toes',
      'Return to starting position'
    ],
    tips: [
      'Keep weight on heels',
      'Don\'t let knees cave inward',
      'Go as low as comfortable with good form'
    ],
    metrics: {
      primaryMetric: 'reps',
      hasWeight: false,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    name: 'Deadlift',
    description: 'Compound exercise targeting posterior chain',
    category: 'back',
    muscleGroups: ['latissimus_dorsi', 'hamstrings', 'glutes', 'trapezius'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees to grip the bar',
      'Keep chest up and back straight',
      'Drive through heels to lift the bar'
    ],
    tips: [
      'Keep bar close to body',
      'Engage core throughout',
      'Don\'t round your back'
    ],
    metrics: {
      primaryMetric: 'reps',
      hasWeight: true,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    name: 'Pull-ups',
    description: 'Upper body pulling exercise',
    category: 'back',
    muscleGroups: ['latissimus_dorsi', 'rhomboids', 'biceps'],
    equipment: ['pull_up_bar'],
    difficulty: 'intermediate',
    instructions: [
      'Hang from pull-up bar with overhand grip',
      'Pull body up until chin clears the bar',
      'Lower with control to starting position'
    ],
    tips: [
      'Use full range of motion',
      'Don\'t swing or use momentum',
      'Squeeze shoulder blades at the top'
    ],
    metrics: {
      primaryMetric: 'reps',
      hasWeight: false,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  },
  {
    name: 'Plank',
    description: 'Isometric core strengthening exercise',
    category: 'core',
    muscleGroups: ['abdominals', 'obliques'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in push-up position',
      'Lower to forearms',
      'Hold position with straight body line',
      'Keep core engaged throughout'
    ],
    tips: [
      'Don\'t let hips sag or pike up',
      'Breathe normally',
      'Focus on form over duration'
    ],
    metrics: {
      primaryMetric: 'time',
      hasWeight: false,
      hasReps: false,
      hasTime: true,
      hasDistance: false
    }
  },
  {
    name: 'Running',
    description: 'Cardiovascular exercise',
    category: 'cardio',
    muscleGroups: ['heart', 'quadriceps', 'hamstrings', 'calves'],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Start with a warm-up walk',
      'Gradually increase pace to comfortable run',
      'Maintain steady breathing',
      'Cool down with walking'
    ],
    tips: [
      'Land on midfoot, not heel',
      'Keep cadence around 180 steps per minute',
      'Stay hydrated'
    ],
    metrics: {
      primaryMetric: 'distance',
      hasWeight: false,
      hasReps: false,
      hasTime: true,
      hasDistance: true
    }
  },
  {
    name: 'Bicep Curls',
    description: 'Isolation exercise for biceps',
    category: 'arms',
    muscleGroups: ['biceps'],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    instructions: [
      'Stand with dumbbells in each hand',
      'Keep elbows at your sides',
      'Curl weights up to shoulders',
      'Lower with control'
    ],
    tips: [
      'Don\'t swing the weights',
      'Keep wrists straight',
      'Control the negative portion'
    ],
    metrics: {
      primaryMetric: 'reps',
      hasWeight: true,
      hasReps: true,
      hasTime: false,
      hasDistance: false
    }
  }
];

async function seedExercises() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing exercises
    console.log('Clearing existing exercises...');
    await Exercise.deleteMany({ isCustom: { $ne: true } });

    // Insert default exercises
    console.log('Inserting default exercises...');
    await Exercise.insertMany(defaultExercises);

    console.log(`Successfully seeded ${defaultExercises.length} exercises`);
    
    const exerciseCount = await Exercise.countDocuments();
    console.log(`Total exercises in database: ${exerciseCount}`);

  } catch (error) {
    console.error('Error seeding exercises:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedExercises();
