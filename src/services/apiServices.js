import { addNewFormEndpoint, getProductNameEndpoint, getSideBarDataEndpoint, getStockFlowDataEndpoint, stockInAndOutInboundOutboundMovementController, url } from "./globals";
import { callStoredProcedure } from "./procedureService";

async function addNewForm(values) {
      console.log(values)
      console.log(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`);
    const result = await callStoredProcedure(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`, values);
    return result;
}

async function getStockFlowData() {
      
      console.log(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`);
    const result = await callStoredProcedure(`${url}${stockInAndOutInboundOutboundMovementController}${getStockFlowDataEndpoint}`, {});
    return result;
}

async function getSideBarData () {
  console.log(`${url}${stockInAndOutInboundOutboundMovementController}${getSideBarDataEndpoint}`);
    const result = await callStoredProcedure(`${url}${stockInAndOutInboundOutboundMovementController}${getSideBarDataEndpoint}`, {});
    return result;
}

async function getProductName(values) {
      console.log(values)
      console.log(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`);
    const result = await callStoredProcedure(`${url}${stockInAndOutInboundOutboundMovementController}${getProductNameEndpoint}`, values);
    return result;
}

const apiServices = {
    addNewForm,
    getStockFlowData,
    getSideBarData,
    getProductName
};

export default apiServices;