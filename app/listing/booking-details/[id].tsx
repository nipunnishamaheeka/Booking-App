import React, {useEffect, useState} from "react";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    StyleSheet
} from "react-native";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {Ionicons} from "@expo/vector-icons";

import {initializeApp} from "firebase/app";
import {firebaseConfig} from "@/app/config/firebaseConfig";


// Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBuHsMLlZa1bvuKXNMePVLvvj6aGJlyIlk",
//     authDomain: "booking-react-1c2a2.firebaseapp.com",
//     projectId: "booking-react-1c2a2",
//     storageBucket: "booking-react-1c2a2.firebasestorage.app",
//     messagingSenderId: "1085004540368",
//     appId: "1:1085004540368:web:a639cc50953d50c7ca31d5",
//     measurementId: "G-R7DVS74VHP"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BookingDetails = () => {
    const { id } = useLocalSearchParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                if (!id || typeof id !== 'string') {
                    console.error("Invalid booking ID");
                    setLoading(false);
                    return;
                }

                const bookingRef = doc(db, "bookings", id);
                const bookingSnap = await getDoc(bookingRef);

                if (bookingSnap.exists()) {
                    const data = bookingSnap.data();

                    const checkInDate = data.checkInDate?.toDate?.() || new Date();
                    const checkOutDate = data.checkOutDate?.toDate?.() || new Date();

                    // Ensure price structure is valid
                    const price = {
                        basePrice: data.price?.basePrice ?? 0,
                        cleaningFee: data.price?.cleaningFee ?? 0,
                        serviceFee: data.price?.serviceFee ?? 0
                    };

                    setBooking({
                        id: bookingSnap.id,
                        propertyName: data.propertyName || "Unknown Property",
                        propertyLocation: data.propertyLocation || "Unknown Location",
                        checkInDate,
                        checkOutDate,
                        price,
                        image: "https://www.hotelscombined.com/rimg/himg/7f/61/7a/expediav2-601348-adb170-787981.jpg?width=968&height=607&crop=true",
                        hostName: data.hostName || "Property Host",
                        guests: data.guests || 1,
                        formattedCheckIn: checkInDate.toLocaleDateString('en-US', {
                            weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
                        }),
                        formattedCheckOut: checkOutDate.toLocaleDateString('en-US', {
                            weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
                        }),
                        nights: Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
                    });
                } else {
                    console.log("No such booking!");
                    setBooking(null);
                }
            } catch (error) {
                console.error("Error fetching booking details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [id]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Booking Details</Text>
                    <TouchableOpacity style={styles.shareButton}>
                        <Ionicons name="share-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4254ff" />
                        <Text style={styles.loadingText}>Loading booking details...</Text>
                    </View>
                ) : booking ? (
                    <>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: booking.image }} style={styles.propertyImage} />
                        </View>

                        <View style={styles.detailsContainer}>
                            <Text style={styles.propertyName}>{booking.propertyName}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={18} color="#888" />
                                <Text style={styles.locationText}>{booking.propertyLocation}</Text>
                            </View>

                            <View style={styles.bookingInfoCard}>
                                <Text style={styles.bookingInfoTitle}>Your booking details</Text>

                                <View style={styles.bookingInfoRow}>
                                    <Text style={styles.infoLabelText}>Check-in:</Text>
                                    <Text style={styles.infoValueText}>{booking.formattedCheckIn}</Text>
                                </View>

                                <View style={styles.bookingInfoRow}>
                                    <Text style={styles.infoLabelText}>Check-out:</Text>
                                    <Text style={styles.infoValueText}>{booking.formattedCheckOut}</Text>
                                </View>

                                <View style={styles.bookingInfoRow}>
                                    <Text style={styles.infoLabelText}>Guests:</Text>
                                    <Text style={styles.infoValueText}>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</Text>
                                </View>
                            </View>

                            <View style={styles.priceSummaryCard}>
                                <Text style={styles.priceSummaryTitle}>Price details</Text>

                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>${booking.price.basePrice.toFixed(1)} x {booking.nights} night{booking.nights > 1 ? 's' : ''}</Text>
                                    <Text style={styles.priceValue}>${(booking.price.basePrice * booking.nights).toFixed(1)}</Text>
                                </View>

                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Cleaning fee</Text>
                                    <Text style={styles.priceValue}>${booking.price.cleaningFee.toFixed(1)}</Text>
                                </View>

                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Service fee</Text>
                                    <Text style={styles.priceValue}>${booking.price.serviceFee.toFixed(1)}</Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>${(
                                        (booking.price.basePrice * booking.nights) +
                                        booking.price.cleaningFee +
                                        booking.price.serviceFee
                                    ).toFixed(1)}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={60} color="#ff4242" />
                        <Text style={styles.errorTitle}>Booking Not Found</Text>
                        <Text style={styles.errorMessage}>The booking may have been canceled or deleted.</Text>
                        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
                            <Text style={styles.goBackButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default BookingDetails;


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    scrollView: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    backButton: {
        padding: 8
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600"
    },
    shareButton: {
        padding: 8
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#888"
    },
    imageContainer: {
        width: "100%",
        height: 220,
        overflow: "hidden"
    },
    propertyImage: {
        width: "100%",
        height: "100%"
    },
    detailsContainer: {
        padding: 16
    },
    propertyName: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 8
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16
    },
    locationText: {
        fontSize: 16,
        color: "#666",
        marginLeft: 6
    },
    hostContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
        padding: 16,
        backgroundColor: "#f8f8f8",
        borderRadius: 12
    },
    hostAvatarContainer: {
        marginRight: 12
    },
    hostInfo: {
        flex: 1
    },
    hostedByText: {
        fontSize: 14,
        color: "#888"
    },
    hostName: {
        fontSize: 18,
        fontWeight: "500"
    },
    bookingInfoCard: {
        backgroundColor: "#f8f8f8",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
    },
    bookingInfoTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16
    },
    bookingInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14
    },
    bookingInfoLabel: {
        flexDirection: "row",
        alignItems: "center"
    },
    infoLabelText: {
        fontSize: 16,
        marginLeft: 8
    },
    infoValueText: {
        fontSize: 16,
        fontWeight: "500"
    },
    priceSummaryCard: {
        backgroundColor: "#f8f8f8",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
    },
    priceSummaryTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    priceLabel: {
        fontSize: 16,
        color: "#555"
    },
    priceValue: {
        fontSize: 16,
        fontWeight: "500"
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 12
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "600"
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "600",
        color: "#4254ff"
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 8
    },
    cancelButtonText: {
        fontWeight: "600",
        color: "#ff4242"
    },
    modifyButton: {
        flex: 1,
        backgroundColor: "#4254ff",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 8
    },
    modifyButtonText: {
        fontWeight: "600",
        color: "white"
    },
    errorContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        marginTop: 50
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8
    },
    errorMessage: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 24
    },
    goBackButton: {
        backgroundColor: "#4254ff",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8
    },
    goBackButtonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16
    }
});