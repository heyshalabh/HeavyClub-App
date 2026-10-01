import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  type QueryDocumentSnapshot,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Workout, PersonalRecord, WorkoutSet } from '../types';
import { generateId, calcVolume, estimated1RM } from '../utils/helpers';

export async function saveWorkout(workout: Workout): Promise<void> {
  const ref = doc(db, 'users', workout.userId, 'workouts', workout.id);
  await setDoc(ref, {
    ...workout,
    updatedAt: serverTimestamp(),
  });

  // Update user stats
  const userRef = doc(db, 'users', workout.userId);
  await updateDoc(userRef, {
    totalWorkouts: increment(1),
    lastWorkoutAt: workout.finishedAt || Date.now(),
  });
}

export async function getWorkout(userId: string, workoutId: string): Promise<Workout | null> {
  const snap = await getDoc(doc(db, 'users', userId, 'workouts', workoutId));
  if (!snap.exists()) return null;
  return snap.data() as Workout;
}

export async function getWorkouts(
  userId: string,
  pageSize = 20,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ workouts: Workout[]; last: QueryDocumentSnapshot | null }> {
  let q = query(
    collection(db, 'users', userId, 'workouts'),
    orderBy('startedAt', 'desc'),
    limit(pageSize)
  );
  if (lastDoc) {
    q = query(
      collection(db, 'users', userId, 'workouts'),
      orderBy('startedAt', 'desc'),
      startAfter(lastDoc),
      limit(pageSize)
    );
  }
  const snap = await getDocs(q);
  const workouts = snap.docs.map((d) => d.data() as Workout);
  const last = snap.docs[snap.docs.length - 1] || null;
  return { workouts, last };
}

export async function getRecentWorkouts(userId: string, count = 5): Promise<Workout[]> {
  const q = query(
    collection(db, 'users', userId, 'workouts'),
    orderBy('startedAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Workout);
}

export async function deleteWorkout(userId: string, workoutId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'workouts', workoutId));
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { totalWorkouts: increment(-1) });
}

export async function getWorkoutsByDateRange(
  userId: string,
  start: number,
  end: number
): Promise<Workout[]> {
  const q = query(
    collection(db, 'users', userId, 'workouts'),
    where('startedAt', '>=', start),
    where('startedAt', '<=', end),
    orderBy('startedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Workout);
}

export function detectPRs(
  workout: Workout,
  existingPRs: PersonalRecord[]
): PersonalRecord[] {
  const newPRs: PersonalRecord[] = [];
  const now = Date.now();

  for (const ex of workout.exercises) {
    const workSets = ex.sets.filter((s) => !s.isWarmup && s.completed);
    if (workSets.length === 0) continue;

    const heaviest = Math.max(...workSets.map((s) => s.weight));
    const maxRepsAtWeight = workSets.reduce((best, s) => {
      if (s.weight > (best?.weight || 0) || (s.weight === best?.weight && s.reps > (best?.reps || 0))) {
        return s;
      }
      return best;
    }, null as WorkoutSet | null);

    const volume = calcVolume(workSets);
    const best1RM = Math.max(...workSets.map((s) => estimated1RM(s.weight, s.reps)));

    const existingHeavy = existingPRs.find(
      (p) => p.exerciseName === ex.name && p.type === 'heaviest'
    );
    if (!existingHeavy || heaviest > existingHeavy.value) {
      newPRs.push({
        id: generateId(),
        userId: workout.userId,
        exerciseName: ex.name,
        type: 'heaviest',
        value: heaviest,
        weight: heaviest,
        achievedAt: now,
        workoutId: workout.id,
      });
    }

    if (maxRepsAtWeight) {
      const existingReps = existingPRs.find(
        (p) =>
          p.exerciseName === ex.name &&
          p.type === 'most_reps' &&
          p.weight === maxRepsAtWeight.weight
      );
      if (!existingReps || maxRepsAtWeight.reps > (existingReps.reps || 0)) {
        newPRs.push({
          id: generateId(),
          userId: workout.userId,
          exerciseName: ex.name,
          type: 'most_reps',
          value: maxRepsAtWeight.reps,
          weight: maxRepsAtWeight.weight,
          reps: maxRepsAtWeight.reps,
          achievedAt: now,
          workoutId: workout.id,
        });
      }
    }

    const existingVol = existingPRs.find(
      (p) => p.exerciseName === ex.name && p.type === 'volume'
    );
    if (!existingVol || volume > existingVol.value) {
      newPRs.push({
        id: generateId(),
        userId: workout.userId,
        exerciseName: ex.name,
        type: 'volume',
        value: volume,
        achievedAt: now,
        workoutId: workout.id,
      });
    }

    const existing1RM = existingPRs.find(
      (p) => p.exerciseName === ex.name && p.type === 'estimated_1rm'
    );
    if (!existing1RM || best1RM > existing1RM.value) {
      newPRs.push({
        id: generateId(),
        userId: workout.userId,
        exerciseName: ex.name,
        type: 'estimated_1rm',
        value: best1RM,
        achievedAt: now,
        workoutId: workout.id,
      });
    }
  }
  return newPRs;
}

export async function savePRs(userId: string, prs: PersonalRecord[]): Promise<void> {
  for (const pr of prs) {
    await setDoc(doc(db, 'users', userId, 'personalRecords', pr.id), pr);
  }
  if (prs.length > 0) {
    await updateDoc(doc(db, 'users', userId), {
      prCount: increment(prs.length),
    });
  }
}

export async function getPRs(userId: string): Promise<PersonalRecord[]> {
  const q = query(
    collection(db, 'users', userId, 'personalRecords'),
    orderBy('achievedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PersonalRecord);
}
