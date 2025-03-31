import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Decode a JWT token without using Node.js Buffer
 * @param token The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export const decodeJwt = (token: string): any => {
  try {
    const [, payloadBase64] = token.split(".");

    // Handle base64 padding
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const normalizedBase64 = base64 + padding;

    // Decode base64
    const jsonPayload = decodeBase64(normalizedBase64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

/**
 * Decode base64 string in a way that works in React Native
 */
const decodeBase64 = (str: string): string => {
  // Use atob in web
  if (Platform.OS === "web") {
    return atob(str);
  }

  // For React Native, use a manual decoder
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let i = 0;

  while (i < str.length) {
    const enc1 = chars.indexOf(str.charAt(i++));
    const enc2 = chars.indexOf(str.charAt(i++));
    const enc3 = chars.indexOf(str.charAt(i++));
    const enc4 = chars.indexOf(str.charAt(i++));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    output += String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }

  return output;
};

/**
 * Check if a JWT token is expired
 * @param token The JWT token to check
 * @returns True if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) {
      return true; // If we can't verify expiration, consider it expired
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // If there's an error, consider it expired
  }
};

/**
 * Verify if the stored token is valid and not expired
 * @returns A boolean indicating token validity
 */
export const verifyStoredToken = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      return false;
    }

    return !isTokenExpired(token);
  } catch (error) {
    console.error("Error verifying stored token:", error);
    return false;
  }
};
