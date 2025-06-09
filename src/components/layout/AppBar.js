import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, StyleSheet, View, Text, Animated, Dimensions, Image } from 'react-native';
import { Appbar, Searchbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiServices from '../../services/apiServices';
import { GlobalContext } from '../../services/GlobalContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const AppBar = ({
  title,
  onMenuPress,
  showBack,
  onBackPress,
  actions = [],
  showSearch = true,
  onSearchChange,
  searchPlaceholder = "Search...",
  searchValue = ""
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [searchAnimation] = useState(new Animated.Value(0));
  const [filterVisible, setFilterVisible] = useState(false);
  const [filter, setFilter] = useState('All');
  const [dummyList, setDummyList] = useState([]);
  const { userId, warehouseId } = useContext(GlobalContext);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getDummyList();
  }, [filter]);

  useEffect(() => {
    getNotifications();
  }, []);

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
    const toValue = isSearchVisible ? 0 : 1;
    Animated.timing(searchAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearch("");
      if (onSearchChange) onSearchChange("");
    }
  };

  const handleSearchChange = (query) => {
    setSearch(query);
    if (onSearchChange) onSearchChange(query);
  };

  const filteredList = dummyList.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const searchBarWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 120],
  });

  const titleOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const toggleNotificationExpand = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.NotificationId === id ? { ...n, expanded: !n.expanded } : n
      )
    );
  };

  const removeNotification = async (id) => {
    var result = await apiServices.deleteNotificationById({ NotificationId: id, UserId: userId });
    const parsed = (JSON.parse(result.Data) || []).map(n => ({ ...n, expanded: false }));
    setNotifications(parsed)
  };

  return (
    <View style={styles.container}>
      {notificationsVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setNotificationsVisible(false)} />
      )}

      <View style={[styles.headerContainer, { paddingTop: insets.top, backgroundColor: theme.colors.primary }]}>
        <Appbar.Header style={[styles.header]}>
          {showBack ? (
            <Appbar.BackAction onPress={onBackPress} color="white" style={styles.actionButton} />
          ) : (
            <Appbar.Action icon="menu" onPress={onMenuPress} color="white" style={styles.actionButton} />
          )}

          <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
            <Appbar.Content title={title} titleStyle={styles.title} />
          </Animated.View>

          {isSearchVisible && (
            <Animated.View style={[styles.animatedSearchContainer, { width: searchBarWidth }]}>
              <Searchbar
                placeholder={searchPlaceholder}
                onChangeText={handleSearchChange}
                value={search}
                style={styles.searchBar}
                inputStyle={styles.searchInput}
                iconColor={theme.colors.primary}
                placeholderTextColor="#999"
                autoFocus
                elevation={2}
              />
            </Animated.View>
          )}

          <View style={styles.actionsContainer}>
            <View style={{ position: 'relative', marginRight: 8 }}>
              <TouchableOpacity onPress={() => setNotificationsVisible(!notificationsVisible)} style={styles.actionButton}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
                {notifications.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Appbar.Action
              icon="filter-variant"
              onPress={() => setFilterVisible(!filterVisible)}
              color={filter !== 'All' ? theme.colors.accent || '#FFD700' : 'white'}
              style={styles.actionButton}
            />
            {showSearch && (
              <Appbar.Action
                icon={isSearchVisible ? "close" : "magnify"}
                onPress={toggleSearch}
                color="white"
                style={styles.actionButton}
              />
            )}
            {!isSearchVisible && actions.map((action, index) => (
              <Appbar.Action
                key={index}
                icon={action.icon}
                onPress={action.onPress}
                color="white"
                style={styles.actionButton}
              />
            ))}
          </View>
        </Appbar.Header>

        {filterVisible && (
          <View style={styles.filterDropdown}>
            {['All', 'Dispatched', 'Recieved', 'Transferred'].map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.filterOption, filter === option && styles.filterOptionSelected]}
                onPress={() => {
                  setFilter(option);
                  setFilterVisible(false);
                }}
              >
                <Text style={{ color: filter === option ? theme.colors.primary : '#333', fontWeight: filter === option ? 'bold' : 'normal' }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {notificationsVisible && (
        <View style={styles.notificationsDropdown}>
          <Text style={styles.notificationsHeader}>Notifications</Text>
          {notifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>No notifications</Text>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={notif => notif.NotificationId?.toString()}
              style={{ maxHeight: 340 }}
              renderItem={({ item: notif }) => (
                <View style={styles.notificationItem}>
                  <View style={styles.notificationHeaderRow}>
                    <Image style={styles.notificationAppIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notificationHeaderText}>{notif.NotificationHeader}</Text>
                      <Text style={styles.notificationTypeText}>{notif.NotificationType || 'Alert'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleNotificationExpand(notif.NotificationId)}>
                      <MaterialCommunityIcons
                        name={notif.expanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#888"
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeNotification(notif.NotificationId)}>
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={22}
                        color="#d32f2f"
                        style={{ marginLeft: 8 }}
                      />
                    </TouchableOpacity>
                  </View>
                  {notif.expanded && (
                    <View style={styles.notificationContentRow}>
                      <Text style={styles.notificationContentText}>
                        {notif.NotificationText || "No content available"}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </View>
      )}

      {isSearchVisible && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsContent}>
            {search.length > 0 && (
              <Text style={styles.resultsHeader}>
                {filteredList.length} result{filteredList.length !== 1 ? 's' : ''} found
              </Text>
            )}
            {filteredList.length === 0 && search.length > 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>Try a different search term</Text>
              </View>
            ) : (
              filteredList.map((item, idx) => (
                <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { name: item })} key={idx} style={styles.resultItem}>
                  <Text style={styles.resultText}>{item}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  headerContainer: {
    backgroundColor: '#eaf2fb',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e3eaf3',
  },
  header: {
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flex: 1,
    position: 'absolute',
    left: 56,
    right: 56,
    alignItems: 'center',
  },
  // title: {
  //   color: '#3a6ea8',
  //   fontWeight: '500',
  //   fontSize: 18,
  //   letterSpacing: 0.2,
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 22,
  //   paddingVertical: 7,
  //   borderRadius: 22,
  //   overflow: 'hidden',
  //   fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  //   shadowColor: '#b3c6e6',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.06,
  //   shadowRadius: 8,
  // },
  title: {
    color: 'white',
    fontSize:15
  },
  animatedSearchContainer: {
    position: 'absolute',
    left: 56,
    height: 40,
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 0,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    height: 40,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#3a6ea8',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  searchInput: {
    fontSize: 14,
    color: '#333',
    paddingLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
    borderRadius: 20,
    padding: 0,
    backgroundColor: 'transparent',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e3eaf3',
    maxHeight: 300,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsHeader: {
    fontSize: 12,
    color: '#7a8ca3',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e3eaf3',
  },
  resultText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: '#7a8ca3',
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#b3c6e6',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  filterDropdown: {
    position: 'absolute',
    top: 56,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 0,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
    zIndex: 1001,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#eaf2fb',
  },
  notificationsDropdown: {
    position: 'absolute',
    top: 56,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
    zIndex: 2000,
    minWidth: 320,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  notificationsHeader: {
    fontWeight: '500',
    fontSize: 16,
    color: '#3a6ea8',
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  noNotificationsText: {
    color: '#7a8ca3',
    fontSize: 14,
    padding: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  notificationItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e3eaf3',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  notificationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationAppIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eaf2fb',
  },
  notificationHeaderText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#222',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  notificationTypeText: {
    fontSize: 12,
    color: '#7a8ca3',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#7a8ca3',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  notificationContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  notificationLargeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#eaf2fb',
  },
  notificationContentText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.01)',
    zIndex: 1999,
  },
});


export default AppBar;
