import { useState, useEffect, useRef } from "react";
import { Pedometer } from "expo-sensors";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STEP_GOAL = 10000; // Keep the hardcoded step goal for the UI
const ASYNC_STORAGE_STEP_KEY = "@StepSquad:currentStepCount"; // Define a key for storage

interface UseStepCounterResult {
  currentStepCount: number;
  isPedometerAvailable: string; // Keep this name, but it now holds 'checking', 'granted', 'denied', 'unavailable'
  stepGoal: number;
}

export const useStepCounter = (): UseStepCounterResult => {
  // Use a more descriptive status: 'checking', 'unavailable', 'denied', 'granted'
  const [pedometerStatus, setPedometerStatus] = useState<string>("checking");
  // This state now holds the calculated total steps for display and savingg
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false); // Track initial load

  // Refs to manage the calculation without causing extra renders
  const loadedStepsRef = useRef<number>(0); // Stores steps loaded from AsyncStorage
  const initialWatchCountRef = useRef<number | null>(null); // Stores the first step count from watch

  console.log(`[${Platform.OS}] useStepCounter Hook Initialized`);

  useEffect(() => {
    console.log(`[${Platform.OS}] useStepCounter Effect Mount`);
    let subscription: { remove: () => void } | null = null;

    const initializeAndSubscribe = async () => {
      // --- Load initial steps from AsyncStorage ---
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
            // Store in ref and set initial state
            loadedStepsRef.current = parsedSteps;
            setCurrentStepCount(parsedSteps);
          } else {
            console.log(
              `[${Platform.OS}] Invalid step data found in storage: ${storedSteps}`
            );
          }
        } else {
          console.log(`[${Platform.OS}] No steps found in storage.`);
        }
      } catch (error) {
        console.error("Failed to load steps from AsyncStorage:", error);
      }
      // Reset watch baseline on each init
      initialWatchCountRef.current = null;
      setIsInitialLoadComplete(true); // Mark initial load as complete
      // --- End loading steps ---

      console.log(`[${Platform.OS}] subscribe: Requesting permissions...`);
      const { status } = await Pedometer.requestPermissionsAsync();
      console.log(`[${Platform.OS}] subscribe: Permission status: ${status}`);

      if (status !== "granted") {
        setPedometerStatus("denied");
        console.log(`[${Platform.OS}] subscribe: Permission denied.`);
        return; // Exit if permission not granted
      }

      // Permission granted, now check hardware availability
      console.log(
        `[${Platform.OS}] subscribe: Checking hardware availability...`
      );
      const isHardwareAvailable = await Pedometer.isAvailableAsync();
      console.log(
        `[${Platform.OS}] subscribe: Hardware available: ${isHardwareAvailable}`
      );

      if (isHardwareAvailable) {
        setPedometerStatus("granted"); // Both permission and hardware are ok
        console.log(
          `[${Platform.OS}] subscribe: Starting Pedometer.watchStepCount...`
        );

        // Watch for future steps
        subscription = Pedometer.watchStepCount((result) => {
          const watchResultSteps = result.steps;
          console.log(
            `[${Platform.OS}] Pedometer.watchStepCount Update Received: raw steps = ${watchResultSteps}`
          );

          if (initialWatchCountRef.current === null) {
            // First update from the watch this session
            console.log(
              `[${Platform.OS}] Setting initial watch count baseline: ${watchResultSteps}`
            );
            initialWatchCountRef.current = watchResultSteps;
            // Don't update state here, initial state is already set from loadedStepsRef
          } else {
            // Subsequent updates: calculate delta and add to loaded steps
            const deltaSinceWatchStarted =
              watchResultSteps - initialWatchCountRef.current;

            if (deltaSinceWatchStarted < 0) {
              console.warn(
                `[${Platform.OS}] Negative step delta detected (${deltaSinceWatchStarted}). This might happen after a device reboot or sensor reset. Recalculating baseline.`
              );
              // Option 1: Reset baseline and assume current watch steps are the new delta since load
              // loadedStepsRef.current = currentStepCount; // Update loaded ref to the last known good total
              // initialWatchCountRef.current = watchResultSteps;
              // setCurrentStepCount(loadedStepsRef.current); // Or maybe loadedStepsRef.current + watchResultSteps? Needs thought.

              // Option 2: A simpler approach might be to just use the new watch value if it's larger than stored
              // This isn't ideal as it might lose steps if watch count reset lower than stored.
              // For now, let's just recalculate based on current state

              const newTotalSteps = loadedStepsRef.current + watchResultSteps; // Or just watchResultSteps?
              console.log(
                `[${Platform.OS}] Attempting recovery calculation. New total might be inaccurate: ${newTotalSteps}`
              );
              // Let's stick to the original calculation for now, but log the warning
              const calculatedTotalSteps =
                loadedStepsRef.current + deltaSinceWatchStarted;
              console.log(
                `[${Platform.OS}] Calculated delta: ${deltaSinceWatchStarted}. New total steps: ${calculatedTotalSteps} (Loaded: ${loadedStepsRef.current})`
              );
              // Avoid setting negative steps if delta calculation goes wrong
              setCurrentStepCount(
                Math.max(loadedStepsRef.current, calculatedTotalSteps)
              );
            } else {
              const calculatedTotalSteps =
                loadedStepsRef.current + deltaSinceWatchStarted;
              console.log(
                `[${Platform.OS}] Calculated delta: ${deltaSinceWatchStarted}. New total steps: ${calculatedTotalSteps} (Loaded: ${loadedStepsRef.current})`
              );
              setCurrentStepCount(calculatedTotalSteps);
            }
          }
        });
      } else {
        setPedometerStatus("unavailable"); // Hardware not available
        console.log(
          `[${Platform.OS}] subscribe: Pedometer hardware not available.`
        );
      }
    };

    initializeAndSubscribe();

    // Cleanup function
    return () => {
      console.log(`[${Platform.OS}] useStepCounter Effect Cleanup`);
      if (subscription) {
        console.log(
          `[${Platform.OS}] Cleanup: Removing Pedometer subscription.`
        );
        subscription.remove();
        subscription = null; // Help GC
      }
    };
  }, []);

  // Effect for saving steps to AsyncStorage when they change
  useEffect(() => {
    // Only save after the initial load is complete
    // Save 0 as well, in case steps were reset
    if (isInitialLoadComplete) {
      const saveSteps = async () => {
        try {
          // Save the calculated total steps
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
    // Depend only on the final calculated count and load flag
  }, [currentStepCount, isInitialLoadComplete]);

  // Log whenever the relevant state values change
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
    // Let the consumer decide how to handle the status string
    isPedometerAvailable: pedometerStatus, // Consumers can check for 'granted', 'denied' etc.
    currentStepCount, // Return the calculated total
    stepGoal: STEP_GOAL,
  };
};

export default useStepCounter;
