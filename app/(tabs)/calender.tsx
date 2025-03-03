import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "@/app/config/firebaseConfig";
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

const Page = () => {
    // Current month state
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState<number[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch bookings from Firestore
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    console.log("User not authenticated");
                    setLoading(false);
                    return;
                }

                const bookingsRef = collection(db, "bookings");
                const q = query(bookingsRef, where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);

                const bookingsData: any[] = [];
                const selectedDaysArray: number[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();

                    // Convert Firestore timestamps to Date objects
                    const checkInDate = data.checkInDate instanceof Date
                        ? data.checkInDate
                        : data.checkInDate.toDate();

                    // Add to bookings array
                    bookingsData.push({
                        id: doc.id,
                        name: data.propertyName,
                        date: checkInDate.toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }),
                        price: data.price.basePrice,
                        image: data.image,
                        checkInDate: checkInDate,
                        location: data.propertyLocation
                    });

                    // If checkInDate is in current month, add to selected dates
                    if (checkInDate.getMonth() === currentMonth.getMonth() &&
                        checkInDate.getFullYear() === currentMonth.getFullYear()) {
                        selectedDaysArray.push(checkInDate.getDate());
                    }
                });

                setBookings(bookingsData);
                setSelectedDates(selectedDaysArray);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [currentMonth]);

    // Get days in month and first day of month for building calendar
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    // Format month name
    const formatMonth = (date: Date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    // Navigate between months
    const navigateMonth = (direction: string) => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
    };

    // Build calendar days
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);

        // Get days from previous month
        const daysInPrevMonth = getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
        const prevMonthDays = Array.from({ length: firstDay }, (_, i) => ({
            day: daysInPrevMonth - firstDay + i + 1,
            month: "prev"
        }));

        // Current month days
        const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            month: "current",
            selected: selectedDates.includes(i + 1)
        }));

        // Calculate how many next month days we need
        const totalDaysShown = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        const nextMonthDays = Array.from({ length: totalDaysShown - (prevMonthDays.length + currentMonthDays.length) }, (_, i) => ({
            day: i + 1,
            month: "next"
        }));

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    };

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const calendarDays = renderCalendar();

    // Navigate to booking details

    const viewBookingDetails = (bookingId: string | undefined) => {
        if (!bookingId) {
            console.error("Error: Booking ID is undefined!");
            return;
        }

        router.push(`/listing/booking-details/${bookingId}`);


    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                />
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Schedule</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Calendar Section */}
                <View style={styles.calendarContainer}>
                    <View style={styles.monthSelector}>
                        <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
                        <View style={styles.monthNavigation}>
                            <TouchableOpacity onPress={() => navigateMonth('prev')}>
                                <Ionicons name="chevron-back" size={24} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigateMonth('next')}>
                                <Ionicons name="chevron-forward" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Days of Week Header */}
                    <View style={styles.daysHeader}>
                        {daysOfWeek.map((day, index) => (
                            <View key={index} style={styles.dayHeaderCell}>
                                <Text style={styles.dayHeaderText}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Calendar Grid */}
                    <View style={styles.calendarGrid}>
                        {calendarDays.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayCell,
                                    day.month !== "current" && styles.dayOtherMonth,
                                    day.selected && styles.daySelected
                                ]}
                                disabled={true} // Disable since we're just displaying bookings
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        day.month !== "current" && styles.dayTextOtherMonth,
                                        day.selected && styles.dayTextSelected
                                    ]}
                                >
                                    {day.day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* My Schedule Section */}
                <View style={styles.scheduleContainer}>
                    <View style={styles.scheduleHeader}>
                        <Text style={styles.scheduleTitle}>My Schedule</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bookings List */}
                    <View style={styles.bookingsList}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#4254ff" />
                                <Text style={styles.loadingText}>Loading bookings...</Text>
                            </View>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <TouchableOpacity
                                    key={booking.id}
                                    style={styles.bookingCard}
                                    onPress={() => viewBookingDetails(booking.id)}
                                >
                                    <Image source={{ uri: booking.image }} style={styles.bookingImage} />
                                    <View style={styles.bookingInfo}>
                                        <Text style={styles.bookingName}>{booking.name}</Text>
                                        <View style={styles.bookingLocationRow}>
                                            <Ionicons name="location-outline" size={16} color="#888" />
                                            <Text style={styles.locationText}>{booking.location}</Text>
                                        </View>
                                        <View style={styles.bookingDate}>
                                            <Ionicons name="calendar-outline" size={16} color="#888" />
                                            <Text style={styles.dateText}>{booking.date}</Text>
                                        </View>
                                        <Text style={styles.bookingPrice}>${booking.price.toFixed(1)}<Text style={styles.nightText}>/night</Text></Text>
                                    </View>
                                    <View style={styles.chevronContainer}>
                                        <Ionicons name="chevron-forward" size={24} color="#888" />
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.noBookingsContainer}>
                                <Ionicons name="calendar" size={48} color="#ccc" />
                                <Text style={styles.noBookingsText}>No bookings found</Text>
                                <Text style={styles.noBookingsSubtext}>Your upcoming bookings will appear here</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;

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
    settingsButton: {
        padding: 8
    },
    calendarContainer: {
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderRadius: 8
    },
    monthSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16
    },
    monthText: {
        fontSize: 16,
        fontWeight: "600"
    },
    monthNavigation: {
        flexDirection: "row",
        alignItems: "center"
    },
    daysHeader: {
        flexDirection: "row",
        marginBottom: 8
    },
    dayHeaderCell: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8
    },
    dayHeaderText: {
        fontSize: 14,
        fontWeight: "500"
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    dayCell: {
        width: "14.28%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 2
    },
    dayText: {
        fontSize: 14,
        fontWeight: "500"
    },
    dayOtherMonth: {
        opacity: 0.5
    },
    dayTextOtherMonth: {
        color: "#aaa"
    },
    daySelected: {
        backgroundColor: "#4254ff",
        borderRadius: 20
    },
    dayTextSelected: {
        color: "white"
    },
    scheduleContainer: {
        padding: 16
    },
    scheduleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    scheduleTitle: {
        fontSize: 18,
        fontWeight: "600"
    },
    seeAllText: {
        color: "#4254ff",
        fontWeight: "500"
    },
    bookingsList: {
        gap: 16
    },
    bookingCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        padding: 8,
        marginBottom: 16
    },
    bookingImage: {
        width: 80,
        height: 80,
        borderRadius: 8
    },
    bookingInfo: {
        flex: 1,
        paddingHorizontal: 12,
        justifyContent: "center"
    },
    bookingName: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4
    },
    bookingLocationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4
    },
    locationText: {
        fontSize: 14,
        color: "#888",
        marginLeft: 4
    },
    bookingDate: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4
    },
    dateText: {
        fontSize: 14,
        color: "#888",
        marginLeft: 4
    },
    bookingPrice: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4254ff"
    },
    nightText: {
        fontSize: 14,
        fontWeight: "normal",
        color: "#888"
    },
    chevronContainer: {
        paddingHorizontal: 12
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#888"
    },
    noBookingsContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30
    },
    noBookingsText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "500"
    },
    noBookingsSubtext: {
        marginTop: 4,
        fontSize: 14,
        color: "#888",
        textAlign: "center"
    }
});