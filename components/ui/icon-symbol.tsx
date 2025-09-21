import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleProp, TextStyle } from "react-native";

type IconLib =
  | "MaterialIcons"
  | "Ionicons"
  | "MaterialCommunityIcons"
  | "FontAwesome";

const ICON_LIBS: Record<IconLib, any> = {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
};

type MappingEntry = { lib: IconLib; name: string };

/**
 * Map your SF-symbol-like keys (used across the app) to a chosen icon from Expo Vector Icons.
 * Add or adjust entries here when you need new icons. Keys are strings used by the app — keep
 * them stable so the rest of the codebase doesn't need changes.
 */
const MAPPING: Record<string, MappingEntry> = {
  // Tabs
  "house.fill": { lib: "MaterialIcons", name: "home" },
  "camera.fill": { lib: "MaterialIcons", name: "photo-camera" },
  camera: { lib: "MaterialIcons", name: "photo-camera" },
  sparkles: { lib: "MaterialIcons", name: "auto-awesome" },
  "chart.line.uptrend.xyaxis": { lib: "MaterialIcons", name: "trending-up" },
  "person.circle.fill": { lib: "MaterialIcons", name: "account-circle" },

  // Additional tab/demo icons
  "brain.head.profile": { lib: "MaterialCommunityIcons", name: "brain" },
  "chart.bar.fill": { lib: "MaterialIcons", name: "bar-chart" },
  "chart.xyaxis.line": { lib: "MaterialIcons", name: "analytics" },
  monitor: { lib: "MaterialCommunityIcons", name: "monitor" },

  // Common utilities
  "star.fill": { lib: "MaterialIcons", name: "star" },
  star: { lib: "MaterialIcons", name: "star-border" },
  calendar: { lib: "MaterialIcons", name: "event" },
  leaf: { lib: "MaterialCommunityIcons", name: "leaf" },
  "leaf.fill": { lib: "MaterialCommunityIcons", name: "leaf" },
  envelope: { lib: "MaterialIcons", name: "mail-outline" },
  pencil: { lib: "MaterialIcons", name: "edit" },
  shield: { lib: "MaterialIcons", name: "security" },
  "chevron.right": { lib: "MaterialIcons", name: "chevron-right" },
  "chevron.left": { lib: "MaterialIcons", name: "chevron-left" },
  "chevron.up": { lib: "MaterialIcons", name: "expand-less" },
  "chevron.down": { lib: "MaterialIcons", name: "expand-more" },

  // More mappings collected from the codebase
  "person.fill": { lib: "MaterialIcons", name: "person" },
  "person.2.fill": { lib: "MaterialIcons", name: "group" },
  "envelope.fill": { lib: "MaterialIcons", name: "email" },
  "bell.fill": { lib: "MaterialIcons", name: "notifications" },
  "questionmark.circle.fill": { lib: "MaterialIcons", name: "help" },
  "shield.fill": { lib: "MaterialIcons", name: "security" },
  "arrow.right.square.fill": { lib: "MaterialIcons", name: "exit-to-app" },
  "paperplane.fill": { lib: "MaterialIcons", name: "send" },
  "chevron.left.forwardslash.chevron.right": {
    lib: "MaterialIcons",
    name: "code",
  },

  // Icons seen in lists and cards
  "trash.fill": { lib: "MaterialIcons", name: "delete" },
  "arrow.3.trianglepath": { lib: "MaterialIcons", name: "autorenew" },
  "hand.raised.fill": { lib: "MaterialIcons", name: "pan-tool" },
  "gift.fill": { lib: "MaterialIcons", name: "card-giftcard" },
  checkmark: { lib: "MaterialIcons", name: "check" },
  "exclamationmark.triangle.fill": { lib: "MaterialIcons", name: "warning" },
  target: { lib: "MaterialCommunityIcons", name: "target" },
  gear: { lib: "MaterialIcons", name: "settings" },
  stethoscope: { lib: "MaterialCommunityIcons", name: "stethoscope" },
};

type IconSymbolProps = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  weight?: string;
  [key: string]: any;
};

/**
 * IconSymbol
 * - Uses `@expo/vector-icons` under the hood.
 * - Accepts the same string keys used across the app (SF-symbol-like keys).
 * - Falls back to a visible help icon when a mapping isn't found.
 */
export function IconSymbol({
  name,
  size = 24,
  color = "#000",
  style,
  ...rest
}: IconSymbolProps) {
  const entry = MAPPING[name];

  if (!entry) {
    // Helpful warning for missing mappings — this will appear in Metro/console.
    console.warn(
      `IconSymbol: no mapping for "${name}" — falling back to help icon.`
    );
    const Fallback = ICON_LIBS.MaterialCommunityIcons;
    return (
      <Fallback
        name="help-circle-outline"
        size={size}
        color={color}
        style={style}
      />
    );
  }

  const IconComponent = ICON_LIBS[entry.lib] as any;
  // We cast to any because different icon libs have different name unions — this keeps usage flexible.
  return (
    <IconComponent
      name={entry.name as any}
      size={size}
      color={color}
      style={style}
      {...rest}
    />
  );
}

export default IconSymbol;
