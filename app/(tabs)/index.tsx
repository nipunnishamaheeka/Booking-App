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
import Listings from "@/components/Listings";
import listingData from "@/data/destinations.json";
import GroupListing from "@/components/GroupListing";
import  groupData from "@/data/groups.json";

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
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.locationContainer}>
                    <View style={styles.locationWrapper}>
                        <Ionicons name="location" size={24} color="black" />
                        <Text style={styles.locationText}>Your Location</Text>
                    </View>
                </View>



                <CategoryButtons onCategoryChanged={onCatChanged}/>






                <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Near Location</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <Listings listings={listingData} category={category}/>

                <GroupListing listings={groupData}/>

                {/*<View style={styles.sectionContainer}>*/}
                {/*    <Text style={styles.sectionTitle}>Near Location</Text>*/}
                {/*    <TouchableOpacity>*/}
                {/*        <Text style={styles.seeAllText}>See all</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}
                {/*<View style={styles.sectionHeader}>*/}

                {/*    <View style={styles.popularHotelCard}>*/}
                {/*        <Image*/}
                {/*            source={{ uri: "https://www.hotelescenter.es/wp-content/blogs.dir/1601/files/home//header-home-mb.jpg" }}*/}
                {/*            style={styles.popularHotelImage}*/}
                {/*        />*/}
                {/*        <View style={styles.popularHotelInfo}>*/}
                {/*            <Text style={styles.hotelName}>Asteria Hotel</Text>*/}
                {/*            <Text style={styles.hotelLocation}>Wilora NT 0872, Australia</Text>*/}
                {/*            <View style={styles.ratingPrice}>*/}
                {/*                <View style={styles.rating}>*/}
                {/*                    <Ionicons name="star" size={16} color="#FFD700" />*/}
                {/*                    <Text style={styles.ratingText}>5.0</Text>*/}
                {/*                </View>*/}
                {/*                <Text style={styles.price}>$165.3<Text style={styles.perNight}>/night</Text></Text>*/}
                {/*            </View>*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*</View>*/}
                </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
