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
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#202124',
  },
  details: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#5f6368',
  },
});

export default ActivityItem;