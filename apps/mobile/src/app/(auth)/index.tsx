import { View, Text, Pressable, StatusBar, StyleSheet, Dimensions, useColorScheme } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFonts } from 'expo-font';
import { Ionicons } from "@expo/vector-icons";

import AnimatedButton from "@/components/AuthNavButton";
import { Colors } from "@/constants/Colors";


const Landing = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light']

  let [fontsLoaded] = useFonts({
    'Inter-Custom': require('@/assets/fonts/Inter-VariableFont_slnt,wght.ttf'),
    'Montserrat': require('@/assets/fonts/Montserrat-VariableFont_wght.ttf'),
    'Montserrat-Italic': require('@/assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <View style={styles.message}>
            <Text style={{ fontSize: 30, fontFamily: 'Montserrat-Italic' }}>Message Here</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {/* <AnimatedButton text="Continue with Google" link="signin" icon={<AntDesign name="google" size={20} style={{marginRight: 15, color: colors.icon}} />}  />
          <AnimatedButton text="Continue with Apple" link="signin" icon={<FontAwesome name="apple" size={20} style={{marginRight: 15, color: colors.icon}} />}  /> */}
          <AnimatedButton text="Continue with email" link="signin" icon={<Ionicons name="mail-outline" size={20} style={{marginRight: 15, color: colors.icon}} />}  />
        </View>
      </SafeAreaView>
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'space-between', 
    alignItems: 'center',
    margin: 40,
  },
  messageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  message: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: Colors.light.primary
  },
  buttonContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20
  }
})

export default Landing;
