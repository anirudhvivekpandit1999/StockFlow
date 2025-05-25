import { addNewFormEndpoint, stockInAndOutInboundOutboundMovementController, url } from "./globals";
import { callStoredProcedure } from "./procedureService";

async function addNewForm(values) {
      console.log(values)
      console.log(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`);
    const result = await callStoredProcedure(`${url}${stockInAndOutInboundOutboundMovementController}${addNewFormEndpoint}`, values);
    return result;
}

const apiServices = {
    addNewForm
};

export default apiServices;