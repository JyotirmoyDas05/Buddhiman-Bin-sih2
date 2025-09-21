import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const themeBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  // If the caller already provided a backgroundColor in the style prop, respect it.
  // style can be an object, array, or falsy. Normalize and check for backgroundColor.
  const flattenStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : typeof style === "object" && style
    ? (style as any)
    : {};

  const explicitBg = flattenStyle.backgroundColor;

  const appliedStyle = explicitBg
    ? style
    : [{ backgroundColor: themeBackground }, style];

  return <View style={appliedStyle} {...otherProps} />;
}
