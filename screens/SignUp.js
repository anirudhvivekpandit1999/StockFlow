import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { use } from "react";
import {Image,StyleSheet,useWindowDimensions,View,TouchableOpacity,StatusBar,KeyboardAvoidingView,Platform, Alert} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text, useTheme, TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiServices from "../src/services/apiServices";
import {GlobalContext} from "../src/services/GlobalContext";

const FormField = ({ name, label, secureTextEntry, formikProps, icon }) => {
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();

    return (
        <View style={styles.fieldContainer}>
            <TextInput
                label={label}
                value={formikProps.values[name]}
                onChangeText={formikProps.handleChange(name)}
                onBlur={formikProps.handleBlur(name)}
                secureTextEntry={secureTextEntry && !showPassword}
                mode="outlined"
                style={styles.textInput}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                left={<TextInput.Icon icon={icon} />}
                right={
                    secureTextEntry ? (
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    ) : null
                }
                theme={{
                    colors: {
                        background: 'white',
                    }
                }}
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
    const {setUserId} = useContext(GlobalContext);

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

    const handleSignUp = async (values) => {
        setIsLoading(true);
        try {
            const result = await apiServices.signUp({Username : values.username , Password : values.password});
            if(result[0].Status === 200)
            {
                Alert.alert(result[0].Message);
                console.log(result[0]);
                setUserId(JSON.parse(result[0].Data).UserId);
                navigation.navigate('dashboard');
            }
            else
            {
                Alert.alert(result[0].Message);
            }

            

        } catch (error) {
            console.error('Sign Up error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <Image
                source={require('../src/assets/background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Icon name="account-lock" size={50} color="#667eea" />
                    </View>
                    <Text style={styles.appTitle}>Welcome New User</Text>
                    <Text style={styles.appSubtitle}>Create your account</Text>
                </View>

                <View style={[styles.formCard, { width: Math.min(width - 40, 400) }]}>
                    <Formik
                        initialValues={initialValues}
                        validate={validateForm}
                        onSubmit={handleSignUp}
                    >
                        {(formikProps) => (
                            <View style={styles.formContent}>
                                <Text style={styles.formTitle}>Sign Up</Text>

                                <FormField
                                    name="username"
                                    label="Username"
                                    icon="account"
                                    formikProps={formikProps}
                                />

                                <FormField
                                    name="password"
                                    label="Password"
                                    icon="lock"
                                    secureTextEntry
                                    formikProps={formikProps}
                                />

                                {/* <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity> */}

                                <Button
                                    mode="contained"
                                    onPress={formikProps.handleSubmit}
                                    loading={isLoading}
                                    disabled={isLoading}
                                    style={styles.loginButton}
                                    labelStyle={styles.loginButtonText}
                                    buttonColor="#667eea"
                                >
                                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                                </Button>

                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>OR</Text>
                                    <View style={styles.dividerLine} />
                                </View>
                            </View>
                        )}
                    </Formik>
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Have an Account ? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.signupLink}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
     signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: 'bold',
  },
    container: {
        flex: 1,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    appTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    appSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 15,
        alignSelf: 'center',
    },
    formContent: {
        width: '100%',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    textInput: {
        backgroundColor: 'white',
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 12,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 25,
        paddingVertical: 8,
        marginBottom: 30,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#888',
        fontSize: 14,
    },
});

export default SignUpScreen;