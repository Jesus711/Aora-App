import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router' 
// Slot renders the current child's route, so index.js is rendere
// Stack allows us to declare each of our individual screens

// code snippet rnfes, react native functional export component with styles

const RootLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout;