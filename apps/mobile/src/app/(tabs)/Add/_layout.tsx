import { Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default () => {
	return (
		<Tabs>
      <Tabs.Screen
      name="Scan"
      options={{
        tabBarIcon: () => <Ionicons name="scan" size={24} color="black" />,
        headerShown: false,
        headerTitle: "Scan a new recoed",
        title: "Scan",
      }}
      />
			<Tabs.Screen
			name="Manual"
			options={{
        tabBarIcon: () => <Entypo name="add-to-list" size={24} color="black" />,
        headerShown: true,
				headerTitle: "Manual Entry",
				title: "Manual",
			}}
			/>
		</Tabs>
	)
}