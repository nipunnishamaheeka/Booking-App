import React from "react";
import {StyleSheet,View,Text} from "react-native";

const Page = () => {
    return (
        <View style={styles.container}>
            <Text>Home</Text>
        </View>
    )
}

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})