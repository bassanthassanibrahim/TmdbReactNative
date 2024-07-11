import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';

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
    

      </Stack.Navigator>

    </NavigationContainer>
  );
}
