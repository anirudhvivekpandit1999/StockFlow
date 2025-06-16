import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useContext, useState, useRef, useEffect } from "react";
import { use } from "react";
import {StyleSheet, useWindowDimensions, View, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert, Animated, Easing} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text, useTheme, TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiServices from "../src/services/apiServices";
import {GlobalContext} from "../src/services/GlobalContext";

// --- FormField: minimal, flat, Apple style ---
const FormField = ({ name, label, secureTextEntry, formikProps, icon }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <View style={styles.fieldContainer}>
            <TextInput
                label={label}
                value={formikProps.values[name]}
                onChangeText={formikProps.handleChange(name)}
                onBlur={formikProps.handleBlur(name)}
                secureTextEntry={secureTextEntry && !showPassword}
                mode="flat"
                style={styles.textInput}
                left={icon ? <TextInput.Icon icon={icon} /> : null}
                right={secureTextEntry ? (
                    <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                ) : null}
                theme={{
                    colors: {
                        background: '#f9f9f9',
                        primary: '#007AFF',
                        text: '#222',
                        placeholder: '#888',
                        outline: '#e5e5ea',
                    }
                }}
                underlineColor="#e5e5ea"
                activeUnderlineColor="#007AFF"
                selectionColor="#007AFF"
            />
            {formikProps.touched[name] && formikProps.errors[name] && (
                <Text style={styles.errorText}>{formikProps.errors[name]}</Text>
            )}
        </View>
    );
};

const SignUpScreen = () => {
    const theme = useTheme();
    const { width, height } = useWindowDimensions();
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const { setUserId  , setRoleId} = useContext(GlobalContext);
    const [shake, setShake] = useState(false);

    // Animations (subtle fade/slide)
    const logoAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(logoAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
        Animated.timing(cardAnim, {
            toValue: 1,
            duration: 700,
            delay: 200,
            useNativeDriver: true,
        }).start();
    }, []);

    const initialValues = {
        username: '',
        password: ''
    };

    const validateForm = (values) => {
        const errors = {};

        if (!values.username) {
            errors.username = 'Username is required';
        } else if (values.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    };

    const triggerShake = () => {
        setShake(true);
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start(() => setShake(false));
    };

    const handleSignUp = async (values) => {
        setIsLoading(true);
        try {
            const result = await apiServices.signUp({ Username: values.username, Password: values.password });
            if (result[0].Status === 200) {
                Alert.alert(result[0].Message);
                setUserId(JSON.parse(result[0].Data).UserId);
                setRoleId(JSON.parse(result[0].Data).RoleId);
                navigation.navigate('dashboard');
            } else {
                Alert.alert(result[0].Message);
                triggerShake();
            }
        } catch (error) {
            console.error('Sign Up error:', error);
            triggerShake();
        } finally {
            setIsLoading(false);
        }
    };

    // Logo subtle fade/slide
    const logoTranslateY = logoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-24, 0]
    });
    const logoOpacity = logoAnim;
    // Card fade/slide
    const cardOpacity = cardAnim;
    const cardTranslateY = cardAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [24, 0]
    });
    // Shake transform
    const shakeTransform = shakeAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-6, 0, 6]
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
                backgroundColor="#f9f9f9"
                translucent={false}
            />
            {/* Flat white background */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f9f9f9' }]} />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            transform: [
                                { translateY: logoTranslateY }
                            ],
                            opacity: logoOpacity
                        }
                    ]}
                >
                    <View style={styles.logoCircle}>
                        <Icon
                            name="star-four-points"
                            size={40}
                            color="#007AFF"
                        />
                    </View>
                    <Text style={styles.appTitle}>Create Account</Text>
                    <Text style={styles.appSubtitle}>Start your journey with StockFlow</Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.formCard,
                        { width: Math.min(width - 40, 400) },
                        {
                            opacity: cardOpacity,
                            transform: [
                                { translateY: cardTranslateY },
                                { translateX: shake ? shakeTransform : 0 }
                            ]
                        }
                    ]}
                >
                    <Formik
                        initialValues={initialValues}
                        validate={validateForm}
                        onSubmit={handleSignUp}
                    >
                        {(formikProps) => (
                            <View style={styles.formContent}>
                                <FormField
                                    name="username"
                                    
                                    icon="account-outline"
                                    formikProps={formikProps}
                                />

                                <FormField
                                    name="password"
                                    
                                    icon="lock-outline"
                                    secureTextEntry
                                    formikProps={formikProps}
                                />

                                <Button
                                    mode="contained"
                                    onPress={formikProps.handleSubmit}
                                    loading={isLoading}
                                    disabled={isLoading}
                                    style={styles.loginButton}
                                    labelStyle={styles.loginButtonText}
                                    buttonColor="#007AFF"
                                >
                                    {isLoading ? 'Creating Account…' : 'Create Account'}
                                </Button>
                            </View>
                        )}
                    </Formik>
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.signupLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5e5ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#222',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
    letterSpacing: 0.1,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
    letterSpacing: 0.1,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    alignSelf: 'center',
    marginBottom: 14,
  },
  formContent: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 4,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 4,
  },
  loginButton: {
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 8,
    marginTop: 6,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#fff',
    letterSpacing: 0.1,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  signupText: {
    color: '#888',
    fontSize: 14,
    letterSpacing: 0.1,
  },
  signupLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginLeft: 2,
    letterSpacing: 0.1,
  },
});

export default SignUpScreen;