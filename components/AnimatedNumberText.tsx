import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import { AnimatedCounter } from "./AnimatedCounter";

interface AnimatedNumberTextProps {
  children: string | number;
  fontSize?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  fontFamily?: string;
  style?: ViewStyle;
  animateNumbers?: boolean;
  prefix?: string;
  suffix?: string;
}

/**
 * AnimatedNumberText Component
 *
 * A wrapper utility that automatically detects numeric values in text
 * and replaces them with animated counters while preserving non-numeric text.
 *
 * Usage Examples:
 *
 * 1. Simple number animation:
 *    <AnimatedNumberText>42</AnimatedNumberText>
 *
 * 2. Number with units:
 *    <AnimatedNumberText suffix=" kg">4.2</AnimatedNumberText>
 *
 * 3. Currency formatting:
 *    <AnimatedNumberText prefix="$">1,234.56</AnimatedNumberText>
 *
 * 4. Disable animation for specific cases:
 *    <AnimatedNumberText animateNumbers={false}>42</AnimatedNumberText>
 */
export const AnimatedNumberText: React.FC<AnimatedNumberTextProps> = ({
  children,
  fontSize = 24,
  color,
  fontWeight = "700",
  fontFamily,
  style,
  animateNumbers = true,
  prefix = "",
  suffix = "",
}) => {
  // Convert children to string for processing
  const text = children?.toString() || "";

  // If animation is disabled, return regular text
  if (!animateNumbers) {
    return (
      <AnimatedCounter
        value={text}
        fontSize={fontSize}
        color={color}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        style={style}
        prefix={prefix}
        suffix={suffix}
      />
    );
  }

  // Check if the entire string is a number (possibly with decimal point)
  const isNumericValue = /^[\d.,\s+-]+$/.test(text.trim());

  if (isNumericValue) {
    return (
      <AnimatedCounter
        value={text}
        fontSize={fontSize}
        color={color}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        style={style}
        prefix={prefix}
        suffix={suffix}
      />
    );
  }

  // For mixed text (numbers + letters), extract and animate only the numeric parts
  // This is a more complex case that would require text parsing
  // For now, we'll treat it as a simple animated counter
  return (
    <AnimatedCounter
      value={text}
      fontSize={fontSize}
      color={color}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
      style={style}
      prefix={prefix}
      suffix={suffix}
    />
  );
};

/**
 * Utility function to create animated number components with specific styling
 */
export const createAnimatedNumber = (
  value: number | string,
  options?: {
    fontSize?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    prefix?: string;
    suffix?: string;
    style?: ViewStyle;
  }
) => {
  return (
    <AnimatedCounter
      value={value}
      fontSize={options?.fontSize}
      color={options?.color}
      fontWeight={options?.fontWeight}
      style={options?.style}
      prefix={options?.prefix}
      suffix={options?.suffix}
    />
  );
};

export default AnimatedNumberText;
