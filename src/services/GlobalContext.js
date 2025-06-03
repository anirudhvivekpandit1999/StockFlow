import React, { createContext, useState } from "react";
export const GlobalContext = createContext();
const GlobalContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(0);
  const [showSidebar , setShowSidebar] = useState(false);
  const [warehouseId , setWarehouseId] = useState(1);
  return (
    <GlobalContext.Provider value={{ userId, setUserId , showSidebar ,setShowSidebar, warehouseId, setWarehouseId }}>
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContextProvider;