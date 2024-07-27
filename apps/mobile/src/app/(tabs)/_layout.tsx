import { useState, useEffect, useRef } from "react";
import { Tabs, useNavigation } from "expo-router";
import { MaterialCommunityIcons, AntDesign, Ionicons, Octicons } from '@expo/vector-icons';
import { useColorScheme, Pressable, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from "react-native";
// import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { Colors } from "@/constants/Colors";

const { height, width } = Dimensions.get('window');

const TabLayout = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  // const tabBarHeight = useBottomTabBarHeight();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  
  const buttonScale = useRef(new Animated.Value(0)).current;
  const viewOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (showAdd) {
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(viewOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(viewOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showAdd]);

  const handleNavigationToMenu = () => {
    navigation.navigate('menu' as never);
  }

  const handleAddPress = () => {
    setShowAdd(!showAdd);
  };

  const handleNavigationToScan = () => {
    setShowAdd(false)
    navigation.navigate('scan' as never)
  }
  const handleNavigationToManual = () => {
    setShowAdd(false)
    navigation.navigate('manual' as never)
  }

  const activeTintColor = Colors[colorScheme ?? 'light'];
	return (
		<>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarShowLabel: false,
        headerRight: () => (
          <Pressable onPress={handleNavigationToMenu} style={{ marginRight: 15 }}>
            <Ionicons name="grid-outline" size={24} color={Colors[colorScheme ?? 'light'].icon} />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarButton: () => (
            <Pressable 
            onPress={() => handleAddPress()}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <AntDesign size={28} name={showAdd ? 'pluscircle' : 'pluscircleo'} color={showAdd? activeTintColor.tabIconSelected : activeTintColor.tabIconDefault } />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="space"
        options={{
          title: 'Space',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cube' : 'cube-outline'} color={color} size={30} />
          ),
        }}
      />
      </Tabs>
      {showAdd && (
        <TouchableWithoutFeedback onPress={() => setShowAdd(false)}>
          <Animated.View style={[styles.container, { opacity: viewOpacity }]}>
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  transform: [{ scale: buttonScale }],
                },
              ]}
            >
              <Pressable style={[styles.buttonScan, {backgroundColor: Colors[colorScheme ?? 'light'].tint}]} onPress={handleNavigationToScan}>
                <Ionicons name="scan" size={32} color={Colors[colorScheme ?? 'light'].background} />
              </Pressable>
              <Pressable style={[styles.buttonManual, {backgroundColor: Colors[colorScheme ?? 'light'].tint}]} onPress={handleNavigationToManual}>
                <AntDesign name="form" size={32} color={Colors[colorScheme ?? 'light'].background} />
              </Pressable>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </>
	)
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    zIndex: 1000,
    paddingBottom: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 200,
    height: 200,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonScan: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonManual: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});


export default TabLayout