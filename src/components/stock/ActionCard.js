import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ActionCard = ({
  title,
  buttonTitle,
  buttonColor,
  recentTitle,
  recentValue,
  recentTime,
  onPress,
  icon,
  color,
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.contentRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: buttonColor }]}
            onPress={onPress}
          >
            {icon && <Icon name={icon} size={22} color={color} style={styles.icon} />}
            <Text style={[styles.actionText, { color }]}>{buttonTitle}</Text>
          </TouchableOpacity>

          <View style={styles.recentInfo}>
            <Text style={styles.recentLabel}>{recentTitle}</Text>
            <Text style={styles.recentValue}>{recentValue}</Text>
            <Text style={styles.recentTime}>{recentTime}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginVertical: 12,
    padding: 10,
    borderColor: '#e3eaf3',
    borderWidth: 1,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3a6ea8',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: '#eaf2fb',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  icon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  recentInfo: {
    marginLeft: 20,
    flex: 1,
  },
  recentLabel: {
    fontSize: 13,
    color: '#7a8ca3',
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  recentValue: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  recentTime: {
    fontSize: 12,
    color: '#b0b9c6',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default ActionCard;
