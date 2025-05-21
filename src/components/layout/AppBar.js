import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppBar = ({ title, onMenuPress, showBack, onBackPress, actions = [] }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Appbar.Header 
      style={[
        styles.header, 
        { 
          backgroundColor: theme.colors.primary,
          paddingTop: insets.top,
          height: 56 + insets.top 
        }
      ]}
    >
      {showBack ? (
        <Appbar.BackAction onPress={onBackPress} color="white" />
      ) : (
        <Appbar.Action icon="menu" onPress={onMenuPress} color="white" />
      )}
      <Appbar.Content title={title} titleStyle={styles.title} />
      {actions.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          color="white"
        />
      ))}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AppBar;