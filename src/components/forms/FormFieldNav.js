import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { useField } from 'formik';
import apiServices from '../../services/apiServices';

const FormFieldNav = ({ name, label, value ,x ,...props }) => {
  const [field, meta, helpers] = useField(name);
  helpers.setValue(value);
  // useEffect(() => {
  //   fetchProductName();
  // }, [value]);
  // const fetchProductName = async()=>{
  //   var result = await apiServices.getProductName(value);
  //   console.log(JSON.parse(result[0].Data))
  //   if(result[0].Status === 200){
  //     helpers.setValue(JSON.parse(result[0].Data).ProductName);
  //     Alert.alert(result[0].Message);
  //   }
  //   else{
  //     helpers.setValue("");
  //     Alert.alert(result[0].Message);
  //   }
  // }
  return (
    <View 
    style={styles.container}>
      <TextInput
        label={label}
        value={field.value}
        onChangeText={helpers.setValue}
        onBlur={() => helpers.setTouched(true)}
        error={meta.touched && meta.error ? true : false}
        style={styles.input}
        mode="outlined"
        keyboardType= {x === "1" ? "number-pad" : "default"}
        {...props}
      />
      {meta.touched && meta.error && (
        <HelperText 
        type="error" 
        visible={meta.touched && meta.error}>
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

export default FormFieldNav;