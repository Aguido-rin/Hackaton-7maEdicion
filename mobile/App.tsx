import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// importamos las pantallas
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import PartidosScreen from "./screens/PartidosScreen";
import CronogramaScreen from "./screens/CronogramaScreen";

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Centros: undefined;
  Partidos: undefined;
  Cronograma: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Centros"
        component={HomeScreen}
        options={{
          title: "Centros de Votación",
        }}
      />
      <Tab.Screen
        name="Partidos"
        component={PartidosScreen}
        options={{
          title: "Partidos Políticos",
        }}
      />
      <Tab.Screen
        name="Cronograma"
        component={CronogramaScreen}
        options={{
          title: "Cronograma",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0d6efd",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ title: "Consulta de Votación" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
