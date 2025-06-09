import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Card, Title, Caption } from 'react-native-paper';
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
  color
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.container}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={onPress}
          >
            {icon && <Icon name={icon} size={24} color={color} style={styles.buttonIcon}/>}
            <Text style={styles.buttonText}>{buttonTitle}</Text>
          </TouchableOpacity>
          <View style={styles.infoContainer}>
            <Caption style={styles.caption}>{recentTitle}:</Caption>
            <Text style={styles.value}>{recentValue}</Text>
            <Caption style={styles.time}>{recentTime}</Caption>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    elevation: 0,
    backgroundColor: '#fff',
    borderRadius: 22,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3a6ea8',
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaf2fb',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
  },
  buttonText: {
    color: '#3a6ea8',
    fontWeight: '500',
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  buttonIcon: {
    marginRight: 7,
  },
  infoContainer: {
    marginLeft: 18,
    flex: 1,
  },
  caption: {
    fontSize: 12,
    color: '#7a8ca3',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  value: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  time: {
    fontSize: 12,
    color: '#7a8ca3',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default ActionCard;