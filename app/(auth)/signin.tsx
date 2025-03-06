// app/(auth)/signin.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/config/firebaseConfig";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/"); // Auth state listener will handle navigation
        } catch (error: any) {
            let errorMessage = "Failed to sign in";
            if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email";
            }
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        router.push("/(auth)/signup");
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            {/* Logo Header */}
            <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>

                    <Ionicons name="calendar" size={32} color="#674cff" />
                </View>
                <Text style={styles.logoText}>Travel Go</Text>
                <Text style={styles.logoTagline}>Exploring The World</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
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

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignIn}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
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
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.signUpText}> Sign Up</Text>
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
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotPasswordText: {
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
    signUpText: {
        color: "#4c669f",
        fontWeight: "600",
        fontSize: 16,
    },
});