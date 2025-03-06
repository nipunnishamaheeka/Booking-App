import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Alert,
    SafeAreaView,
    StatusBar
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { firebaseConfig } from "@/app/config/firebaseConfig";
import Colors from "@/constants/Colors";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Booking = () => {
    const params = useLocalSearchParams();
    const router = useRouter();

    // Extract listing information from params
    const { id, name, price, image, location } = params;

    // State for booking details
    const [checkIn, setCheckIn] = useState(new Date());
    const [checkOut, setCheckOut] = useState(new Date(new Date().setDate(new Date().getDate() + 2)));
    const [guests, setGuests] = useState("2");
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [showCheckOut, setShowCheckOut] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate nights and total price
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * Number(price);
    const tax = totalPrice * 0.1;
    const serviceFee = totalPrice * 0.05;
    const grandTotal = totalPrice + tax + serviceFee;

    // Date change handlers
    const onCheckInChange = (event: any, selectedDate?: Date) => {
        setShowCheckIn(false);
        if (selectedDate) {
            setCheckIn(selectedDate);
            // Ensure checkout is after checkin
            if (selectedDate > checkOut) {
                const newCheckOut = new Date(selectedDate);
                newCheckOut.setDate(selectedDate.getDate() + 1);
                setCheckOut(newCheckOut);
            }
        }
    };

    const onCheckOutChange = (event: any, selectedDate?: Date) => {
        setShowCheckOut(false);
        if (selectedDate && selectedDate > checkIn) {
            setCheckOut(selectedDate);
        } else if (selectedDate) {
            Alert.alert("Invalid Date", "Check-out date must be after check-in date");
        }
    };

    // Save booking to Firestore
    const saveBookingToFirestore = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User is not authenticated. Please log in.");
            }

            const bookingsCollection = collection(db, "bookings");

            const bookingData = {
                userId: user.uid,  // Store user's ID
                propertyId: id,
                propertyName: name,
                propertyLocation: location,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                nights: nights,
                guests: parseInt(guests),
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                paymentMethod: paymentMethod,
                price: {
                    basePrice: Number(price),
                    totalPrice: totalPrice,
                    tax: tax,
                    serviceFee: serviceFee,
                    grandTotal: grandTotal
                },
                status: "confirmed",
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(bookingsCollection, bookingData);
            return docRef.id;
        } catch (error) {
            console.error("Error saving booking: ", error);
            throw error;
        }
    };

    // Submit booking
    const handleSubmitBooking = async () => {
        // Validation
        if (!firstName || !lastName || !email || !phone) {
            Alert.alert("Missing Information", "Please fill in all required fields");
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        try {
            // Save booking to Firestore
            const bookingId = await saveBookingToFirestore();

            // Show success message
            Alert.alert(
                "Booking Confirmed!",
                `Your booking at ${name} for ${nights} nights has been confirmed. Booking ID: ${bookingId}. You will receive a confirmation email shortly.`,
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/"),
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                "Booking Failed",
                "There was an error processing your booking. Please try again."
            );
            console.error("Booking error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format price to show with commas for thousands
    const formatPrice = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            <StatusBar barStyle="light-content" backgroundColor={Colors.primary}/>

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Custom Header */}
            <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Complete Your Booking</Text>
                    <View style={{ width: 24 }} />
                </View>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Property Card */}
                <View style={styles.propertyCard}>
                    <Image source={{ uri: image as string }} style={styles.hotelImage} />

                    <View style={styles.hotelInfo}>
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={12} color="white" />
                            <Text style={styles.ratingText}>4.9</Text>
                        </View>

                        <Text style={styles.hotelName}>{name}</Text>

                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={16} color="#666" />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>

                        <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>${price}</Text>
                            <Text style={styles.perNightText}>/ night</Text>
                        </View>
                    </View>
                </View>

                {/* Trip Details Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="calendar-outline" size={20} color="#4B78FF" />
                        <Text style={styles.sectionTitle}>Your Trip</Text>
                    </View>

                    <View style={styles.dateSelectionContainer}>
                        <TouchableOpacity
                            style={styles.dateItem}
                            onPress={() => setShowCheckIn(true)}
                        >
                            <Text style={styles.dateLabel}>Check-in</Text>
                            <Text style={styles.dateValue}>
                                {checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.datesArrow}>
                            <Ionicons name="arrow-forward" size={16} color="#4B78FF" />
                        </View>

                        <TouchableOpacity
                            style={styles.dateItem}
                            onPress={() => setShowCheckOut(true)}
                        >
                            <Text style={styles.dateLabel}>Check-out</Text>
                            <Text style={styles.dateValue}>
                                {checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tripSummary}>
                        <View style={styles.tripDetail}>
                            <Ionicons name="time-outline" size={16} color="#666" />
                            <Text style={styles.tripDetailText}>{nights} night stay</Text>
                        </View>

                        <View style={styles.tripDetail}>
                            <Ionicons name="people-outline" size={16} color="#666" />
                            <View style={styles.guestInputContainer}>
                                <Text style={styles.tripDetailText}>Guests</Text>
                                <View style={styles.guestControls}>
                                    <TextInput
                                        style={styles.guestInput}
                                        value={guests}
                                        onChangeText={setGuests}
                                        keyboardType="number-pad"
                                        maxLength={2}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* DateTimePickers (hidden) */}
                    {showCheckIn && (
                        <DateTimePicker
                            value={checkIn}
                            mode="date"
                            display="default"
                            onChange={onCheckInChange}
                            minimumDate={new Date()}
                        />
                    )}

                    {showCheckOut && (
                        <DateTimePicker
                            value={checkOut}
                            mode="date"
                            display="default"
                            onChange={onCheckOutChange}
                            minimumDate={new Date(checkIn.getTime() + 86400000)} // +1 day from check-in
                        />
                    )}
                </View>

                {/* Personal Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-outline" size={20} color="#4B78FF" />
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.nameInputsRow}>
                            <View style={styles.halfInputContainer}>
                                <Text style={styles.inputLabel}>First Name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="John"
                                />
                            </View>

                            <View style={styles.halfInputContainer}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Doe"
                                />
                            </View>
                        </View>

                        <View style={styles.fullInputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInputWithIcon}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="johndoe@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.fullInputContainer}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="call-outline" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInputWithIcon}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="+1 (555) 123-4567"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Method Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="wallet-outline" size={20} color="#4B78FF" />
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>

                    <View style={styles.paymentMethodsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.paymentMethod,
                                paymentMethod === "credit" && styles.selectedPaymentMethod,
                            ]}
                            onPress={() => setPaymentMethod("credit")}
                        >
                            <View style={[styles.paymentIconContainer, paymentMethod === "credit" && styles.selectedPaymentIconContainer]}>
                                <FontAwesome name="credit-card" size={18} color={paymentMethod === "credit" ? "#FFF" : "#4B78FF"} />
                            </View>
                            <Text style={[styles.paymentMethodText, paymentMethod === "credit" && styles.selectedPaymentMethodText]}>
                                Credit Card
                            </Text>
                            {paymentMethod === "credit" && (
                                <Ionicons name="checkmark-circle" size={20} color="#4B78FF" style={styles.checkmark} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.paymentMethod,
                                paymentMethod === "paypal" && styles.selectedPaymentMethod,
                            ]}
                            onPress={() => setPaymentMethod("paypal")}
                        >
                            <View style={[styles.paymentIconContainer, paymentMethod === "paypal" && styles.selectedPaymentIconContainer]}>
                                <FontAwesome name="paypal" size={18} color={paymentMethod === "paypal" ? "#FFF" : "#4B78FF"} />
                            </View>
                            <Text style={[styles.paymentMethodText, paymentMethod === "paypal" && styles.selectedPaymentMethodText]}>
                                PayPal
                            </Text>
                            {paymentMethod === "paypal" && (
                                <Ionicons name="checkmark-circle" size={20} color="#4B78FF" style={styles.checkmark} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.paymentMethod,
                                paymentMethod === "apple" && styles.selectedPaymentMethod,
                            ]}
                            onPress={() => setPaymentMethod("apple")}
                        >
                            <View style={[styles.paymentIconContainer, paymentMethod === "apple" && styles.selectedPaymentIconContainer]}>
                                <FontAwesome name="apple" size={18} color={paymentMethod === "apple" ? "#FFF" : "#4B78FF"} />
                            </View>
                            <Text style={[styles.paymentMethodText, paymentMethod === "apple" && styles.selectedPaymentMethodText]}>
                                Apple Pay
                            </Text>
                            {paymentMethod === "apple" && (
                                <Ionicons name="checkmark-circle" size={20} color="#4B78FF" style={styles.checkmark} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Price Summary Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="receipt-outline" size={20} color="#4B78FF" />
                        <Text style={styles.sectionTitle}>Price Details</Text>
                    </View>

                    <View style={styles.priceSummaryContainer}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>${price} × {nights} nights</Text>
                            <Text style={styles.priceValue}>${formatPrice(totalPrice)}</Text>
                        </View>

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Taxes (10%)</Text>
                            <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
                        </View>

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Service fee</Text>
                            <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
                        </View>

                        <View style={styles.totalDivider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${formatPrice(grandTotal.toFixed(2))}</Text>
                        </View>
                    </View>
                </View>

                {/* Booking Button */}
                <TouchableOpacity
                    style={[styles.bookingButton, isSubmitting && styles.disabledButton]}
                    onPress={handleSubmitBooking}
                    disabled={isSubmitting}
                >
                    <LinearGradient
                        colors={["#4B78FF", "#7165E3"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.bookingButtonText}>
                            {isSubmitting ? "Processing..." : "Confirm Booking"}
                        </Text>
                        {!isSubmitting && (
                            <Ionicons name="chevron-forward" size={20} color="white" />
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Booking;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F9FB",
    },
    container: {
        flex: 1,
        marginTop: 120,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,


    },
    headerGradient: {
        paddingTop: 50,

        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 170,
        zIndex: -1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
    },
    backButton: {
        padding: 5,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    propertyCard: {
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    hotelImage: {
        width: "100%",
        height: 180,
    },
    ratingBadge: {
        position: "absolute",
        top: 15,
        right: 15,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    ratingText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 3,
    },
    hotelInfo: {
        padding: 15,
    },
    hotelName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222",
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    locationText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 6,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    priceText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4B78FF",
    },
    perNightText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#222",
        marginLeft: 8,
    },
    dateSelectionContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EEE",
        borderRadius: 12,
        backgroundColor: "#F8F9FB",
    },
    dateItem: {
        flex: 1,
        padding: 15,
    },
    datesArrow: {
        padding: 6,
        backgroundColor: "#EFF3FF",
        borderRadius: 12,
    },
    dateLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 5,
    },
    dateValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
    },
    tripSummary: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#EEE",
    },
    tripDetail: {
        flexDirection: "row",
        alignItems: "center",
    },
    tripDetailText: {
        marginLeft: 6,
        fontSize: 14,
        color: "#444",
    },
    guestInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    guestControls: {
        marginLeft: 15,
    },
    guestInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        width: 40,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "600",
        backgroundColor: "white",
    },
    formContainer: {
        marginBottom: 5,
    },
    nameInputsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfInputContainer: {
        width: "48%",
        marginBottom: 15,
    },
    fullInputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
        fontWeight: "500",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        backgroundColor: "#F8F9FB",
    },
    inputWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: "#F8F9FB",
    },
    inputIcon: {
        marginRight: 10,
    },
    textInputWithIcon: {
        flex: 1,
        padding: 12,
        fontSize: 15,
    },
    paymentMethodsContainer: {
        marginBottom: 5,
    },
    paymentMethod: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: "#F8F9FB",
    },
    paymentIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#EFF3FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    selectedPaymentIconContainer: {
        backgroundColor: "#4B78FF",
    },
    selectedPaymentMethod: {
        borderColor: "#4B78FF",
        backgroundColor: "#EFF3FF",
    },
    paymentMethodText: {
        fontSize: 15,
        color: "#444",
        fontWeight: "500",
    },
    selectedPaymentMethodText: {
        color: "#4B78FF",
        fontWeight: "600",
    },
    checkmark: {
        marginLeft: "auto",
    },
    priceSummaryContainer: {
        marginBottom: 5,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    priceLabel: {
        fontSize: 15,
        color: "#666",
    },
    priceValue: {
        fontSize: 15,
        fontWeight: "500",
        color: "#444",
    },
    totalDivider: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 15,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#222",
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4B78FF",
    },
    bookingButton: {
        marginTop: 10,
        marginBottom: 30,
        overflow: "hidden",
        borderRadius: 16,
        shadowColor: "#4B78FF",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    gradientButton: {
        paddingVertical: 18,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    bookingButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginRight: 8,
    },
    disabledButton: {
        opacity: 0.7,
    },
});