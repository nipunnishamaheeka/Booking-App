import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import CategoryButtons from "@/components/CategoryButtons";
import Listings from "@/components/Listings";
import listingData from "@/data/destinations.json";
import GroupListing from "@/components/GroupListing";
import groupData from "@/data/groups.json";
import { auth } from "@/app/config/firebaseConfig";

const Page = () => {
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Get current user data
        const user = auth.currentUser;
        if (user) {
            // Extract name from email or use default
            const emailName = user.email ? user.email.split('@')[0] : "Guest";
            setUserName(emailName);
        }
        setLoading(false);
    }, []);

    const handleNotificationPress = () => {
        console.log("Notification button pressed");
        // Implement notification functionality here
    };

    const handleProfilePress = () => {
        router.push("/(tabs)/profile");
    };

    const onCatChanged = (category: string) => {
        console.log("Category changed to: ", category);
        setCategory(category);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
                            <Image
                                source={{ uri: "https://avatars.githubusercontent.com/u/115369622?v=4" }}
                                style={styles.profileImage}
                                // Fallback in case image fails to load
                                onError={() => console.log("Profile image failed to load")}
                            />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
                            <Ionicons name="notifications" size={20} color="black" />
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    {/* Welcome and Location Section */}
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
                        <View style={styles.locationWrapper}>
                            <Ionicons name="location" size={20} color={Colors.primary || "#007bff"} />
                            <Text style={styles.locationText}>Your Location</Text>
                            <TouchableOpacity style={styles.changeLocationButton}>
                                <Ionicons name="chevron-down" size={16} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <TouchableOpacity style={styles.searchBar}>
                        <Ionicons name="search" size={18} color="#666" />
                        <Text style={styles.searchText}>Search destinations, hotels...</Text>
                    </TouchableOpacity>

                    {/* Category Buttons */}
                    <CategoryButtons onCategoryChanged={onCatChanged} />

                    {/* Near Location Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Near Location</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Listings */}
                    <Listings listings={listingData} category={category} />

                    {/* Group Listings */}
                    {/*<View style={styles.sectionContainer}>*/}
                    {/*    <Text style={styles.sectionTitle}>Popular Groups</Text>*/}
                    {/*    <TouchableOpacity>*/}
                    {/*        <Text style={styles.seeAllText}>See all</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                    <GroupListing listings={groupData} />

                    {/* Featured Deals Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Featured Deals</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.featuredDealCard}>
                        <Image
                            source={{ uri: "https://www.hotelescenter.es/wp-content/blogs.dir/1601/files/home//header-home-mb.jpg" }}
                            style={styles.featuredDealImage}
                        />
                        <View style={styles.featuredDealOverlay}>
                            <View style={styles.dealBadge}>
                                <Text style={styles.dealBadgeText}>30% OFF</Text>
                            </View>
                            <Text style={styles.featuredDealTitle}>Weekend Special</Text>
                            <Text style={styles.featuredDealSubtitle}>Book now and save</Text>
                        </View>
                    </View>

                    {/* Extra padding at bottom */}
                    <View style={styles.bottomPadding} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 100, // Space for header
    },
    profileButton: {
        marginLeft: 20,
        backgroundColor: Colors.white,
        padding: 5,
        borderRadius: 20,
        shadowColor: "#171717",
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    notificationButton: {
        marginRight: 20,
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 10,
        shadowColor: "#171717",
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    welcomeContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        color: '#333',
    },
    locationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 4,
        color: '#444',
    },
    changeLocationButton: {
        marginLeft: 4,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    searchText: {
        marginLeft: 10,
        color: '#999',
        fontSize: 15,
    },
    sectionContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    seeAllText: {
        color: Colors.primary || "#007bff",
        fontWeight: '500',
    },
    featuredDealCard: {
        margin: 20,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    featuredDealImage: {
        width: '100%',
        height: 180,
    },
    featuredDealOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    dealBadge: {
        backgroundColor: Colors.primary || "#007bff",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    dealBadgeText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 12,
    },
    featuredDealTitle: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '700',
    },
    featuredDealSubtitle: {
        color: Colors.white,
        fontSize: 14,
    },
    bottomPadding: {
        height: 50,
    }
});