import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { LoadingSpinner } from "../../../components/shared";
import { theme } from "../../../constants/theme";
import { useAppContext, useCustomerContext } from "../../../contexts";
import { RequestStatus, WasteType } from "../../../types/common";

export default function CustomerHomeScreen() {
  const { state: appState } = useAppContext();
  const {
    state: customerState,
    loadPickupRequests,
    loadProfile,
    refreshAll,
  } = useCustomerContext();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load initial data
    loadProfile();
    loadPickupRequests();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAll();
    } finally {
      setRefreshing(false);
    }
  };

  const getUpcomingPickups = () => {
    return customerState.pickupRequests.filter(
      (pickup) =>
        pickup.status === RequestStatus.CONFIRMED ||
        pickup.status === RequestStatus.IN_PROGRESS
    ).length;
  };

  const getCompletedPickups = () => {
    return customerState.pickupRequests.filter(
      (pickup) => pickup.status === RequestStatus.COMPLETED
    ).length;
  };

  const getTotalWasteThisMonth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return customerState.pickupRequests
      .filter((pickup) => {
        if (pickup.status !== RequestStatus.COMPLETED || !pickup.completedDate)
          return false;
        const completedDate = new Date(pickup.completedDate);
        return (
          completedDate.getMonth() === currentMonth &&
          completedDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, pickup) => sum + pickup.quantity, 0);
  };

  const getCO2Saved = () => {
    // Approximate CO2e savings factors per kg, by primary waste type
    // These are demo values for mock data and do not represent exact lifecycle analysis
    const factors: Record<string, number> = {
      [WasteType.RECYCLABLE]: 1.2, // recycling plastics/paper/metals saves significant CO2e
      [WasteType.ORGANIC]: 0.25, // composting vs landfill methane
      [WasteType.GENERAL]: 0.1, // minimal assumed benefit
      [WasteType.HAZARDOUS]: 0.0, // not counted in this mock metric
    };

    const totalCO2 = customerState.pickupRequests
      .filter((pickup) => pickup.status === RequestStatus.COMPLETED)
      .reduce((sum, pickup) => {
        const primaryType = pickup.wasteType?.[0] ?? WasteType.GENERAL;
        const factor = factors[primaryType] ?? factors[WasteType.GENERAL];
        return sum + pickup.quantity * factor;
      }, 0);

    return Math.round(totalCO2);
  };

  if (customerState.isLoading) {
    return <LoadingSpinner />;
  }

  const userName = appState.currentUser?.name?.split(" ")[0] || "Daniel";
  const upcomingPickups = getUpcomingPickups();
  const completedPickups = getCompletedPickups();
  const totalWasteThisMonth = getTotalWasteThisMonth();
  const co2Saved = getCO2Saved();

  return (
    <View style={styles.container}>
      {/* Fixed top bar */}
      <View style={styles.fixedTopBar}>
        <Image
          source={require("../../../assets/logo/zerobin.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color={theme.colors.text} />
          {customerState.notifications.filter((n) => !n.read).length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {customerState.notifications.filter((n) => !n.read).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Scrollable header background with greeting */}
        <View style={styles.scrollableHeader}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Good afternoon, {userName} 👋</Text>
            <Text style={styles.subtitle}>
              Let's make a positive impact today!
            </Text>
          </View>
        </View>
        {/* Upper stats card (single card with divider) */}
        <View style={styles.upperStatsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{upcomingPickups}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
              <Text style={styles.statSubLabel}>Pickups</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedPickups}</Text>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statSubLabel}>Pickups</Text>
            </View>
          </View>
        </View>

        {/* Two separate impact cards */}
        <View style={styles.impactRow}>
          <View style={styles.impactContainer}>
            <View style={styles.impactIconCircle}>
              <Ionicons name="leaf" size={22} color={theme.colors.text} />
            </View>
            <Text style={styles.impactNumber}>{totalWasteThisMonth}kg</Text>
            <Text style={styles.impactLabel}>Total Waste</Text>
            <Text style={styles.impactSubLabel}>Collected this month</Text>
          </View>
          <View style={styles.impactContainer}>
            <View style={styles.impactIconCircle}>
              <Ionicons name="cloud" size={22} color={theme.colors.text} />
            </View>
            <Text style={styles.impactNumber}>{co2Saved}kg</Text>
            <Text style={styles.impactLabel}>CO₂ Saved</Text>
            <Text style={styles.impactSubLabel}>Carbon footprint reduced</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => router.push("/request")}
          >
            <Ionicons
              name="location"
              size={20}
              color={theme.colors.buttonText}
            />
            <Text style={styles.primaryActionText}>Live Track</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => {
              /* Navigate to invoices */
            }}
          >
            <View style={styles.secondaryActionIcon}>
              <Ionicons
                name="receipt"
                size={20}
                color={theme.colors.buttonText}
              />
            </View>
            <Text style={styles.secondaryActionText}>Invoices</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => router.push("/customer/schedule")}
          >
            <View style={styles.secondaryActionIcon}>
              <Ionicons
                name="document-text"
                size={20}
                color={theme.colors.buttonText}
              />
            </View>
            <Text style={styles.secondaryActionText}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => router.push("/customer/tips")}
          >
            <View style={styles.secondaryActionIcon}>
              <Ionicons name="bulb" size={20} color={theme.colors.buttonText} />
            </View>
            <Text style={styles.secondaryActionText}>Tips</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/request")}
        activeOpacity={0.8}
      >
        <View style={styles.fabInner}>
          <Ionicons name="add" size={28} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  fixedTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#EEFF93",
    paddingTop: 60, // Account for status bar
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollableHeader: {
    backgroundColor: "#EEFF93",
    paddingTop: 120, // More space for fixed top bar
    paddingBottom: 80, // Increased height
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  logoImage: {
    height: 25,
    width: 90,
  },
  notificationButton: {
    position: "relative",
    padding: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  greetingSection: {
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "400",
  },
  scrollView: {
    flex: 1,
  },
  upperStatsCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginTop: -60, // Increased overlap with scrollable header
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 160,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    flex: 1,
  },
  statCard: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.secondary,
    marginBottom: 4,
    textAlign: "left",
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
    textAlign: "left",
  },
  statSubLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "left",
  },
  impactRow: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  impactContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  impactIcon: {
    marginBottom: 12,
  },
  impactIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2FFD1", // light eco tint
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  impactNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  impactSubLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  primaryAction: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 25,
    minWidth: 150,
    gap: 8,
    flexShrink: 1,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.buttonText,
  },
  secondaryAction: {
    alignItems: "center",
    gap: 8,
    minWidth: 60,
    flexShrink: 1,
  },
  secondaryActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.text,
  },
  bottomSpacing: {
    height: 100,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: theme.colors.secondary,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  fabInner: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
});
