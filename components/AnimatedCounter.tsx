import { MotiView } from "moti";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface TickerListProps {
  number: number;
  fontSize: number;
  index: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  fontFamily?: string;
}

interface AnimatedCounterProps {
  value: number | string;
  fontSize?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  fontFamily?: string;
  style?: ViewStyle;
  prefix?: string;
  suffix?: string;
  includeDecimal?: boolean;
}

const TickerList: React.FC<TickerListProps> = ({
  number,
  fontSize,
  index,
  color = "#000",
  fontWeight = "700",
  fontFamily,
}) => {
  // Ensure number is between 0-9, handle edge cases
  const validNumber = Math.max(0, Math.min(9, Math.floor(number || 0)));

  const digitHeight = fontSize * 1.2; // Increased height for better spacing
  const containerWidth = fontSize * 0.6; // Reduced width to decrease spacing

  return (
    <View
      style={{
        height: digitHeight,
        width: containerWidth,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <MotiView
        from={{
          translateY: 0,
        }}
        animate={{
          translateY: -digitHeight * validNumber,
        }}
        transition={{
          type: "timing",
          duration: 600,
          delay: index * 50,
        }}
        style={{
          alignItems: "center",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <View
            key={digit}
            style={{
              height: digitHeight,
              width: containerWidth,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize,
                fontWeight,
                fontFamily,
                color,
                textAlign: "center",
                includeFontPadding: false,
                textAlignVertical: "center",
              }}
            >
              {digit}
            </Text>
          </View>
        ))}
      </MotiView>
    </View>
  );
};

const TickerSpecialChar: React.FC<{
  char: string;
  fontSize: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  fontFamily?: string;
}> = ({ char, fontSize, color = "#000", fontWeight = "700", fontFamily }) => {
  const digitHeight = fontSize * 1.2;

  // Dynamic width based on character type
  const getCharWidth = (character: string) => {
    if (character === " ") return fontSize * 0.35; // Slightly wider for spaces
    if (character === "." || character === ",") return fontSize * 0.4; // Small width for punctuation
    if (character === "%") return fontSize * 1.0; // Wide enough for percentage symbol
    if (character === "+" || character === "-") return fontSize * 0.7; // Medium width for operators
    if (/[a-zA-Z]/.test(character)) return fontSize * 0.85; // Wide enough for letters like 'k', 'g'
    // Minimum width to ensure no character gets completely cut off
    return Math.max(fontSize * 0.6, 16); // Default width with minimum
  };

  const containerWidth = getCharWidth(char);

  return (
    <View
      style={{
        height: digitHeight,
        width: containerWidth,
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible", // Changed from hidden to visible for special chars
      }}
    >
      <Text
        style={{
          fontSize,
          fontWeight,
          fontFamily,
          color,
          textAlign: "center",
          includeFontPadding: false,
          textAlignVertical: "center",
          minWidth: containerWidth, // Ensure text has enough space
        }}
      >
        {char}
      </Text>
    </View>
  );
};

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  fontSize = 24,
  color = "#000",
  fontWeight = "700",
  fontFamily,
  style,
  prefix = "",
  suffix = "",
  includeDecimal = true,
}) => {
  // Convert value to string and handle formatting
  const stringValue =
    typeof value === "number" ? value.toString() : value.toString();

  // Split the string into characters, preserving decimal points and other characters
  const characters = stringValue.split("");

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      {/* Render prefix */}
      {prefix && (
        <TickerSpecialChar
          char={prefix}
          fontSize={fontSize}
          color={color}
          fontWeight={fontWeight}
          fontFamily={fontFamily}
        />
      )}

      {/* Render each character */}
      {characters.map((char, index) => {
        const isDigit = /\d/.test(char);

        if (isDigit) {
          return (
            <TickerList
              key={`${index}-${char}-${stringValue}`} // Better key to trigger re-animation
              number={parseInt(char, 10)}
              fontSize={fontSize}
              index={index}
              color={color}
              fontWeight={fontWeight}
              fontFamily={fontFamily}
            />
          );
        } else {
          // Handle decimal points, commas, spaces, etc.
          return (
            <TickerSpecialChar
              key={`${index}-${char}-${stringValue}`}
              char={char}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
              fontFamily={fontFamily}
            />
          );
        }
      })}

      {/* Render suffix */}
      {suffix && (
        <TickerSpecialChar
          char={suffix}
          fontSize={fontSize}
          color={color}
          fontWeight={fontWeight}
          fontFamily={fontFamily}
        />
      )}
    </View>
  );
};

export default AnimatedCounter;
