import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { useField } from 'formik';

const FormFieldNav = ({ name, label, value, x, ...props }) => {
  const [field, meta, helpers] = useField(name);

  // Always sync value from props to Formik
  helpers.setValue(value);

  return (
    <View style={styles.fieldContainer}>
      <TextInput
        label={label}
        value={field.value}
        onChangeText={helpers.setValue}
        onBlur={() => helpers.setTouched(true)}
        error={meta.touched && !!meta.error}
        mode="outlined"
        keyboardType={x === "1" ? "number-pad" : "default"}
        style={styles.textInput}
        outlineColor="#e3eaf3"
        activeOutlineColor="#3a6ea8"
        theme={{
          colors: {
            background: '#fff',
            primary: '#3a6ea8',
            text: '#222',
            placeholder: '#6b7280',
          },
        }}
        {...props}
      />
      {meta.touched && meta.error && (
        <HelperText type="error" visible={true} style={styles.helperText}>
          {meta.error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 18,
    backgroundColor: '#f9fbfe',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 14,
    fontSize: 15,
    color: '#222',
    paddingHorizontal: 8,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  helperText: {
    fontSize: 13,
    paddingLeft: 4,
    color: '#e53935',
  },
});

export default FormFieldNav;
