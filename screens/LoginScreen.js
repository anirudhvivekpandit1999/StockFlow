// Login Screen - METAS UI

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import apiServices from "../src/services/apiServices";
import { GlobalContext } from "../src/services/GlobalContext";

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
        underlineColor="#e5e5ea"
        activeUnderlineColor="#1976d2"
      />
      {formikProps.touched[name] && formikProps.errors[name] && (
        <Text style={styles.errorText}>{formikProps.errors[name]}</Text>
      )}
    </View>
  );
};

const LoginScreen = () => {
  const { setUserId, setRoleId } = useContext(GlobalContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [shake, setShake] = useState(false);

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

  const initialValues = { username: "", password: "" };

  const validateForm = (values) => {
    const errors = {};
    if (!values.username) errors.username = "Username is required";
    else if (values.username.length < 3) errors.username = "Min 3 characters";
    if (!values.password) errors.password = "Password is required";
    else if (values.password.length < 6) errors.password = "Min 6 characters";
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

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const result = await apiServices.login({ Username: values.username, Password: values.password });
      if (result[0].Status === 200) {
        Alert.alert(result[0].Message);
        setUserId(JSON.parse(result[0].Data).UserId);
        setRoleId(JSON.parse(result[0].Data).RoleId);
        navigation.navigate("Home");
      } else {
        Alert.alert(result[0].Message);
        triggerShake();
      }
    } catch (error) {
      console.error("Login error:", error);
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const logoTranslateY = logoAnim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] });
  const cardTranslateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const shakeTransform = shakeAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-6, 0, 6] });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Animated.View
          style={[styles.logoContainer, { transform: [{ translateY: logoTranslateY }], opacity: logoAnim }]}
        >
          <View style={styles.logoCircle}>
            <Icon name="warehouse" size={40} color="#1976d2" />
          </View>
          <Text style={styles.appTitle}>Sign In</Text>
          <Text style={styles.appSubtitle}>Welcome to StockFlow</Text>
        </Animated.View>

        <Animated.View
          style={[styles.formCard, {
            opacity: cardAnim,
            transform: [
              { translateY: cardTranslateY },
              { translateX: shake ? shakeTransform : 0 }
            ]
          }]}
        >
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleLogin}
          >
            {(formikProps) => (
              <View style={styles.formContent}>
                <FormField name="username" icon="account-outline" formikProps={formikProps} />
                <FormField name="password" icon="lock-outline" secureTextEntry formikProps={formikProps} />
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                <Button
                  mode="contained"
                  onPress={formikProps.handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.loginButton}
                  labelStyle={styles.loginButtonText}
                  buttonColor="#1976d2"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </View>
            )}
          </Formik>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>New to StockFlow?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}> 
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e3ecff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  appTitle: { fontSize: 22, fontWeight: "600", color: "#222", letterSpacing: 0.2 },
  appSubtitle: { fontSize: 14, color: "#888", marginTop: 2 },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "#e3ecff",
  },
  formContent: { width: "100%" },
  fieldContainer: { marginBottom: 16 },
  textInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  errorText: { color: "#ff3b30", fontSize: 13, marginTop: 2, marginLeft: 4 },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 12 },
  forgotPasswordText: { color: "#1976d2", fontSize: 15, fontWeight: "500" },
  loginButton: {
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 8,
    marginTop: 6,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signupText: { color: "#888", fontSize: 14 },
  signupLink: { color: "#1976d2", fontSize: 14, fontWeight: "600", marginLeft: 4 },
});

export default LoginScreen;