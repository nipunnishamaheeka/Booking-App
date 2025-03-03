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
    SafeAreaView
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {/* Hotel Summary */}
                <View style={styles.hotelSummary}>
                    <Image source={{ uri: image as string }} style={styles.hotelImage} />
                    <View style={styles.hotelInfo}>
                        <Text style={styles.hotelName}>{name}</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={14} color="#666" />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>${price}</Text>
                            <Text style={styles.perNightText}>/night</Text>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Date Selection */}
                <Text style={styles.sectionTitle}>Your Trip</Text>

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

                    <View style={styles.dateDivider} />

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

                {/* Guest Count */}
                <View style={styles.guestContainer}>
                    <Text style={styles.guestLabel}>Guests</Text>
                    <View style={styles.guestInputContainer}>
                        <TextInput
                            style={styles.guestInput}
                            value={guests}
                            onChangeText={setGuests}
                            keyboardType="number-pad"
                            maxLength={2}
                        />
                        <Text style={styles.guestInputLabel}>guest(s)</Text>
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

                {/* Divider */}
                <View style={styles.divider} />

                {/* Personal Information */}
                <Text style={styles.sectionTitle}>Personal Information</Text>

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
                        <TextInput
                            style={styles.textInput}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="johndoe@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.fullInputContainer}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <TextInput
                            style={styles.textInput}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="+1 (555) 123-4567"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Payment Method */}
                <Text style={styles.sectionTitle}>Payment Method</Text>

                <View style={styles.paymentMethodsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.paymentMethod,
                            paymentMethod === "credit" && styles.selectedPaymentMethod,
                        ]}
                        onPress={() => setPaymentMethod("credit")}
                    >
                        <FontAwesome name="credit-card" size={20} color={paymentMethod === "credit" ? "#4B78FF" : "#666"} />
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
                        <FontAwesome name="paypal" size={20} color={paymentMethod === "paypal" ? "#4B78FF" : "#666"} />
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
                        <FontAwesome name="apple" size={20} color={paymentMethod === "apple" ? "#4B78FF" : "#666"} />
                        <Text style={[styles.paymentMethodText, paymentMethod === "apple" && styles.selectedPaymentMethodText]}>
                            Apple Pay
                        </Text>
                        {paymentMethod === "apple" && (
                            <Ionicons name="checkmark-circle" size={20} color="#4B78FF" style={styles.checkmark} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Price Summary */}
                <Text style={styles.sectionTitle}>Price Details</Text>

                <View style={styles.priceSummaryContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>${price} × {nights} nights</Text>
                        <Text style={styles.priceValue}>${totalPrice}</Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Taxes (10%)</Text>
                        <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Service fee</Text>
                        <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Booking Button */}
                <TouchableOpacity
                    style={[styles.bookingButton, isSubmitting && styles.disabledButton]}
                    onPress={handleSubmitBooking}
                    disabled={isSubmitting}
                >
                    <Text style={styles.bookingButtonText}>
                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Booking;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: "white",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    backButton: {
        padding: 5,
    },
    hotelSummary: {
        flexDirection: "row",
        marginTop: 10,
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 10,
        alignItems: "center",
    },
    hotelImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    hotelInfo: {
        marginLeft: 15,
        flex: 1,
    },
    hotelName: {
        fontSize: 16,
        fontWeight: "600",
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    locationText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: 5,
    },
    priceText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4B78FF",
    },
    perNightText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 2,
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },
    dateSelectionContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        overflow: "hidden",
    },
    dateItem: {
        flex: 1,
        padding: 12,
    },
    dateLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 5,
    },
    dateValue: {
        fontSize: 14,
        fontWeight: "500",
    },
    dateDivider: {
        width: 1,
        backgroundColor: "#E0E0E0",
    },
    guestContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        padding: 12,
    },
    guestLabel: {
        fontSize: 14,
        fontWeight: "500",
    },
    guestInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    guestInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 40,
        textAlign: "center",
        fontSize: 14,
    },
    guestInputLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: "#666",
    },
    formContainer: {
        marginBottom: 15,
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
        fontSize: 12,
        color: "#666",
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
    },
    paymentMethodsContainer: {
        marginBottom: 15,
    },
    paymentMethod: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedPaymentMethod: {
        borderColor: "#4B78FF",
        backgroundColor: "rgba(75, 120, 255, 0.05)",
    },
    paymentMethodText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#666",
    },
    selectedPaymentMethodText: {
        color: "#4B78FF",
        fontWeight: "500",
    },
    checkmark: {
        marginLeft: "auto",
    },
    priceSummaryContainer: {
        marginBottom: 15,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    priceLabel: {
        fontSize: 14,
        color: "#666",
    },
    priceValue: {
        fontSize: 14,
        fontWeight: "500",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    totalValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4B78FF",
    },
    bookingButton: {
        backgroundColor: "#4B78FF",
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 30,
    },
    bookingButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    disabledButton: {
        backgroundColor: "#A0A0A0",
    },
});