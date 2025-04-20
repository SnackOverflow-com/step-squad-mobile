import { ImageSourcePropType } from "react-native";

// Define image sources statically
export const POSITION_IMAGES: Record<number, ImageSourcePropType> = {
  1: require("../../assets/images/position_1.png"),
  2: require("../../assets/images/position_2.png"),
  3: require("../../assets/images/position_3.png"),
};

// Define gradient colors for top positions based on theme
export const LIGHT_MODE_GRADIENTS: Record<number, string[]> = {
  1: ["#FFD700", "#FFA500"], // Gold gradient
  2: ["#E8E8E8", "#A9A9A9"], // Silver gradient - lighter start
  3: ["#f3c799", "#8B4513"], // Bronze gradient - lighter start
};

export const DARK_MODE_GRADIENTS: Record<number, string[]> = {
  1: ["#E6BC00", "#996515"], // Gold gradient (darker)
  2: ["#C0C0C0", "#505050"], // Silver gradient (darker)
  3: ["#CD7F32", "#603000"], // Bronze gradient (darker)
};
