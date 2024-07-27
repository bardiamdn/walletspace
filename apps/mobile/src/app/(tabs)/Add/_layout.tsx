import { Stack } from "expo-router";

const AddStack = () => {
  return (
    // <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="scan" options={{ title: 'Scan' }} />
        <Stack.Screen name="manual" options={{ title: 'Manual' }} />
      </Stack>
      //  <BottomNavigation /> 
    //  </View> 
  );
}

export default AddStack;
