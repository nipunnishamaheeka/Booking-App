import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import CategoryButtons from "@/components/CategoryButtons";



const handleNotificationPress = () => {
    console.log("Notification button pressed");
};


const Page = () => {
    const [category, setCategory] = React.useState("All");

    const onCatChanged = (category: string) => {
        console.log("Category changed to: ", category);
        setCategory(category);

    }
    return (
        <>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "",

                    headerRight: () => (
                        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
                            <Ionicons name="notifications" size={20} color="black" />
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView style={styles.container}>
                <View style={styles.locationContainer}>
                    <View style={styles.locationWrapper}>
                        <Ionicons name="location" size={24} color="black" />
                        <Text style={styles.locationText}>Your Location</Text>
                    </View>
                </View>



                <CategoryButtons onCategoryChanged={onCatChanged}/>






                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Near Location</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.hotelCard}>
                            <Image
                                source={{ uri: "data:image/jpeg;base64,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" }}
                                style={styles.hotelImage}
                            />
                            <TouchableOpacity style={styles.favoriteButton}>
                                <Ionicons name="heart" size={20} color="red" />
                            </TouchableOpacity>
                            <View style={styles.hotelInfo}>
                                <Text style={styles.hotelName}>The Aston Vill Hotel</Text>
                                <Text style={styles.hotelLocation}>Alice Springs NT 0870, Australia</Text>
                                <View style={styles.ratingPrice}>
                                    <View style={styles.rating}>
                                        <Ionicons name="star" size={16} color="#FFD700" />
                                        <Text style={styles.ratingText}>5.0</Text>
                                    </View>
                                    <Text style={styles.price}>$200.7<Text style={styles.perNight}>/night</Text></Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* Popular Hotel Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular Hotel</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.popularHotelCard}>
                        <Image
                            source={{ uri: "https://www.hotelescenter.es/wp-content/blogs.dir/1601/files/home//header-home-mb.jpg" }}
                            style={styles.popularHotelImage}
                        />
                        <View style={styles.popularHotelInfo}>
                            <Text style={styles.hotelName}>Asteria Hotel</Text>
                            <Text style={styles.hotelLocation}>Wilora NT 0872, Australia</Text>
                            <View style={styles.ratingPrice}>
                                <View style={styles.rating}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>5.0</Text>
                                </View>
                                <Text style={styles.price}>$165.3<Text style={styles.perNight}>/night</Text></Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10
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
    locationContainer: {
        marginTop: 60,
        padding: 20,
    },
    locationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },

    sectionContainer: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    seeAllText: {
        color: Colors.primary || "#007bff",
    },
    hotelCard: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 16,
        overflow: 'hidden',
    },
    hotelImage: {
        width: '100%',
        height: 180,
    },
    favoriteButton: {
        position: 'absolute',
        right: 12,
        top: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 20,
    },
    hotelInfo: {
        padding: 12,
    },
    popularHotelCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    popularHotelImage: {
        width: 100,
        height: 100,
    },
    popularHotelInfo: {
        flex: 1,
        padding: 12,
    },
});
