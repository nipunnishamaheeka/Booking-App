import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { auth } from "@/app/config/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

const Page = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        router.replace("/signin");
    };

    useEffect(() => {
        // Get current user data
        const user = auth.currentUser;
        if (user) {
            const emailName = user.email ? user.email.split("@")[0] : "Guest";
            setUserName(emailName);
            setEmail(user.email || "");
        }
        setLoading(false);
    }, []);

    // Menu items data
    const menuItems = [
        { icon: "bookmark-outline", title: "My Bookings", color: "#4B78FF" },
        { icon: "heart-outline", title: "Favorites", color: "#FF6B6B" },
        { icon: "card-outline", title: "Payment Methods", color: "#4CAF50" },
        { icon: "notifications-outline", title: "Notifications", color: "#FF9800" },
        { icon: "help-circle-outline", title: "Help Center", color: "#9C27B0" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background Gradient Header */}
            <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Profile Avatar & Details */}
                <View style={styles.profileTop}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: "https://avatars.githubusercontent.com/u/115369622?v=4" }}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{email}</Text>
                </View>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Edit Profile Button */}
                <TouchableOpacity style={styles.editProfileButton}>
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Bookings</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>4</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>7</Text>
                        <Text style={styles.statLabel}>Wishlists</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    <Text style={styles.menuSectionTitle}>Settings</Text>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                index === menuItems.length - 1 ? styles.menuItemLast : null
                            ]}
                        >
                            <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                                <Ionicons name={item.icon} size={22} color={item.color} />
                            </View>
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" style={styles.menuArrow} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#FF4B55" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    headerGradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: -1,
        paddingTop: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginTop: 30,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFF",
    },
    settingsButton: {
        padding: 5,
    },
    profileTop: {
        alignItems: "center",
        paddingVertical: 15,
    },
    avatarContainer: {
        padding: 3,
        borderRadius: 55,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#FFF",
    },
    userName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFF",
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
    },
    scrollView: {
        flex: 1,
        marginTop: 270,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    editProfileButton: {
        backgroundColor: "#FFF",
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 20,
        marginTop: 0,
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    editProfileText: {
        color: "#4B78FF",
        fontWeight: "600",
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginBottom: 25,
        paddingVertical: 20,
        borderRadius: 16,
        justifyContent: "space-around",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: "#777",
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#E0E0E0",
    },
    menuSectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 15,
        marginHorizontal: 20,
    },
    menuContainer: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 25,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    menuArrow: {
        marginLeft: 10,
    },
    logoutButton: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginBottom: 30,
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 75, 85, 0.3)",
        flexDirection: "row",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoutText: {
        color: "#FF4B55",
        fontSize: 16,
        fontWeight: "600",
    },
});