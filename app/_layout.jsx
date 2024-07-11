// code snippet rnfes, react native functional export component with styles
import { Slot, SplashScreen, Stack } from 'expo-router';
// Slot renders the current child's route, so index.js is rendere
// Stack allows us to declare each of our individual screens

import { useFonts } from 'expo-font';
import { useEffect } from 'react';

// Creating directory/folder with parentheses (name), the directory is considered a route group
// Allowing to add additional pages/screens within it  with a special layout

// Prevents the splash screen from auto hiding before the asset loading is complete.
SplashScreen.preventAutoHideAsync();


const RootLayout = () => {

    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
      });

    // UseEffect will be called initially and 
    // Dependency array, recall useEffect's callback function
    // again when either the fontsLoaded or error is changed
    useEffect(() => {
        if(error) throw error;

        if(fontsLoaded){
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    // No fonts loaded and no error occurred, return null
    if(!fontsLoaded && !error) return null;


  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout;