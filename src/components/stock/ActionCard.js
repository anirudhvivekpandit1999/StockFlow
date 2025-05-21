import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#5f6368',
    fontWeight: '500',
  },
  buttonIcon: {
    marginRight: 5,
  },
  infoContainer: {
    marginLeft: 15,
    flex: 1,
  },
  caption: {
    fontSize: 12,
    color: '#5f6368',
  },
  value: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4,
  },
});

export default ActionCard;