import React from "react";
import {StyleSheet, View, Text, FlatList, ListRenderItem, TouchableOpacity, Image} from "react-native";
import {ListingType} from "@/types/listingType";
import Colors from "@/constants/Colors";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";


type Props ={
    listings: any[];

}
const Listings = ({listings} : Props) => {

     const renderItems:ListRenderItem<ListingType> = ({item}) => {
         return (

               <TouchableOpacity>

                   <View style={styles.item}>


                       <Image source={{uri: item.image}}
                              style={styles.image}/>
                       <View style={styles.favorite}>
                           <Ionicons name="heart" size={20} color="red"/>
                       </View>


                       <View style={styles.nameRatingContainer}>
                           <Text style={styles.itemLocationTxt} numberOfLines={1} ellipsizeMode="tail">
                               {item.name}
                           </Text>
                           <View style={styles.ratingContainer}>
                               <Ionicons name="star" size={14} color="red" />
                               <Text style={styles.rateTxt}>{item.rating}</Text>
                           </View>
                       </View>

                       <View style={styles.locationContainer}>
                           <FontAwesome5 name="map-marker-alt" size={14} color={Colors.primaryColor} />
                           <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">
                               {item.location}
                           </Text>
                       </View>
                       <View style={styles.priceContainer}>
                           <Text style={styles.priceTxt}>
                               ${item.price}
                               <Text style={styles.perNightTxt}> /night</Text>
                           </Text>
                       </View>




                   </View>
               </TouchableOpacity>
            )
     }
    return (
        <View style={styles.container}>
          <FlatList data={listings}
                    renderItem={renderItems}
                    horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.list}
          />
        </View>
    )
}

export default Listings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    list: {
        alignItems: "center", // Centers items vertically inside FlatList
        justifyContent: "center",
        paddingHorizontal: 10, // Avoids excessive spacing on edges
    },
    item:{
        backgroundColor: Colors.white,
        marginRight: 20,
        borderRadius: 10,
        width: 280,
        overflow: 'hidden',

    },
    image:{
        width: 280,
        height: 250,
        marginBottom: 20,
    },
    favorite:{
        position: 'absolute',
        right: 12,
        top: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 20,
    },
    itemTxt:{
        margin: 10,
        fontSize: 12,
        fontWeight: '400',
        color: Colors.black,
        marginBottom: 10,
    },
    nameRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemLocationTxt: {
        fontSize: 14,
        fontWeight: 'bold',
        flexShrink: 1, // Prevents overflow and allows proper wrapping
    },
    rateTxt: {
        fontSize: 12,
        color: Colors.black,
        fontWeight: 'bold',
        marginLeft: 4, // Adds spacing between star icon and rating
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        paddingHorizontal: 5,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        marginBottom: 10,
    },
    priceTxt: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.primaryColor, // Primary color for price
    },
    perNightTxt: {
        fontSize: 12,
        color: "gray", // Gray color for "/night"
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
})