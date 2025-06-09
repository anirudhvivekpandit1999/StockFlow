import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ActivityItem = ({ 
  type, 
  title, 
  details, 
  time, 
  iconName, 
  iconColor, 
  iconBgColor 
}) => {
  return (
    <Surface style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <MaterialIcons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.details}>{details}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    borderRadius: 18,
    elevation: 0,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaf2fb',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3a6ea8',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  details: {
    fontSize: 13,
    color: '#7a8ca3',
    marginTop: 2,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  time: {
    fontSize: 12,
    color: '#7a8ca3',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default ActivityItem;