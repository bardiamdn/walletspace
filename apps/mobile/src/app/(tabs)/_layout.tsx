import { Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';

export default () => {
	return (
		<Tabs>
			<Tabs.Screen
			name="Dashboard"
			options={{
				tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
				headerTitle: "Analytics",
				title: "Home",
			}}
			/>
			<Tabs.Screen
			name="Add"
			options={{
				tabBarIcon: () => <AntDesign name="pluscircle" size={24} color="black" />,
				headerTitle: "Add a Record",
				title: "Add",
			}}
			/>
			<Tabs.Screen
			name="Space"
			options={{
				tabBarIcon: () => <Ionicons name="cube-outline" size={24} color="black" />,
				headerTitle: "Your Spaces",
				title: "Space",
			}}
			/>
		</Tabs>
	)
}