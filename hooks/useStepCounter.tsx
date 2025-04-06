import { useState, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import { Platform } from "react-native";

const STEP_GOAL = 10000; // Keep the hardcoded step goal for the UI

interface UseStepCounterResult {
  currentStepCount: number;
  isPedometerAvailable: string; // Keep this name, but it now holds 'checking', 'granted', 'denied', 'unavailable'
  stepGoal: number;
}

export const useStepCounter = (): UseStepCounterResult => {
  // Use a more descriptive status: 'checking', 'unavailable', 'denied', 'granted'
  const [pedometerStatus, setPedometerStatus] = useState<string>("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);

  console.log(`[${Platform.OS}] useStepCounter Hook Initialized`);

  useEffect(() => {
    console.log(`[${Platform.OS}] useStepCounter Effect Mount`);
    let subscription: { remove: () => void } | null = null;

    const subscribe = async () => {
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
          console.log(
            `[${Platform.OS}] Pedometer.watchStepCount Update Received:`,
            JSON.stringify(result)
          );
          // Restore previous logging for step updates
          setCurrentStepCount((prevSteps) => {
            console.log(
              `[${Platform.OS}] Updating currentStepCount from ${prevSteps} to ${result.steps}`
            );
            return result.steps;
          });
        });
      } else {
        setPedometerStatus("unavailable"); // Hardware not available
        console.log(
          `[${Platform.OS}] subscribe: Pedometer hardware not available.`
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
        subscription = null; // Help GC
      }
    };
  }, []);

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
    currentStepCount,
    stepGoal: STEP_GOAL,
  };
};

export default useStepCounter;
