import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface SimpleCounterProps {
  value: number | string;
  fontSize?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  fontFamily?: string;
  style?: ViewStyle;
  prefix?: string;
  suffix?: string;
}

/**
 * SimpleCounter - A fallback non-animated counter component
 * Use this if the AnimatedCounter has issues
 */
export const SimpleCounter: React.FC<SimpleCounterProps> = ({
  value,
  fontSize = 24,
  color = "#000",
  fontWeight = "700",
  fontFamily,
  style,
  prefix = "",
  suffix = "",
}) => {
  const displayValue = `${prefix}${value}${suffix}`;

  return (
    <View style={style}>
      <Text
        style={{
          fontSize,
          fontWeight,
          fontFamily,
          color,
          textAlign: "center",
        }}
      >
        {displayValue}
      </Text>
    </View>
  );
};

export default SimpleCounter;
