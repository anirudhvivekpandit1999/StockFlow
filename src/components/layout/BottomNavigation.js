import React, { useContext, useEffect, useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiServices from '../../services/apiServices';
import { ScrollView } from 'react-native-gesture-handler';
import { GlobalContext } from '../../services/GlobalContext';

const BottomNavigation = ({ onOpen }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Warehouse 1');
  const [warehouseData , setWarehouseData] = useState([]);
  const { setWarehouseId ,roleId} = useContext(GlobalContext);
  useEffect(()=>{
    fetchWarehouse();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWarehouse();
    });

    return unsubscribe;
  },[]);

  async function fetchWarehouse(){
    try {
        const response = await apiServices.getWarehouseNames({RoleId : roleId});
        if (response.Status === 200) {
          console.log('Warehouse names fetched successfully:', JSON.parse(response.Data).map(item => item.WarehouseLocation));
            setWarehouseData(JSON.parse(response.Data));
        } else {
            console.error('Failed to fetch warehouse names:', response.Message);
        }
    } catch (error) {
        console.error('Error fetching warehouse names:', error);
    }
  }

  const handleWarehouseSelect = (warehouse) => {
    setSelectedWarehouse(warehouse.WarehouseLocation);
    setWarehouseId(warehouse.WarehouseId);
    setModalVisible(false);
    console.log('Selected warehouse:', warehouse);
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
    }
  ];

  return (
    <>
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

        <TouchableOpacity onPress={() => setModalVisible(true)}>
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
          <ScrollView style={styles.modalContent}>
            {roleId === 1?warehouseData.map((w, i) => (
              <TouchableOpacity
                key={w.WarehouseId}
                style={styles.option}
                onPress={() => handleWarehouseSelect(w)}
              >
                <Text style={styles.optionText}>{w.WarehouseLocation}</Text>
              </TouchableOpacity>
            )) : <Text>You dont have the ability to change warehouses</Text>}
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000022',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fafdff',
    padding: 18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  option: {
    paddingVertical: 16,
    borderBottomColor: '#e3eaf3',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#3a6ea8',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default BottomNavigation;
