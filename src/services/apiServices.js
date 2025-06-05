import { decryptData } from "./encryptionDecryptionService";
import { addNewFormEndpoint, clientsAndSuppliersController, dashboardController, getAllClientsAndSuppliersDataEndpoint, getAnalysisEndpoint, getInventoryDetailsEndpoint, getInventoryListEndpoint, getProductNameEndpoint, getSearchedListEndpoint, getSideBarDataEndpoint, getStockFlowDataEndpoint, getWarehouseNamesEndpoint, inventoryManagementController, loginEndpoint, reportsAndLogsController, searchBarAndFilterFunctionalityController, signUpEndpoint, stockInAndOutInboundOutboundMovementController, testReportDataEndpoint, url, userAuthenticationAndRoleManagementController, warehouseLocationsController } from "./globals";
import { callStoredProcedure } from "./procedureService";

async function addNewForm(values) {
  console.log(values)
  console.log(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`);
  const result = await callStoredProcedure(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`, values);
  return result;
}

async function getStockFlowData(values) {
  console.log(values)
  console.log(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`);
  const result = await callStoredProcedure(`${url}${stockInAndOutInboundOutboundMovementController}${getStockFlowDataEndpoint}`, values);
  return result;
}

async function getSideBarData() {
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

async function signUp(values) {
  console.log(values);
  const result = await callStoredProcedure(`${url}${userAuthenticationAndRoleManagementController}${signUpEndpoint}`, values);
  return result;
}

async function login(values) {
  console.log(values);
  const result = await callStoredProcedure(`${url}${userAuthenticationAndRoleManagementController}${loginEndpoint}`, values);
  console.log(decryptData("E3B64FE72A7DC4781028B5BB2C2BF3A8D36DF471B9DB1D8CC91DA08AD75E6A68C98581FE8E3D45DCACA7324F7BBFDBC3D49A8BA789547BF49A9A1279B3823E5BD5652B1535BC60E02AA2C5ABC4190B8E"));
  return result;
}

async function getAnalysis(values) {
  const result = await callStoredProcedure(`${url}${dashboardController}${getAnalysisEndpoint}`, values)
  return result[0];
}

async function getInventoryList(values) {
  const result = await callStoredProcedure(`${url}${inventoryManagementController}${getInventoryListEndpoint}`, values);
  return result[0];
}

async function getInventoryDetails(values) {
  const result = await callStoredProcedure(`${url}${inventoryManagementController}${getInventoryDetailsEndpoint}`, values);
  return result[0];
}

async function getSearchedList(values) {
  const result = await callStoredProcedure(`${url}${searchBarAndFilterFunctionalityController}${getSearchedListEndpoint}`, values);
  return result[0];
}

async function getWarehouseNames() {
  const result = await callStoredProcedure(`${url}${warehouseLocationsController}${getWarehouseNamesEndpoint}`, {});
  return result[0];
}
async function testReportData(values) {
  const result = await callStoredProcedure(`${url}${reportsAndLogsController}${testReportDataEndpoint}`, values);
  return result;
}

async function getAllClientsAndSuppliersData(values) {
  const result = await callStoredProcedure(`${url}${clientsAndSuppliersController}${getAllClientsAndSuppliersDataEndpoint}`, values);
  return result[0];
}



const apiServices = {
  addNewForm,
  getStockFlowData,
  getSideBarData,
  getProductName,
  signUp,
  login,
  getAnalysis,
  getInventoryList,
  getInventoryDetails,
  getSearchedList,
  getWarehouseNames,
  testReportData,
  getAllClientsAndSuppliersData
};

export default apiServices;