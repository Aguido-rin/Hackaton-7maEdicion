import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0.5,
          borderTopColor: "#e5e7eb",
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      {}

      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="calendario"
        options={{
          title: "Calendario",
          tabBarLabel: "Calendario",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="event" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="elector/index"
        options={{
          title: "Elector",
          tabBarLabel: "Elector",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="how-to-vote" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="miembros/index"
        options={{
          title: "Miembro de mesa",
          tabBarLabel: "Miembro",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="badge" size={size} color={color} />,
        }}
      />

      {}
      {}

      {}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />

      {}
      <Tabs.Screen
        name="agrupaciones/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="agrupaciones/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="agrupaciones/candidato/[id]"
        options={{
          href: null,
        }}
      />

      {}
    </Tabs>
  );
}
