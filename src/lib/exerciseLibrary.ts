import type { Exercise, ExerciseCategory } from '../types';

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Glutes', 'Core', 'Cardio', 'Full Body'
];

export const STARTER_EXERCISES: Omit<Exercise, 'id'>[] = [
  // Chest
  { name: 'Barbell Bench Press', category: 'Chest', targetMuscle: 'Chest', equipment: 'Barbell', description: 'Classic compound chest press.' },
  { name: 'Incline Dumbbell Press', category: 'Chest', targetMuscle: 'Upper Chest', equipment: 'Dumbbells', description: 'Targets upper chest.' },
  { name: 'Dumbbell Fly', category: 'Chest', targetMuscle: 'Chest', equipment: 'Dumbbells', description: 'Isolation for chest stretch.' },
  { name: 'Cable Crossover', category: 'Chest', targetMuscle: 'Chest', equipment: 'Cable', description: 'Constant tension chest fly.' },
  { name: 'Push-Up', category: 'Chest', targetMuscle: 'Chest', equipment: 'Bodyweight', description: 'Bodyweight chest and triceps.' },
  // Back
  { name: 'Barbell Row', category: 'Back', targetMuscle: 'Back', equipment: 'Barbell', description: 'Horizontal pull compound.' },
  { name: 'Pull-Up', category: 'Back', targetMuscle: 'Lats', equipment: 'Bodyweight', description: 'Vertical pull for lats.' },
  { name: 'Lat Pulldown', category: 'Back', targetMuscle: 'Lats', equipment: 'Cable', description: 'Machine vertical pull.' },
  { name: 'Seated Cable Row', category: 'Back', targetMuscle: 'Back', equipment: 'Cable', description: 'Seated horizontal pull.' },
  { name: 'Dumbbell Row', category: 'Back', targetMuscle: 'Back', equipment: 'Dumbbells', description: 'Unilateral back work.' },
  // Shoulders
  { name: 'Overhead Press', category: 'Shoulders', targetMuscle: 'Shoulders', equipment: 'Barbell', description: 'Standing or seated press.' },
  { name: 'Dumbbell Lateral Raise', category: 'Shoulders', targetMuscle: 'Side Delts', equipment: 'Dumbbells', description: 'Isolation for medial delts.' },
  { name: 'Face Pull', category: 'Shoulders', targetMuscle: 'Rear Delts', equipment: 'Cable', description: 'Rear delt and upper back.' },
  { name: 'Arnold Press', category: 'Shoulders', targetMuscle: 'Shoulders', equipment: 'Dumbbells', description: 'Rotating dumbbell press.' },
  // Biceps
  { name: 'Barbell Curl', category: 'Biceps', targetMuscle: 'Biceps', equipment: 'Barbell', description: 'Classic biceps curl.' },
  { name: 'Dumbbell Curl', category: 'Biceps', targetMuscle: 'Biceps', equipment: 'Dumbbells', description: 'Alternating or simultaneous.' },
  { name: 'Hammer Curl', category: 'Biceps', targetMuscle: 'Biceps/Brachialis', equipment: 'Dumbbells', description: 'Neutral grip curl.' },
  { name: 'Cable Curl', category: 'Biceps', targetMuscle: 'Biceps', equipment: 'Cable', description: 'Constant tension curl.' },
  // Triceps
  { name: 'Tricep Pushdown', category: 'Triceps', targetMuscle: 'Triceps', equipment: 'Cable', description: 'Cable isolation.' },
  { name: 'Skull Crusher', category: 'Triceps', targetMuscle: 'Triceps', equipment: 'Barbell/EZ', description: 'Lying extension.' },
  { name: 'Overhead Tricep Extension', category: 'Triceps', targetMuscle: 'Triceps', equipment: 'Dumbbells', description: 'Long head focus.' },
  { name: 'Close-Grip Bench Press', category: 'Triceps', targetMuscle: 'Triceps', equipment: 'Barbell', description: 'Compound triceps.' },
  // Legs
  { name: 'Barbell Squat', category: 'Legs', targetMuscle: 'Quads', equipment: 'Barbell', description: 'King of leg compounds.' },
  { name: 'Romanian Deadlift', category: 'Legs', targetMuscle: 'Hamstrings', equipment: 'Barbell', description: 'Hip hinge for posterior chain.' },
  { name: 'Leg Press', category: 'Legs', targetMuscle: 'Quads', equipment: 'Machine', description: 'Machine compound.' },
  { name: 'Walking Lunge', category: 'Legs', targetMuscle: 'Quads/Glutes', equipment: 'Dumbbells', description: 'Unilateral leg work.' },
  { name: 'Leg Extension', category: 'Legs', targetMuscle: 'Quads', equipment: 'Machine', description: 'Quad isolation.' },
  { name: 'Leg Curl', category: 'Legs', targetMuscle: 'Hamstrings', equipment: 'Machine', description: 'Hamstring isolation.' },
  { name: 'Calf Raise', category: 'Legs', targetMuscle: 'Calves', equipment: 'Machine/Bodyweight', description: 'Standing or seated.' },
  // Glutes
  { name: 'Hip Thrust', category: 'Glutes', targetMuscle: 'Glutes', equipment: 'Barbell', description: 'Glute isolation compound.' },
  { name: 'Glute Bridge', category: 'Glutes', targetMuscle: 'Glutes', equipment: 'Bodyweight', description: 'Bodyweight glute activation.' },
  { name: 'Cable Kickback', category: 'Glutes', targetMuscle: 'Glutes', equipment: 'Cable', description: 'Isolation kickback.' },
  // Core
  { name: 'Plank', category: 'Core', targetMuscle: 'Core', equipment: 'Bodyweight', description: 'Isometric core hold.' },
  { name: 'Hanging Leg Raise', category: 'Core', targetMuscle: 'Abs', equipment: 'Bodyweight', description: 'Lower abs focus.' },
  { name: 'Cable Crunch', category: 'Core', targetMuscle: 'Abs', equipment: 'Cable', description: 'Weighted crunch.' },
  { name: 'Ab Wheel Rollout', category: 'Core', targetMuscle: 'Core', equipment: 'Ab Wheel', description: 'Anti-extension core.' },
  // Cardio
  { name: 'Treadmill Run', category: 'Cardio', targetMuscle: 'Cardio', equipment: 'Treadmill', description: 'Steady or intervals.' },
  { name: 'Rowing Machine', category: 'Cardio', targetMuscle: 'Cardio', equipment: 'Rower', description: 'Full body cardio.' },
  { name: 'Bike', category: 'Cardio', targetMuscle: 'Cardio', equipment: 'Bike', description: 'Stationary or outdoor.' },
  { name: 'Jump Rope', category: 'Cardio', targetMuscle: 'Cardio', equipment: 'Rope', description: 'High intensity cardio.' },
  // Full Body
  { name: 'Deadlift', category: 'Full Body', targetMuscle: 'Full Body', equipment: 'Barbell', description: 'Posterior chain king.' },
  { name: 'Clean and Press', category: 'Full Body', targetMuscle: 'Full Body', equipment: 'Barbell', description: 'Explosive compound.' },
  { name: 'Burpee', category: 'Full Body', targetMuscle: 'Full Body', equipment: 'Bodyweight', description: 'Conditioning staple.' },
  { name: 'Kettlebell Swing', category: 'Full Body', targetMuscle: 'Posterior', equipment: 'Kettlebell', description: 'Hip hinge power.' },
];

