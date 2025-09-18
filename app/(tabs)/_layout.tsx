import { Tabs } from "expo-router";
import React from "react";

import { theme } from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none",
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {/* We delegate actual tab bars to nested layouts in customer/ and driver/ */}
      <Tabs.Screen name="customer" options={{ href: undefined }} />
      <Tabs.Screen name="driver" options={{ href: undefined }} />
      {/* Hide legacy routes if any remain */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
