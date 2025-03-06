import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { LinearGradient } from "expo-linear-gradient";
import {firebaseConfig} from "@/app/config/firebaseConfig";

// Get screen dimensions for responsive design
const { width } = Dimensions.get("window");

// Modern color scheme
const Colors = {
    primary: "#4E56F6", // Modern vibrant blue
    primaryLight: "#E5E6FF",
    primaryDark: "#3941C3",
    secondary: "#FF6584", // Vibrant pink/coral
    secondaryLight: "#FFE4EB",
    accent: "#FFD166", // Warm accent
    background: "#FFFFFF",
    card: "#F8F9FF",
    dark: "#1A1C4A", // Deep blue/almost black
    gray: "#8A8EB8",
    lightGray: "#F1F3FA",
    white: "#FFFFFF",
    shadow: "#1A1C4A",
    success: "#2BD999",
    error: "#FF6584",
    gradientStart: "#4E56F6",
    gradientEnd: "#3941C3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Page = () => {
    // Current month state
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState([]);
    const [bookings, setBookings] = useState([]);
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

                const bookingsData = [];
                const selectedDaysArray = [];

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
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    // Format month name
    const formatMonth = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    // Navigate between months
    const navigateMonth = (direction) => {
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
    const viewBookingDetails = (bookingId) => {
        if (!bookingId) {
            console.error("Error: Booking ID is undefined!");
            return;
        }
        router.push(`/listing/booking-details/${bookingId}`);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

            {/* Gradient Header Background */}
            <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={22} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Schedule</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={22} color={Colors.white} />
                    </TouchableOpacity>
                </View>

                {/* Calendar Card */}
                <View style={styles.calendarContainer}>
                    <View style={styles.monthSelector}>
                        <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
                        <View style={styles.monthNavigation}>
                            <TouchableOpacity style={styles.monthNavButton} onPress={() => navigateMonth('prev')}>
                                <Ionicons name="chevron-back" size={22} color={Colors.dark} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.monthNavButton} onPress={() => navigateMonth('next')}>
                                <Ionicons name="chevron-forward" size={22} color={Colors.dark} />
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
                                ]}
                                disabled={true}
                            >
                                {day.selected ? (
                                    <LinearGradient
                                        colors={[Colors.primary, Colors.primaryDark]}
                                        style={styles.daySelectedGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={styles.dayTextSelected}>{day.day}</Text>
                                    </LinearGradient>
                                ) : (
                                    <Text
                                        style={[
                                            styles.dayText,
                                            day.month !== "current" && styles.dayTextOtherMonth,
                                        ]}
                                    >
                                        {day.day}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Booking Stats Section */}
                <View style={styles.statsContainer}>
                    <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.statItem}
                    >
                        <View style={[styles.statIcon, {backgroundColor: 'rgba(255,255,255,0.2)'}]}>
                            <Ionicons name="calendar-outline" size={24} color={Colors.white} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statValue}>{bookings.length}</Text>
                            <Text style={styles.statLabel}>Bookings</Text>
                        </View>
                    </LinearGradient>

                    <LinearGradient
                        colors={[Colors.secondary, '#FF4D74']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.statItem}
                    >
                        <View style={[styles.statIcon, {backgroundColor: 'rgba(255,255,255,0.2)'}]}>
                            <Ionicons name="bed-outline" size={24} color={Colors.white} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statValue}>{bookings.length > 0 ? bookings.length * 3 : 0}</Text>
                            <Text style={styles.statLabel}>Nights</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* My Bookings Section */}
                <View style={styles.scheduleContainer}>
                    <View style={styles.scheduleHeader}>
                        <Text style={styles.scheduleTitle}>Upcoming Trips</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bookings List */}
                    <View style={styles.bookingsList}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                                <Text style={styles.loadingText}>Loading bookings...</Text>
                            </View>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <TouchableOpacity
                                    key={booking.id}
                                    style={styles.bookingCard}
                                    onPress={() => viewBookingDetails(booking.id)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.bookingImageContainer}>
                                        <Image source={{ uri: booking.image }} style={styles.bookingImage} />
                                        <View style={styles.bookingPriceTag}>
                                            <Text style={styles.bookingPriceText}>${booking.price.toFixed(0)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.bookingInfo}>
                                        <Text style={styles.bookingName} numberOfLines={1}>{booking.name}</Text>
                                        <View style={styles.bookingLocationRow}>
                                            <Ionicons name="location-outline" size={16} color={Colors.gray} />
                                            <Text style={styles.locationText} numberOfLines={1}>{booking.location}</Text>
                                        </View>
                                        <View style={styles.bookingDate}>
                                            <Ionicons name="calendar-outline" size={16} color={Colors.gray} />
                                            <Text style={styles.dateText}>{booking.date}</Text>
                                        </View>
                                        <View style={styles.bookingActions}>
                                            <TouchableOpacity style={styles.bookingViewButton}>
                                                <Text style={styles.bookingViewButtonText}>View Details</Text>
                                                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.noBookingsContainer}>
                                <LinearGradient
                                    colors={[Colors.primaryLight, '#F5F6FF']}
                                    style={styles.emptyStateIcon}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Ionicons name="calendar-outline" size={48} color={Colors.primary} />
                                </LinearGradient>
                                <Text style={styles.noBookingsText}>No trips planned yet</Text>
                                <Text style={styles.noBookingsSubtext}>Your upcoming bookings will appear here</Text>
                                <TouchableOpacity activeOpacity={0.8}>
                                    <LinearGradient
                                        colors={[Colors.primary, Colors.primaryDark]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.exploreTripButton}
                                    >
                                        <Text style={styles.exploreTripButtonText}>Explore destinations</Text>
                                        <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                                    </LinearGradient>
                                </TouchableOpacity>
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
        backgroundColor: Colors.background
    },
    scrollView: {
        flex: 1,
    },
    headerGradient: {
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
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.white,
    },
    settingsButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    calendarContainer: {
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 20,
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 24,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 5,
    },
    monthSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 16,
    },
    monthText: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.dark,
    },
    monthNavigation: {
        flexDirection: "row",
        alignItems: "center",
    },
    monthNavButton: {
        padding: 8,
        borderRadius: 12,
        marginLeft: 8,
        backgroundColor: Colors.lightGray,
    },
    daysHeader: {
        flexDirection: "row",
        marginBottom: 12,
    },
    dayHeaderCell: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    dayHeaderText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.gray,
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        width: "14.28%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    dayText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.dark,
    },
    dayOtherMonth: {
        opacity: 0.4,
    },
    dayTextOtherMonth: {
        color: Colors.gray,
    },
    daySelectedGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayTextSelected: {
        color: Colors.white,
        fontWeight: "600",
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 6,
        padding: 16,
        borderRadius: 20,
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    statContent: {
        justifyContent: "center",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.white,
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    scheduleContainer: {
        padding: 16,
        marginTop: 8,
    },
    scheduleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    scheduleTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.dark,
    },
    seeAllButton: {
        padding: 8,
    },
    seeAllText: {
        color: Colors.primary,
        fontWeight: "600",
    },
    bookingsList: {
        marginTop: 8,
    },
    bookingCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 3,
    },
    bookingImageContainer: {
        position: 'relative',
    },
    bookingImage: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bookingPriceTag: {
        position: 'absolute',
        right: 12,
        top: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    bookingPriceText: {
        color: Colors.white,
        fontWeight: "700",
        fontSize: 16,
    },
    bookingInfo: {
        padding: 16,
    },
    bookingName: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.dark,
        marginBottom: 8,
    },
    bookingLocationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    locationText: {
        fontSize: 14,
        color: Colors.gray,
        marginLeft: 6,
        flex: 1,
    },
    bookingDate: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    dateText: {
        fontSize: 14,
        color: Colors.gray,
        marginLeft: 6,
    },
    bookingPrice: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.primary,
    },
    nightText: {
        fontSize: 14,
        fontWeight: "normal",
        color: Colors.gray,
    },
    bookingActions: {
        alignItems: "flex-start",
    },
    bookingViewButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 0,
    },
    bookingViewButtonText: {
        color: Colors.primary,
        fontWeight: "600",
        marginRight: 4,
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.gray,
    },
    noBookingsContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 3,
    },
    emptyStateIcon: {
        padding: 24,
        borderRadius: 20,
        marginBottom: 20,
    },
    noBookingsText: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "700",
        color: Colors.dark,
    },
    noBookingsSubtext: {
        marginTop: 8,
        marginBottom: 24,
        fontSize: 14,
        color: Colors.gray,
        textAlign: "center",
    },
    exploreTripButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
    },
    exploreTripButtonText: {
        color: Colors.white,
        fontWeight: "600",
        marginRight: 8,
    },
});