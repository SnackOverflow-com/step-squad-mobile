import React from "react";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
} from "react-native-svg";

interface WaterGlassProps {
  size: number;
  fillPercentage: number;
  color: string;
  backgroundColor?: string;
}

const WaterGlass = ({
  size,
  fillPercentage,
  color,
  backgroundColor = "transparent",
}: WaterGlassProps) => {
  // Ensure fillPercentage is between 0 and 1
  const safePercentage = Math.min(Math.max(fillPercentage, 0), 1);

  // This SVG uses a different coordinate system with y-axis flipped (negative values)
  // The glass area ranges from approximately y=-530 to y=-80 (total height of about 450 units)
  // We'll fill from the bottom up
  const fillHeight = safePercentage * 800;
  const fillY = -530 + (450 - fillHeight); // Start from the bottom of the glass

  return (
    <Svg width={size} height={size} viewBox="0 -960 960 960">
      <Defs>
        {/* Define a clip path for the glass shape */}
        <ClipPath id="glassClip">
          {/* Wine glass shape from provided SVG */}
          <Path d="M393-80q-31 0-54-20.5T313-152l-31-346q-1-10 3.5-18.5T299-530q8-5 14-12t6-17q0-9-4-16.5T303-588q-10-5-15-15.5t-2-21.5l26-105q3-14 14-22t25-8h109v-40h-60v-80h200v80h-60v40h109q14 0 24.5 8t13.5 22l27 105q3 11-2 21.5T697-588q-8 4-12.5 11t-4.5 16q0 11 5.5 18.5T700-530q9 5 14 13.5t4 18.5l-31 345q-3 31-26 52t-54 21H393Z" />
        </ClipPath>

        {/* Create a gradient for the water fill */}
        <LinearGradient id="waterFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </LinearGradient>
      </Defs>

      {/* Glass outline */}
      <Path
        d="M393-80q-31 0-54-20.5T313-152l-31-346q-1-10 3.5-18.5T299-530q8-5 14-12t6-17q0-9-4-16.5T303-588q-10-5-15-15.5t-2-21.5l26-105q3-14 14-22t25-8h109v-40h-60v-80h200v80h-60v40h109q14 0 24.5 8t13.5 22l27 105q3 11-2 21.5T697-588q-8 4-12.5 11t-4.5 16q0 11 5.5 18.5T700-530q9 5 14 13.5t4 18.5l-31 345q-3 31-26 52t-54 21H393Z"
        fill={backgroundColor}
        stroke={color}
        strokeWidth={2}
      />

      {/* Water fill */}
      <Rect
        x="200"
        y={fillY}
        width="560"
        height="960"
        fill="url(#waterFill)"
        clipPath="url(#glassClip)"
      />
    </Svg>
  );
};

export default WaterGlass;
