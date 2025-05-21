import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { useField } from 'formik';

const FormField = ({ name, label, ...props }) => {
  const [field, meta, helpers] = useField(name);
  
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={field.value}
        onChangeText={helpers.setValue}
        onBlur={() => helpers.setTouched(true)}
        error={meta.touched && meta.error ? true : false}
        style={styles.input}
        mode="outlined"
        {...props}
      />
      {meta.touched && meta.error && (
        <HelperText type="error" visible={meta.touched && meta.error}>
          {meta.error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
  },
});

export default FormField;