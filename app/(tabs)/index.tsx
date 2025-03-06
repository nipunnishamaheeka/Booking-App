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
    StatusBar,
    Platform
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
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const Page = () => {
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [showBookingModal, setShowBookingModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Get current user data
        const user = auth.currentUser;
        if (user) {
            // Extract name from email or use display name if available
            const displayName = user.displayName || (user.email ? user.email.split('@')[0] : "Guest");
            setUserName(displayName);
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

    const onCatChanged = (category) => {
        console.log("Category changed to: ", category);
        setCategory(category);
    };

    const handleBookNow = () => {
        setShowBookingModal(true);
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
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
                            <LinearGradient
                                colors={[Colors.primary, Colors.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.profileGradientBorder}
                            >
                                <Image
                                    source={{ uri: "https://avatars.githubusercontent.com/u/115369622?v=4" }}
                                    style={styles.profileImage}
                                    // Fallback in case image fails to load
                                    onError={() => console.log("Profile image failed to load")}
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
                            <Ionicons name="notifications-outline" size={20} color={Colors.dark} />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>3</Text>
                            </View>
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
                            <Ionicons name="location-outline" size={20} color={Colors.primary} />
                            <Text style={styles.locationText}>Your Location</Text>
                            <TouchableOpacity style={styles.changeLocationButton}>
                                <Ionicons name="chevron-down" size={16} color={Colors.gray} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <TouchableOpacity style={styles.searchBar}>
                        <BlurView intensity={50} tint="light" style={styles.searchBlur}>
                            <Ionicons name="search" size={18} color={Colors.gray} />
                            <Text style={styles.searchText}>Search destinations, hotels...</Text>
                        </BlurView>
                    </TouchableOpacity>

                    {/* Category Buttons */}
                    <CategoryButtons onCategoryChanged={onCatChanged} />

                    {/* Near Location Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Near Location</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>See all</Text>
                            <Ionicons name="arrow-forward" size={14} color={Colors.primary} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Listings */}
                    <Listings listings={listingData} category={category} />

                    {/* Travel Groups */}
                    <GroupListing listings={groupData} />

                    {/* Featured Deals Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Featured Deals</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>See all</Text>
                            <Ionicons name="arrow-forward" size={14} color={Colors.primary} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.featuredDealCard}>
                        <Image
                            source={{ uri: "https://www.hotelescenter.es/wp-content/blogs.dir/1601/files/home//header-home-mb.jpg" }}
                            style={styles.featuredDealImage}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.featuredDealOverlay}
                        >
                            <View style={styles.dealBadge}>
                                <LinearGradient
                                    colors={[Colors.secondary, Colors.primary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.badgeGradient}
                                >
                                    <Text style={styles.dealBadgeText}>30% OFF</Text>
                                </LinearGradient>
                            </View>
                            <Text style={styles.featuredDealTitle}>Weekend Special</Text>
                            <Text style={styles.featuredDealSubtitle}>Book now and save</Text>
                            <TouchableOpacity
                                style={styles.viewDealButton}
                                onPress={handleBookNow}
                            >
                                <LinearGradient
                                    colors={[Colors.primary, Colors.secondary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.viewDealGradient}
                                >
                                    <Text style={styles.viewDealButtonText}>Book Now</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    {/* Quick Booking Section */}
                    <View style={styles.quickBookingSection}>
                        <Text style={styles.sectionTitle}>Quick Booking</Text>
                        <View style={styles.bookingCard}>
                            <View style={styles.bookingFormRow}>
                                <View style={styles.bookingField}>
                                    <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                                    <Text style={styles.bookingFieldLabel}>Check In</Text>
                                </View>
                                <View style={styles.bookingField}>
                                    <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                                    <Text style={styles.bookingFieldLabel}>Check Out</Text>
                                </View>
                            </View>
                            <View style={styles.bookingFormRow}>
                                <View style={styles.bookingField}>
                                    <Ionicons name="people-outline" size={20} color={Colors.primary} />
                                    <Text style={styles.bookingFieldLabel}>2 Guests</Text>
                                </View>
                                <View style={styles.bookingField}>
                                    <Ionicons name="bed-outline" size={20} color={Colors.primary} />
                                    <Text style={styles.bookingFieldLabel}>1 Room</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.searchBookingButton} onPress={handleBookNow}>
                                <LinearGradient
                                    colors={[Colors.primary, Colors.secondary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.searchBookingGradient}
                                >
                                    <Text style={styles.searchBookingText}>Search Available Rooms</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Popular Destinations */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Popular Destinations</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>Explore</Text>
                            <Ionicons name="arrow-forward" size={14} color={Colors.primary} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.popularDestinationsContainer}
                    >
                        {['Paris', 'Rome', 'New York', 'Tokyo', 'Bali'].map((city, index) => (
                            <TouchableOpacity key={index} style={styles.popularDestinationCard}>
                                <Image
                                    source={{
                                        uri: `https://source.unsplash.com/featured/?${city.toLowerCase()},landmark`
                                    }}
                                    style={styles.popularDestinationImage}
                                />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.popularDestinationOverlay}
                                >
                                    <Text style={styles.popularDestinationName}>{city}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Extra padding at bottom */}
                    <View style={styles.bottomPadding} />
                </View>
            </ScrollView>

            {/* Modal for booking */}
            {showBookingModal && (
                <View style={styles.modalOverlay}>
                    <BlurView intensity={90} style={styles.modalBlur}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Book Your Stay</Text>
                                <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                                    <Ionicons name="close-circle" size={24} color={Colors.dark} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.bookingDetails}>
                                <Text style={styles.bookingHeading}>Weekend Special Package</Text>
                                <View style={styles.bookingInfo}>
                                    <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                                    <Text style={styles.bookingInfoText}>Fri, Mar 7 - Sun, Mar 9</Text>
                                </View>
                                <View style={styles.bookingInfo}>
                                    <Ionicons name="people-outline" size={18} color={Colors.primary} />
                                    <Text style={styles.bookingInfoText}>2 Guests</Text>
                                </View>
                                <View style={styles.bookingInfo}>
                                    <Ionicons name="bed-outline" size={18} color={Colors.primary} />
                                    <Text style={styles.bookingInfoText}>Deluxe Room</Text>
                                </View>

                                <View style={styles.priceSummary}>
                                    <Text style={styles.priceLabel}>Original Price:</Text>
                                    <Text style={styles.priceValue}>$350</Text>
                                </View>
                                <View style={styles.priceSummary}>
                                    <Text style={styles.priceLabel}>Discount (30%):</Text>
                                    <Text style={styles.discountValue}>-$105</Text>
                                </View>
                                <View style={styles.priceSummary}>
                                    <Text style={styles.totalLabel}>Total:</Text>
                                    <Text style={styles.totalValue}>$245</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.confirmButton}>
                                <LinearGradient
                                    colors={[Colors.primary, Colors.secondary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.confirmGradient}
                                >
                                    <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 100, // Space for header
        paddingBottom: 20,
    },
    profileButton: {
        marginLeft: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    profileGradientBorder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    notificationButton: {
        marginRight: 20,
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 12,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    notificationBadge: {
        position: 'absolute',
        right: 6,
        top: 6,
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    welcomeContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        color: Colors.dark,
    },
    locationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 4,
        color: Colors.gray,
    },
    changeLocationButton: {
        marginLeft: 4,
    },
    searchBar: {
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    searchBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
    },
    searchText: {
        marginLeft: 10,
        color: Colors.gray,
        fontSize: 15,
    },
    sectionContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.dark,
    },
    seeAllButton: {
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    featuredDealCard: {
        margin: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    featuredDealImage: {
        width: '100%',
        height: 200,
    },
    featuredDealOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        height: '70%',
    },
    dealBadge: {
        alignSelf: 'flex-start',
        marginBottom: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    badgeGradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    dealBadgeText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 12,
    },
    featuredDealTitle: {
        color: Colors.white,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    featuredDealSubtitle: {
        color: Colors.white,
        fontSize: 14,
        marginBottom: 12,
    },
    viewDealButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    viewDealGradient: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    viewDealButtonText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 14,
    },
    quickBookingSection: {
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    bookingCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginTop: 10,
    },
    bookingFormRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    bookingField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        width: '48%',
    },
    bookingFieldLabel: {
        marginLeft: 8,
        color: Colors.dark,
        fontSize: 14,
    },
    searchBookingButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    searchBookingGradient: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    searchBookingText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    popularDestinationsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    popularDestinationCard: {
        width: 150,
        height: 200,
        borderRadius: 16,
        marginHorizontal: 8,
        overflow: 'hidden',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    popularDestinationImage: {
        width: '100%',
        height: '100%',
    },
    popularDestinationOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        height: '40%',
    },
    popularDestinationName: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700',
        position: 'absolute',
        bottom: 12,
        left: 12,
    },
    bottomPadding: {
        height: 50,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    modalBlur: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.dark,
    },
    bookingDetails: {
        marginBottom: 20,
    },
    bookingHeading: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark,
        marginBottom: 15,
    },
    bookingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    bookingInfoText: {
        marginLeft: 10,
        fontSize: 16,
        color: Colors.gray,
    },
    priceSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    priceLabel: {
        fontSize: 16,
        color: Colors.gray,
    },
    priceValue: {
        fontSize: 16,
        color: Colors.dark,
        textDecorationLine: 'line-through',
    },
    discountValue: {
        fontSize: 16,
        color: Colors.secondary,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.dark,
        marginTop: 10,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
        marginTop: 10,
    },
    confirmButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    confirmGradient: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
});