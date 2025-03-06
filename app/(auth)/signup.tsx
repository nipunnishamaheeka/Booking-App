// app/(auth)/signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/config/firebaseConfig";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async () => {
        // Basic validation
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password should be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            let errorMessage = "Failed to create account";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Please enter a valid email address";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak";
            }
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = () => {
        router.push("/(auth)/signin");
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            {/* Logo Header */}
            <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                    <Ionicons name="calendar" size={32} color="#4c669f" />
                </View>
                <Text style={styles.logoText}>Travel Go</Text>
                <Text style={styles.logoTagline}>Exploring The World</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join our community today</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.termsContainer}>
                    <TouchableOpacity style={styles.checkbox}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.termsText}>
                        I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> and <Text style={styles.termsHighlight}>Privacy Policy</Text>
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Create Account</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                    <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                        <Ionicons name="logo-google" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                        <Ionicons name="logo-facebook" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
                        <Ionicons name="logo-apple" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={handleSignIn}>
                        <Text style={styles.signInText}> Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoBackground: {
        backgroundColor: 'white',
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 30,
        fontWeight: "800",
        color: "white",
        letterSpacing: 1,
    },
    logoTagline: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F8FF",
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 56,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: "100%",
        color: "#333",
        fontSize: 16,
    },
    eyeIcon: {
        padding: 8,
    },
    termsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: "#4c669f",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    termsText: {
        flex: 1,
        color: "#666",
        fontSize: 14,
    },
    termsHighlight: {
        color: "#4c669f",
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#4c669f",
        borderRadius: 12,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#4c669f",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E5E7EB",
    },
    dividerText: {
        paddingHorizontal: 16,
        color: "#666",
        fontWeight: "500",
    },
    socialButtons: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 24,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
    },
    googleButton: {
        backgroundColor: "#DB4437",
    },
    facebookButton: {
        backgroundColor: "#4267B2",
    },
    appleButton: {
        backgroundColor: "#000",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    footerText: {
        color: "#666",
        fontSize: 16,
    },
    signInText: {
        color: "#4c669f",
        fontWeight: "600",
        fontSize: 16,
    },
});