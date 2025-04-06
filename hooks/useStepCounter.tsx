import { useState, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import { Platform } from "react-native";

const STEP_GOAL = 10000; // Keep the hardcoded step goal for the UI

interface UseStepCounterResult {
  currentStepCount: number;
  isPedometerAvailable: string;
  stepGoal: number;
}

export const useStepCounter = (): UseStepCounterResult => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);

  console.log(`[${Platform.OS}] useStepCounter Hook Initialized`);

  useEffect(() => {
    console.log(`[${Platform.OS}] useStepCounter Effect Mount`);
    let subscription: { remove: () => void } | null = null;

    const subscribe = async () => {
      console.log(`[${Platform.OS}] subscribe: Checking availability...`);
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log(
        `[${Platform.OS}] subscribe: Pedometer.isAvailableAsync result: ${isAvailable}`
      );
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // Watch for current steps
        console.log(
          `[${Platform.OS}] subscribe: Starting Pedometer.watchStepCount...`
        );
        subscription = Pedometer.watchStepCount((result) => {
          console.log(
            `[${Platform.OS}] Pedometer.watchStepCount Update Received:`,
            JSON.stringify(result)
          );
          setCurrentStepCount((prevSteps) => {
            console.log(
              `[${Platform.OS}] Updating currentStepCount from ${prevSteps} to ${result.steps}`
            );
            return result.steps;
          });
        });
      } else {
        console.log(
          `[${Platform.OS}] subscribe: Pedometer not available, skipping watchStepCount.`
        );
      }
    };

    subscribe();

    // Cleanup function
    return () => {
      console.log(`[${Platform.OS}] useStepCounter Effect Cleanup`);
      if (subscription) {
        console.log(
          `[${Platform.OS}] Cleanup: Removing Pedometer subscription.`
        );
        subscription.remove();
      }
    };
  }, []);

  // Log whenever the relevant state values change
  useEffect(() => {
    console.log(
      `[${Platform.OS}] State Change: isPedometerAvailable = ${isPedometerAvailable}`
    );
  }, [isPedometerAvailable]);

  useEffect(() => {
    console.log(
      `[${Platform.OS}] State Change: currentStepCount = ${currentStepCount}`
    );
  }, [currentStepCount]);

  return {
    isPedometerAvailable,
    currentStepCount,
    stepGoal: STEP_GOAL,
    // No explicit error or requestPermissions needed for this minimal version
  };
};

export default useStepCounter;
