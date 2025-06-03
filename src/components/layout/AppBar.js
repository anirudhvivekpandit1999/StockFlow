import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, View, Text, Animated, Dimensions } from 'react-native';
import { Appbar, Searchbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiServices from '../../services/apiServices';
import { use } from 'react';
import { GlobalContext } from '../../services/GlobalContext';

const { width } = Dimensions.get('window');

const dummyList = [
  'Apple',
  'Banana',
  'Orange',
  'Grapes',
  'Pineapple',
  'Mango',
  'Strawberry',
  'Blueberry',
  'Watermelon',
  'Kiwi',
];

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
  const [dummyList , setDummyList] = useState([]);
  const {userId , warehouseId} = useContext(GlobalContext);
  useEffect(()=>{
    getDummyList();
  }, [filter])
  async function getDummyList(){

    const result = await apiServices.getSearchedList({StockStatus : filter , UserId : userId , WarehouseId : warehouseId})
    console.log("Dummy List Data: ", (JSON.parse(result.Data)).map(item => item.ProductName));
    setDummyList((JSON.parse(result.Data)).map(item => item.ProductName));
  }
  const navigation = useNavigation();

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
    if (onSearchChange) {
      onSearchChange(query);
    }
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

  return (
    <View style={styles.container}>
      <View style={[
        styles.headerContainer,
        {
          paddingTop: insets.top,
          backgroundColor: theme.colors.primary,
        }
      ]}>
        <Appbar.Header
          style={[
            styles.header,
            {
              backgroundColor: 'transparent',
              height: 56,
              paddingTop: 0,
            }
          ]}
        >
          {showBack ? (
            <Appbar.BackAction 
              onPress={onBackPress} 
              color="white"
              style={styles.actionButton}
            />
          ) : (
            <Appbar.Action 
              icon="menu" 
              onPress={onMenuPress} 
              color="white"
              style={styles.actionButton}
            />
          )}

          <Animated.View 
            style={[
              styles.titleContainer,
              { opacity: titleOpacity }
            ]}
          >
            <Appbar.Content 
              title={title} 
              titleStyle={styles.title} 
            />
          </Animated.View>

          {isSearchVisible && (
            <Animated.View 
              style={[
                styles.animatedSearchContainer,
                { width: searchBarWidth }
              ]}
            >
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
                <TouchableOpacity onPress={() => navigation.navigate('ProductDetails',{name : 'Laptop'})} key={idx} style={styles.resultItem}>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    position: 'absolute',
    left: 56,
    right: 56,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  animatedSearchContainer: {
    position: 'absolute',
    left: 56,
    height: 40,
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    height: 40,
  },
  searchInput: {
    fontSize: 14,
    color: '#333',
    paddingLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 5,
    borderRadius: 20,
    padding: 5
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsHeader: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  filterDropdown: {
    position: 'absolute',
    top: 56,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1001,
    minWidth: 140,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filterOptionSelected: {
    backgroundColor: '#f0e9ff',
  },
});

export default AppBar;