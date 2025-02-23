import React, { useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { designationCategories } from "@/data/categories";

type Props ={
    onCategoryChanged: (category: string) => void;
}
const CategoryButtons = ({onCategoryChanged}: Props) => {
    const scrollRef = useRef<ScrollView | null>(null);
    const itemRef = useRef<Array<TouchableOpacity | null>>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelectCategory = (index: number) => {
        setActiveIndex(index);

        const selected = itemRef.current[index];

        if (selected) {
            selected.measure((x, y, width, height, pageX) => {
                scrollRef.current?.scrollTo({ x: pageX, y: 0, animated: true });
            });
        }
        onCategoryChanged(designationCategories[index].title);
    };

    return (
        <View>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 20,
                    paddingVertical: 10,
                    marginBottom: 10
                }}
            >
                {designationCategories.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        ref={(el) => (itemRef.current[index] = el)}
                        onPress={() => handleSelectCategory(index)}
                        style={activeIndex === index ? styles.categoryBtnActive : styles.categoryBtn}
                    >
                        <MaterialCommunityIcons
                            name={item.icon as any}
                            size={20}
                            color={activeIndex === index ? Colors.white : Colors.black}
                        />
                        <Text style={activeIndex === index ? styles.categoryBtnTextActive : styles.categoryBtnText}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default CategoryButtons;

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.black
    },
    categoryBtn: {
        marginLeft: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },
    categoryBtnActive: {
        marginLeft: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.primaryColor, // Ensure this exists
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },
    categoryBtnText: {
        marginLeft: 5,
        color: Colors.black,
        fontSize: 12
    },
    categoryBtnTextActive: {
        marginLeft: 5,
        color: Colors.white,
        fontSize: 12
    }
});
