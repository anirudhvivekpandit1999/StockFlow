import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Surface } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ActivityItem = ({
  type,
  title,
  details,
  time,
  iconName,
  iconColor,
  iconBgColor,
}) => {
  return (
    <Surface style={styles.card}>
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        <MaterialIcons name={iconName} size={22} color={iconColor} />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDetails}>{details}</Text>
      </View>

      <Text style={styles.activityTime}>{time}</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderColor: '#e3eaf3',
    borderWidth: 1,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 8,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaf2fb',
  },
  infoSection: {
    flex: 1,
    marginLeft: 16,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3a6ea8',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  activityDetails: {
    fontSize: 13,
    color: '#7a8ca3',
    marginTop: 3,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ba9b8',
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default ActivityItem;
