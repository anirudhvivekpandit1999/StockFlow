import { useNavigation } from '@react-navigation/native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomNavigation = ({onOpen}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const actions = [
    {
      key: 1,
      icon: 'home',
      onPress: () => {
        navigation.navigate('Home');
      },
    },
    {
      key: 2,
      icon: 'arrow-down-bold',
      onPress: () => {
        navigation.navigate('ReceivedOrder');
      },
    },
    {
      key: 3,
      icon: 'arrow-up-bold',
      onPress: () => {
        navigation.navigate('DispatchedOrders');
      },
    },
    {
      key: 4,
      icon: 'menu',
      onPress: onOpen
    },
  ];

  return (
    <Appbar
      style={{
        backgroundColor: theme.colors.primary,
        height: 56 + insets.bottom,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: insets.bottom,
      }}
    >
      {actions.map((action) => (
        <Appbar.Action
          key={action.key}
          icon={action.icon}
          onPress={action.onPress}
          color="white"
        />
      ))}
    </Appbar>
  );
};

export default BottomNavigation;