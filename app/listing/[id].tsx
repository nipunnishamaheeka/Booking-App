import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { ListingType } from "@/types/listingType";
import listingData from "@/data/destinations.json";

const ListingDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const listing: ListingType = (listingData as ListingType[]).find(
        (item) => item.id === id
    );

    // Function to handle booking button press
    const handleBooking = () => {
        // Navigate to booking page with listing details
        router.push({
            pathname: "/booking",
            params: {
                id: listing.id,
                name: listing.name,
                price: listing.price,
                image: listing.image,
                location: listing.location
            }
        });
    };

    return (
        <View style={styles.container}>
            {/* Custom Stack navigation */}
            <Stack.Screen
                options={{
                    // Hide the default header
                    headerShown: false,
                }}
            />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Main Image */}
                <View style={styles.mainImageContainer}>
                    <Image
                        source={{ uri: listing.image }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heartContainer}>
                        <Ionicons name="heart" size={24} color="red" />
                    </View>
                </View>

                {/* Amenities */}
                <View style={styles.amenitiesContainer}>
                    <View style={styles.amenityItem}>
                        <Ionicons name="wifi" size={18} color="black" />
                        <Text style={styles.amenityText}>Free Wifi</Text>
                    </View>
                    <View style={styles.amenityItem}>
                        <Ionicons name="restaurant" size={18} color="black" />
                        <Text style={styles.amenityText}>Free Breakfast</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <FontAwesome name="star" size={18} color="#FFD700" />
                        <Text style={styles.ratingText}>{listing.rating}</Text>
                    </View>
                </View>

                {/* Hotel Info */}
                <View style={styles.hotelInfoContainer}>
                    <Text style={styles.hotelName}>{listing.name}</Text>
                    <Text style={styles.hotelPrice}>${listing.price}<Text style={styles.nightText}>/night</Text></Text>
                </View>

                {/* Location */}
                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={18} color="#4B78FF" />
                    <Text style={styles.locationText}>{listing.location}</Text>
                </View>

                {/* Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{listing.description}
                        <Text style={styles.readMoreText}> Read More...</Text>
                    </Text>
                </View>

                {/* Preview Images */}
                <View style={styles.previewContainer}>
                    <Text style={styles.sectionTitle}>Preview</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
                        <Image source={{ uri: listing.previewImage1}} style={styles.previewImage} />
                        <Image source={{ uri: listing.previewImage2}} style={styles.previewImage} />
                        <Image source={{ uri: listing.previewImage3}} style={styles.previewImage} />
                    </ScrollView>
                </View>

                {/* Booking Button */}
                <TouchableOpacity onPress={handleBooking} style={styles.bookingButton}>
                    <Text style={styles.bookingButtonText}>Booking Now</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ListingDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 50, // Add padding to push content below status bar
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "white",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    backButton: {
        padding: 5,
    },
    menuButton: {
        padding: 5,
    },
    mainImageContainer: {
        padding: 10,
        position: "relative",
        width: "100%",
        height: 250,
    },
    mainImage: {
        width: "100%",
        height: "100%",
        borderRadius: 15,
    },
    heartContainer: {
        position: "absolute",
        top: 25,
        right: 25,
        backgroundColor: "white",
        borderRadius: 50,
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    amenitiesContainer: {
        flexDirection: "row",
        marginTop: 15,
        marginHorizontal: 15,
        alignItems: "center",
    },
    amenityItem: {
        borderRadius: 10,
        padding: 8,
        backgroundColor: "#F5F5F5",
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
    },
    amenityText: {
        marginLeft: 6,
        fontSize: 14,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto",
    },
    ratingText: {
        marginLeft: 4,
        fontWeight: "bold",
        fontSize: 14,
    },
    hotelInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
        marginTop: 15,
    },
    hotelName: {
        fontSize: 20,
        fontWeight: "bold",
    },
    hotelPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4B78FF",
    },
    nightText: {
        fontSize: 14,
        fontWeight: "normal",
        color: "#666",
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 15,
        marginTop: 6,
    },
    locationText: {
        marginLeft: 4,
        color: "#666",
        fontSize: 14,
    },
    descriptionContainer: {
        marginHorizontal: 15,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    readMoreText: {
        color: "#4B78FF",
        fontWeight: "500",
    },
    previewContainer: {
        marginHorizontal: 15,
        marginTop: 20,
    },
    previewScroll: {
        flexDirection: "row",
        marginTop: 5,
    },
    previewImage: {
        width: 100,
        height: 70,
        borderRadius: 10,
        marginRight: 10,
    },
    bookingButton: {
        backgroundColor: "#4B78FF",
        marginHorizontal: 15,
        marginVertical: 25,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
    },
    bookingButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});