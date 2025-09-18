import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";

type TabMeta = {
  key: string;
  name: string;
  label: string;
  icon: {
    focused: keyof typeof Ionicons.glyphMap;
    unfocused: keyof typeof Ionicons.glyphMap;
  };
  routeName: string;
};

export default function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Build an ordered list of tabs. We'll render two on the left, FAB in middle, two on the right.
  const tabs: TabMeta[] = useMemo(() => {
    return state.routes.map((route, index) => {
      const options = descriptors[route.key]?.options ?? {};
      const label =
        (typeof options.tabBarLabel === "string" && options.tabBarLabel) ||
        options.title ||
        route.name;

      // Choose outlined icons by default; use options.tabBarIcon if provided
      // but fall back to sensible Ionicons based on route name
      const routeLower = route.name.toLowerCase();
      let iconNameUnfocused: keyof typeof Ionicons.glyphMap = "ellipse-outline";
      let iconNameFocused: keyof typeof Ionicons.glyphMap = "ellipse";

      if (routeLower.includes("home")) {
        iconNameUnfocused = "home-outline";
        iconNameFocused = "home";
      } else if (routeLower.includes("schedule")) {
        iconNameUnfocused = "calendar-outline";
        iconNameFocused = "calendar";
      } else if (
        routeLower.includes("tips") ||
        routeLower.includes("support")
      ) {
        iconNameUnfocused = "help-circle-outline";
        iconNameFocused = "help-circle";
      } else if (
        routeLower.includes("feedback") ||
        routeLower.includes("me") ||
        routeLower.includes("profile")
      ) {
        iconNameUnfocused = "person-outline";
        iconNameFocused = "person";
      } else if (
        routeLower.includes("request") ||
        routeLower.includes("add") ||
        routeLower.includes("create")
      ) {
        iconNameUnfocused = "add-circle-outline";
        iconNameFocused = "add-circle";
      }

      return {
        key: route.key,
        name: route.name,
        label: String(label),
        icon: { unfocused: iconNameUnfocused, focused: iconNameFocused },
        routeName: route.name,
      };
    });
  }, [state.routes, descriptors]);

  // Ensure generous bottom padding to avoid OS navigation areas
  const paddingBottom = Math.max((insets.bottom || 0) + 20, 16);

  return (
    <View style={[styles.container, { paddingBottom }]}>
      {/* All tabs in horizontal layout */}
      <View style={styles.tabsContainer}>
        {tabs.map(renderTab)}
      </View>
    </View>
  );

  function renderTab(tab: TabMeta, idx: number) {
    const routeIndex = state.routes.findIndex((r) => r.key === tab.key);
    const isFocused = state.index === routeIndex;
    const iconColor = isFocused
      ? theme.colors.text
      : theme.colors.textSecondary;
    const labelColor = isFocused
      ? theme.colors.text
      : theme.colors.textSecondary;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: tab.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(tab.name as never);
      }
    };

    const onLongPress = () => {
      navigation.emit({ type: "tabLongPress", target: tab.key });
    };

    return (
      <Pressable
        key={tab.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [styles.tabItem, pressed && styles.pressed]}
      >
        <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
          <Ionicons
            name={isFocused ? tab.icon.focused : tab.icon.unfocused}
            size={22}
            color={isFocused ? theme.colors.text : iconColor}
          />
        </View>
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {tab.label}
        </Text>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingTop: 12,
    paddingHorizontal: 16,
    minHeight: Platform.select({ ios: 96, android: 88, default: 88 }),
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    minWidth: 48,
    height: 30,
    borderRadius: 9999,
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primary,
    borderRadius: 9999,
    overflow: "hidden",
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
