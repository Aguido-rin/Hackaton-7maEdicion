import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CronogramaScreen from './screens/CronogramaScreen';
import DetalleScreen from './screens/DetalleScreen';

export type RootStackParamList = {
  Home: undefined;
  Cronograma: undefined;
  Detalle: { centroId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0d6efd',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Consulta de Votación' }}
        />
        <Stack.Screen 
          name="Cronograma" 
          component={CronogramaScreen}
          options={{ title: 'Cronograma Electoral' }}
        />
        <Stack.Screen 
          name="Detalle" 
          component={DetalleScreen}
          options={{ title: 'Detalle del Centro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
