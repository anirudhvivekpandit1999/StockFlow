import React, { useContext, useEffect, useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiServices from '../../services/apiServices';
import { ScrollView } from 'react-native-gesture-handler';
import { GlobalContext } from '../../services/GlobalContext';

const BottomNavigation = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { setWarehouseId, roleId } = useContext(GlobalContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Warehouse 1');
  const [warehouseData, setWarehouseData] = useState([]);

  useEffect(() => {
    fetchWarehouse();
    const unsubscribe = navigation.addListener('focus', fetchWarehouse);
    return unsubscribe;
  }, []);

  const fetchWarehouse = async () => {
    try {
      const response = await apiServices.getWarehouseNames({ RoleId: roleId });
      if (response.Status === 200) {
        setWarehouseData(JSON.parse(response.Data));
      } else if (response.Status === 202){
        setWarehouseData([])
      }
      else{
        console.error('Failed to fetch warehouse names:', response.Message);
      }
    } catch (error) {
      console.error('Error fetching warehouse names:', error);
    }
  };

  const handleWarehouseSelect = (warehouse) => {
    setSelectedWarehouse(warehouse.WarehouseLocation);
    setWarehouseId(warehouse.WarehouseId);
    setModalVisible(false);
  };

  const actions = [
    {
      key: 1,
      icon: 'home',
      onPress: () => navigation.navigate('dashboard'),
    },
    {
      key: 2,
      icon: 'arrow-down-bold',
      onPress: () => navigation.navigate('RecievedOrder'),
    },
    {
      key: 3,
      icon: 'clipboard',
      onPress: () => navigation.navigate('DispatchedOrders'),
    },
  ];

  return (
    <>
      <Appbar style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        {actions.map((action) => (
          <Appbar.Action
            key={action.key}
            icon={action.icon}
            onPress={action.onPress}
            color="white"
            style={styles.navButton}
          />
        ))}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.navButton}>
          <Icon name="warehouse" size={26} color="white" />
        </TouchableOpacity>
      </Appbar>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Warehouse</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {roleId === 1 ? (
                warehouseData.map((w) => (
                  <TouchableOpacity
                    key={w.WarehouseId}
                    style={styles.option}
                    onPress={() => handleWarehouseSelect(w)}
                  >
                    <Text style={styles.optionText}>{w.WarehouseLocation}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.disabledText}>You don't have the ability to change warehouses</Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#3a6ea8',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#e3eaf3',
  },
  navButton: {
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderColor: '#e3eaf3',
    borderWidth: 1,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3a6ea8',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e3eaf3',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#3a6ea8',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  disabledText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    paddingVertical: 20,
  },
});

export default BottomNavigation;
