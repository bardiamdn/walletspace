import { View, Text, Pressable, StatusBar } from "react-native"
import React from "react"
import { Link } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

const Signin = () => {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Link href={'/register'} asChild>
          <Pressable style={{backgroundColor: '#ffff'}}>
            <Text style={{color: 'black'}}>
              Go to Register Page
            </Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    </>
  )
}

export default Signin;