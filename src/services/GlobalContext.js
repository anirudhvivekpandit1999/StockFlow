import React, { createContext, useState } from "react";
export const GlobalContext = createContext();
const GlobalContextProvider = ({ children }) => {
  const [userId, setUserId] = useState(0);
  const [showSidebar , setShowSidebar] = useState(false);
  const [warehouseId , setWarehouseId] = useState(1);
  const [roleId , setRoleId] = useState(0);
  return (
    <GlobalContext.Provider value={{ userId, setUserId , showSidebar ,setShowSidebar, warehouseId, setWarehouseId ,roleId ,setRoleId}}>
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContextProvider;