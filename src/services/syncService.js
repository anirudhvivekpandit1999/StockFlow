import NetInfo from '@react-native-community/netinfo';
import { getUnsyncedInventory, markInventoryAsSynced, insertInventory } from './database';
import axios from 'axios';

const API_BASE_URL = 'https://d7a5-202-160-169-18.ngrok-free.app/api'; // Change to your .NET API base URL

export const syncInventory = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  // 1. Push unsynced local changes to server
  const unsynced = await getUnsyncedInventory();
  if (unsynced.length > 0) {
    try {
      const response = await axios.post(`${API_BASE_URL}/sync/push`, { items: unsynced });
      if (response.status === 200) {
        await markInventoryAsSynced(unsynced.map(i => i.id));
      }
    } catch (e) {
      // handle error
    }
  }

  // 2. Pull new/updated data from server
  try {
    const response = await axios.get(`${API_BASE_URL}/sync/pull`);
    if (response.status === 200 && Array.isArray(response.data.items)) {
      for (const item of response.data.items) {
        await insertInventory({ ...item, synced: 1 });
      }
    }
  } catch (e) {
    // handle error
  }
};
