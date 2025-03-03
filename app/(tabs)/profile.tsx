import React, {useEffect, useState} from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {router, Stack} from "expo-router";
import {auth} from "@/app/config/firebaseConfig";

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
            const emailName = user.email ? user.email.split('@')[0] : "Guest";
            setUserName(emailName);
            setEmail(user.email || "");
        }
        setLoading(false);
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    // Hide the default header
                    headerShown: false,
                }}
            />
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: "https://avatars.githubusercontent.com/u/115369622?v=4" }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{email}</Text>
                    <TouchableOpacity style={styles.editProfileButton}>
                        <Text style={styles.editProfileText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

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
                {/*<View style={styles.menuContainer}>*/}
                {/*    <TouchableOpacity style={styles.menuItem}>*/}
                {/*        <View style={styles.menuIconContainer}>*/}
                {/*            <Ionicons name="bookmark-outline" size={22} color="#4B78FF" />*/}
                {/*        </View>*/}
                {/*        <Text style={styles.menuText}>My Bookings</Text>*/}
                {/*        <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />*/}
                {/*    </TouchableOpacity>*/}

                {/*    <TouchableOpacity style={styles.menuItem}>*/}
                {/*        <View style={styles.menuIconContainer}>*/}
                {/*            <Ionicons name="heart-outline" size={22} color="#4B78FF" />*/}
                {/*        </View>*/}
                {/*        <Text style={styles.menuText}>Favorites</Text>*/}
                {/*        <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />*/}
                {/*    </TouchableOpacity>*/}

                {/*    <TouchableOpacity style={styles.menuItem}>*/}
                {/*        <View style={styles.menuIconContainer}>*/}
                {/*            <Ionicons name="card-outline" size={22} color="#4B78FF" />*/}
                {/*        </View>*/}
                {/*        <Text style={styles.menuText}>Payment Methods</Text>*/}
                {/*        <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />*/}
                {/*    </TouchableOpacity>*/}

                {/*    <TouchableOpacity style={styles.menuItem}>*/}
                {/*        <View style={styles.menuIconContainer}>*/}
                {/*            <Ionicons name="notifications-outline" size={22} color="#4B78FF" />*/}
                {/*        </View>*/}
                {/*        <Text style={styles.menuText}>Notifications</Text>*/}
                {/*        <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />*/}
                {/*    </TouchableOpacity>*/}

                {/*    <TouchableOpacity style={styles.menuItem}>*/}
                {/*        <View style={styles.menuIconContainer}>*/}
                {/*            <Ionicons name="help-circle-outline" size={22} color="#4B78FF" />*/}
                {/*        </View>*/}
                {/*        <Text style={styles.menuText}>Help Center</Text>*/}
                {/*        <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
        backgroundColor: "#F5F5F5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#FFF",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
    },
    settingsButton: {
        padding: 5,
    },
    profileSection: {
        alignItems: "center",
        backgroundColor: "#FFF",
        paddingVertical: 25,
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        backgroundColor: "#EFEFEF", // Placeholder color
    },
    userName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
    },
    editProfileButton: {
        borderWidth: 1,
        borderColor: "#4B78FF",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    editProfileText: {
        color: "#4B78FF",
        fontWeight: "500",
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        marginBottom: 15,
        paddingVertical: 15,
        justifyContent: "space-around",
        alignItems: "center",
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#E0E0E0",
    },
    menuContainer: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        marginHorizontal: 15,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F0F7FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    menuArrow: {
        marginLeft: 10,
    },
    logoutButton: {
        backgroundColor: "#FFF",
        marginHorizontal: 15,
        marginBottom: 30,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FF4B55",
    },
    logoutText: {
        color: "#FF4B55",
        fontSize: 16,
        fontWeight: "600",
    },
});