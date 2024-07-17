import { Stack } from 'expo-router';

const StackLayout = () => {
  return (
    <Stack>
      {/* <Stack.Screen name='(tabs)'></Stack.Screen> */}
      <Stack.Screen name="(tabs)" 
      options={{
        headerShown: false,
        // headerTitle: 'Home',
      }} 
      />
      {/* <Stack.Screen name='Add'></Stack.Screen> */}
    </Stack>
  )
}

export default StackLayout;