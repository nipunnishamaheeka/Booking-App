import React from 'react';
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={24} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="calender"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="calendar" size={24} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="booking"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="clipboard" size={24} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person" size={24} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
