import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Button, Text, useTheme, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import apiServices from "../src/services/apiServices";
import { GlobalContext } from "../src/services/GlobalContext";

const FormField = ({ name, label, secureTextEntry, formikProps, icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        label={label}
        value={formikProps.values[name]}
        onChangeText={formikProps.handleChange(name)}
        onBlur={formikProps.handleBlur(name)}
        secureTextEntry={secureTextEntry && !showPassword}
        mode="outlined"
        left={icon ? <TextInput.Icon icon={icon} /> : null}
        right={
          secureTextEntry ? (
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          ) : null
        }
        style={styles.input}
      />
      {formikProps.touched[name] && formikProps.errors[name] && (
        <Text style={styles.errorText}>{formikProps.errors[name]}</Text>
      )}
    </View>
  );
};

const SignUpScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { setUserId, setRoleId } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const initialValues = { username: "", password: "" };

  const validateForm = (values) => {
    const errors = {};
    if (!values.username) errors.username = "Username is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSignUp = async (values) => {
    setIsLoading(true);
    try {
      const result = await apiServices.signUp({ Username: values.username, Password: values.password });
      if (result[0].Status === 200) {
        Alert.alert(result[0].Message);
        setUserId(JSON.parse(result[0].Data).UserId);
        setRoleId(JSON.parse(result[0].Data).RoleId);
        navigation.navigate("dashboard");
      } else {
        Alert.alert(result[0].Message);
        triggerShake();
      }
    } catch (error) {
      console.error("Sign Up error:", error);
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.root}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f4f6f8" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
          <View style={styles.headerIcon}>
            <Icon name="account-plus-outline" size={40} color="#3a6ea8" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join StockFlow today</Text>

          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSignUp}
          >
            {(formikProps) => (
              <View style={{ width: "100%" }}>
                <FormField name="username" label="Username" icon="account-outline" formikProps={formikProps} />
                <FormField name="password" label="Password" icon="lock-outline" secureTextEntry formikProps={formikProps} />

                <Button
                  mode="contained"
                  onPress={formikProps.handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.button}
                  labelStyle={{ color: "white" }}
                >
                  {isLoading ? "Creating…" : "Sign Up"}
                </Button>
              </View>
            )}
          </Formik>
          <View style={styles.footerText}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}> 
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerIcon: {
    backgroundColor: "#e8eefc",
    alignSelf: "center",
    padding: 12,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#3a6ea8",
    paddingVertical: 8,
  },
  footerText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  linkText: {
    color: "#3a6ea8",
    fontWeight: "bold",
    marginLeft: 6,
  },
});

export default SignUpScreen;