export const STARTER_TEMPLATES = [
  {
    name: 'Push',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: 8 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
      { name: 'Overhead Press', sets: 3, reps: 8 },
      { name: 'Dumbbell Lateral Raise', sets: 3, reps: 12 },
      { name: 'Tricep Pushdown', sets: 3, reps: 12 },
    ],
  },
  {
    name: 'Pull',
    exercises: [
      { name: 'Pull-Up', sets: 4, reps: 8 },
      { name: 'Barbell Row', sets: 4, reps: 8 },
      { name: 'Seated Cable Row', sets: 3, reps: 10 },
      { name: 'Face Pull', sets: 3, reps: 15 },
      { name: 'Barbell Curl', sets: 3, reps: 10 },
    ],
  },
  {
    name: 'Legs',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10 },
      { name: 'Leg Press', sets: 3, reps: 12 },
      { name: 'Walking Lunge', sets: 3, reps: 10 },
      { name: 'Calf Raise', sets: 4, reps: 15 },
    ],
  },
  {
    name: 'Upper',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: 8 },
      { name: 'Barbell Row', sets: 4, reps: 8 },
      { name: 'Overhead Press', sets: 3, reps: 8 },
      { name: 'Pull-Up', sets: 3, reps: 8 },
      { name: 'Dumbbell Lateral Raise', sets: 3, reps: 12 },
      { name: 'Barbell Curl', sets: 2, reps: 12 },
      { name: 'Tricep Pushdown', sets: 2, reps: 12 },
    ],
  },
  {
    name: 'Lower',
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 6 },
      { name: 'Romanian Deadlift', sets: 3, reps: 8 },
      { name: 'Hip Thrust', sets: 3, reps: 10 },
      { name: 'Leg Curl', sets: 3, reps: 12 },
      { name: 'Calf Raise', sets: 4, reps: 15 },
    ],
  },
  {
    name: 'Full Body',
    exercises: [
      { name: 'Barbell Squat', sets: 3, reps: 8 },
      { name: 'Barbell Bench Press', sets: 3, reps: 8 },
      { name: 'Barbell Row', sets: 3, reps: 8 },
      { name: 'Overhead Press', sets: 2, reps: 10 },
      { name: 'Romanian Deadlift', sets: 2, reps: 10 },
      { name: 'Plank', sets: 3, reps: 30 },
    ],
  },
];
