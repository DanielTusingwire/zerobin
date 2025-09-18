import { Tabs } from "expo-router";
import React from "react";
import BottomTabBar from "../../../components/ui/BottomTabBar";
import { theme } from "../../../constants/theme";

export default function CustomerTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: "Support",
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: "Me",
        }}
      />
    </Tabs>
  );
}
