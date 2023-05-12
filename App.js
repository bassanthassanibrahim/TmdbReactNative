import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import DisplayScreen from './Screens/DisplayScreen';
import FilterScreen from './Screens/FilterScreen';
import MovieDetaiedScreen from './Screens/MovieDetailedScreen';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions=
      {{
        headerTitleAlign: "center",
        headerTitleStyle :{fontWeight: 'bold', color:'black'},
      }}>

      <Stack.Screen
        name="TMDB: The Movie Database"
        component={HomeScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#282f39',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="FilterScreen"
        component={FilterScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#282f39',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTintColor: 'white',
          headerTitle: 'Browse By Genre',
        }}
      />
      <Stack.Screen
        name="DisplayScreen"
        component={DisplayScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#282f39',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTintColor: 'white',
          headerTitle: 'Search Results',
        }}
      />
      <Stack.Screen
        name="MovieScreen"
        component={MovieDetaiedScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#282f39',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerTintColor: 'white',
          headerTitle: 'Movie Details',
        }}
      />

      </Stack.Navigator>

    </NavigationContainer>
  );
}
