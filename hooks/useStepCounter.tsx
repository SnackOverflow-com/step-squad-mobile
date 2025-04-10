import { useEffect, useRef, useState } from "react";
import { Pedometer } from "expo-sensors";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getActivity, updateActivity } from "@/services/api/activity";
import { ActivityUpdateRequest } from "@/types/activity/activity-update-request";

const ASYNC_STORAGE_STEP_KEY = "@StepSquad:currentStepCount"; // Define a key for storage

interface UseStepCounterResult {
  currentStepCount: number;
  isPedometerAvailable: string; // 'checking', 'granted', 'denied', 'unavailable'
  stepGoal: number;
}

export const useStepCounter = (): UseStepCounterResult => {
  const [pedometerStatus, setPedometerStatus] = useState<string>("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [activity, setActivity] = useState<any>(null); // State to hold activity data

  const loadedStepsRef = useRef<number>(0);
  const initialWatchCountRef = useRef<number | null>(null);

  console.log(`[${Platform.OS}] useStepCounter Hook Initialized`);

  // Fetch activity data on mount
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityData = await getActivity();
        setActivity(activityData); // Store the activity data in state
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
    };

    fetchActivity();
  }, []);

  useEffect(() => {
    console.log(`[${Platform.OS}] useStepCounter Effect Mount`);
    let subscription: { remove: () => void } | null = null;

    const initializeAndSubscribe = async () => {
      try {
        console.log(
          `[${Platform.OS}] Attempting to load steps from AsyncStorage...`
        );
        const storedSteps = await AsyncStorage.getItem(ASYNC_STORAGE_STEP_KEY);
        if (storedSteps !== null) {
          const parsedSteps = parseInt(storedSteps, 10);
          if (!isNaN(parsedSteps)) {
            console.log(
              `[${Platform.OS}] Loaded steps from storage: ${parsedSteps}`
            );
            loadedStepsRef.current = parsedSteps;
            setCurrentStepCount(parsedSteps);
          }
        }
      } catch (error) {
        console.error("Failed to load steps from AsyncStorage:", error);
      }

      initialWatchCountRef.current = null;
      setIsInitialLoadComplete(true);

      console.log(`[${Platform.OS}] subscribe: Requesting permissions...`);
      const { status } = await Pedometer.requestPermissionsAsync();
      console.log(`[${Platform.OS}] subscribe: Permission status: ${status}`);

      if (status !== "granted") {
        setPedometerStatus("denied");
        return;
      }

      console.log(
        `[${Platform.OS}] subscribe: Checking hardware availability...`
      );
      const isHardwareAvailable = await Pedometer.isAvailableAsync();
      console.log(
        `[${Platform.OS}] subscribe: Hardware available: ${isHardwareAvailable}`
      );

      if (isHardwareAvailable) {
        setPedometerStatus("granted");
        console.log(
          `[${Platform.OS}] subscribe: Starting Pedometer.watchStepCount...`
        );

        subscription = Pedometer.watchStepCount((result) => {
          const watchResultSteps = result.steps;
          console.log(
            `[${Platform.OS}] Pedometer.watchStepCount Update Received: raw steps = ${watchResultSteps}`
          );

          if (initialWatchCountRef.current === null) {
            console.log(
              `[${Platform.OS}] Setting initial watch count baseline: ${watchResultSteps}`
            );
            initialWatchCountRef.current = watchResultSteps;
          } else {
            const deltaSinceWatchStarted =
              watchResultSteps - initialWatchCountRef.current;
            const calculatedTotalSteps =
              loadedStepsRef.current + deltaSinceWatchStarted;

            if (deltaSinceWatchStarted < 0) {
              console.warn(
                `[${Platform.OS}] Negative step delta detected. Recalculating...`
              );
              setCurrentStepCount(
                Math.max(loadedStepsRef.current, calculatedTotalSteps)
              );
            } else {
              console.log(
                `[${Platform.OS}] Calculated delta: ${deltaSinceWatchStarted}. New total steps: ${calculatedTotalSteps}`
              );
              setCurrentStepCount(calculatedTotalSteps);
            }
          }
        });
      } else {
        setPedometerStatus("unavailable");
      }
    };

    initializeAndSubscribe();

    return () => {
      console.log(`[${Platform.OS}] useStepCounter Effect Cleanup`);
      if (subscription) {
        subscription.remove();
        subscription = null;
      }
    };
  }, []);

  // Save steps to AsyncStorage when they change
  useEffect(() => {
    if (isInitialLoadComplete) {
      const saveSteps = async () => {
        try {
          console.log(
            `[${Platform.OS}] Saving calculated steps to AsyncStorage: ${currentStepCount}`
          );
          await AsyncStorage.setItem(
            ASYNC_STORAGE_STEP_KEY,
            String(currentStepCount)
          );
        } catch (error) {
          console.error("Failed to save steps to AsyncStorage:", error);
        }
      };
      saveSteps();
    }
  }, [currentStepCount, isInitialLoadComplete]);

  // Update activity when currentStepCount or activity changes
  useEffect(() => {
    if (activity && isInitialLoadComplete) {
      const activityUpdateRequest: ActivityUpdateRequest = {
        id: activity.id,
        date: activity.date,
        quantity: currentStepCount,
      };

      // TODO: Update steps every 10s or so instead of on each step
      const update = async () => {
        try {
          await updateActivity(activityUpdateRequest);
          console.log(
            `[${Platform.OS}] Activity updated with steps: ${currentStepCount}`
          );
        } catch (error) {
          console.error("Failed to update activity:", error);
        }
      };

      update();
    }
  }, [currentStepCount, activity, isInitialLoadComplete]);

  // Log state changes
  useEffect(() => {
    console.log(
      `[${Platform.OS}] State Change: pedometerStatus = ${pedometerStatus}`
    );
  }, [pedometerStatus]);

  useEffect(() => {
    console.log(
      `[${Platform.OS}] State Change: currentStepCount = ${currentStepCount}`
    );
  }, [currentStepCount]);

  return {
    isPedometerAvailable: pedometerStatus,
    currentStepCount,
    stepGoal: activity?.goal ?? 0, // Default to 0 if activity isn't loaded yet
  };
};

export default useStepCounter;
