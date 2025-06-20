import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { Appbar, Searchbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import apiServices from '../../services/apiServices';
import { GlobalContext } from '../../services/GlobalContext';

const { width } = Dimensions.get('window');

const AppBar = ({
  title,
  onMenuPress,
  showBack,
  onBackPress,
  actions = [],
  showSearch = true,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchValue = ''
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { userId, warehouseId } = useContext(GlobalContext);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [searchAnim] = useState(new Animated.Value(0));
  const [filterVisible, setFilterVisible] = useState(false);
  const [filter, setFilter] = useState('All');
  const [dummyList, setDummyList] = useState([]);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    getDummyList();
  }, [filter]);

  const getNotifications = async () => {
    const result = await apiServices.getNotifications({ UserId: userId });
    const parsed = JSON.parse(result.Data).map(n => ({ ...n, expanded: false }));
    setNotifications(parsed);
  };

  const getDummyList = async () => {
    const result = await apiServices.getSearchedList({ StockStatus: filter, UserId: userId, WarehouseId: warehouseId });
    setDummyList(JSON.parse(result.Data).map(item => item.ProductName));
  };

  const toggleSearch = () => {
    Animated.timing(searchAnim, {
      toValue: isSearchVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearch('');
      onSearchChange && onSearchChange('');
    }
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    onSearchChange && onSearchChange(text);
  };

  const filteredList = dummyList.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const toggleNotificationExpand = (id) => {
    setNotifications(prev =>
      prev.map(n => n.NotificationId === id ? { ...n, expanded: !n.expanded } : n)
    );
  };

  const removeNotification = async (id) => {
    const result = await apiServices.deleteNotificationById({ NotificationId: id, UserId: userId });
    const parsed = (JSON.parse(result.Data) || []).map(n => ({ ...n, expanded: false }));
    setNotifications(parsed);
  };

  const searchBarWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 120],
  });

  const titleOpacity = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>      
      {notificationsVisible && <TouchableOpacity style={styles.overlay} onPress={() => setNotificationsVisible(false)} />}

      <View style={[styles.header, { backgroundColor: '#3a6ea8' }]}>
        {showBack ? (
          <Appbar.BackAction onPress={onBackPress} color="white" />
        ) : (
          <Appbar.Action icon="menu" onPress={onMenuPress} color="white" />
        )}

        <Animated.View style={[styles.titleWrap, { opacity: titleOpacity }]}>
          <Appbar.Content title={title} titleStyle={styles.titleText} />
        </Animated.View>

        <Animated.View style={[styles.searchContainer, { width: searchBarWidth }]}>
          {isSearchVisible && (
            <Searchbar
              placeholder={searchPlaceholder}
              onChangeText={handleSearchChange}
              value={search}
              style={styles.searchbar}
              inputStyle={styles.searchInput}
              autoFocus
            />
          )}
        </Animated.View>

        <View style={styles.rightActions}>
          <TouchableOpacity onPress={() => setNotificationsVisible(!notificationsVisible)}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
            {notifications.length > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{notifications.length > 9 ? '9+' : notifications.length}</Text></View>
            )}
          </TouchableOpacity>

          <Appbar.Action
            icon="filter-variant"
            onPress={() => setFilterVisible(!filterVisible)}
            color={filter !== 'All' ? theme.colors.accent || '#FFD700' : 'white'}
          />

          {showSearch && (
            <Appbar.Action
              icon={isSearchVisible ? 'close' : 'magnify'}
              onPress={toggleSearch}
              color="white"
            />
          )}

          {!isSearchVisible && actions.map((action, index) => (
            <Appbar.Action
              key={index}
              icon={action.icon}
              onPress={action.onPress}
              color="white"
            />
          ))}
        </View>
      </View>

      {filterVisible && (
        <View style={styles.dropdown}>
          {['All', 'Dispatched', 'Recieved', 'Transferred'].map(option => (
            <TouchableOpacity key={option} onPress={() => { setFilter(option); setFilterVisible(false); }}>
              <Text style={[styles.dropdownOption, filter === option && styles.dropdownSelected]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {notificationsVisible && (
        <View style={styles.notificationBox}>
          <Text style={styles.notificationHeader}>Notifications</Text>
          <FlatList
            data={notifications}
            keyExtractor={(n) => n.NotificationId?.toString()}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <View style={styles.notificationHeaderRow}>
                  <Image style={styles.notificationIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notificationTitle}>{item.NotificationHeader}</Text>
                    <Text style={styles.notificationType}>{item.NotificationType || 'Alert'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleNotificationExpand(item.NotificationId)}>
                    <MaterialCommunityIcons
                      name={item.expanded ? 'chevron-up' : 'chevron-down'}
                      size={22}
                      color="#888"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeNotification(item.NotificationId)}>
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={22}
                      color="#d32f2f"
                    />
                  </TouchableOpacity>
                </View>
                {item.expanded && (
                  <Text style={styles.notificationText}>{item.NotificationText || 'No content available'}</Text>
                )}
              </View>
            )}
          />
        </View>
      )}

      {isSearchVisible && (
        <View style={styles.searchResults}>
          {search.length > 0 && (
            <Text style={styles.resultCount}>{filteredList.length} result{filteredList.length !== 1 ? 's' : ''} found</Text>
          )}
          {filteredList.map((item, idx) => (
            <TouchableOpacity key={idx} onPress={() => navigation.navigate('ProductDetails', { name: item })}>
              <Text style={styles.resultItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { zIndex: 10, backgroundColor: '#3a6ea8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 56 },
  titleWrap: { flex: 1, alignItems: 'center' },
  titleText: { color: 'white', fontSize: 17, fontWeight: '600' },
  searchContainer: { position: 'absolute', left: 56, height: 40, justifyContent: 'center' },
  searchbar: { height: 40, borderRadius: 20 },
  searchInput: { fontSize: 14 },
  rightActions: { flexDirection: 'row', alignItems: 'center' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#3a6ea8', borderRadius: 8, paddingHorizontal: 4 },
  badgeText: { color: 'white', fontSize: 10 },
  dropdown: { position: 'absolute', top: 56, right: 10, backgroundColor: 'white', borderRadius: 8, padding: 8, zIndex: 100 },
  dropdownOption: { padding: 10, color: '#333' },
  dropdownSelected: { fontWeight: 'bold', color: '#3a6ea8' },
  notificationBox: { position: 'absolute', top: 56, right: 10, width: 320, backgroundColor: 'white', borderRadius: 8, padding: 10, zIndex: 100 },
  notificationHeader: { fontSize: 16, fontWeight: 'bold', color: '#3a6ea8' },
  notificationItem: { borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 10 },
  notificationHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  notificationIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', marginRight: 10 },
  notificationTitle: { fontWeight: '600', color: '#222' },
  notificationType: { fontSize: 12, color: '#666' },
  notificationText: { paddingTop: 6, fontSize: 14, color: '#333' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.05)', zIndex: 50 },
  searchResults: { backgroundColor: 'white', padding: 12 },
  resultCount: { color: '#7a8ca3', fontSize: 12, marginBottom: 8 },
  resultItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee', fontSize: 15, color: '#222' }
});

export default AppBar;