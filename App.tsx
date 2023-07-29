import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SupportPage from "./components/SupportPage";
import QRScannerScreen from "./components/QRScannerScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#374151" },
          headerTintColor: "white",
        }}
        initialRouteName="SupportPage"
      >
        <Stack.Screen name="SupportPage" component={SupportPage} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
