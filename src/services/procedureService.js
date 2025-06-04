import { decryptData, encryptData } from "./encryptionDecryptionService";

export async function callStoredProcedure(url,parameters) {
    const encryptedData = encryptData(parameters); 
console.log("ln 5",encryptedData);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "encryptedData" : encryptedData 
        })
    });
    console.log("ln 15",response);
    if (!response.ok) {
        throw new Error('Failed to call stored procedure');
    }

    const encryptedResult = await response.json();
    console.log("ln 18",encryptedResult);
    console.log("ln 19",decryptData("168DDB5A56DC76B15E57746B2BF461F83ACBE58E142878899B0B8780480258E3CFD01F9EDAEA0841B3AEB900748EEB977FDC9079CF832D8A8B978BFA39EECE2DD1B59EC68B013CB0EA440F43D163A5F1D8349C093F880BEFA82497602217BD4862260A2C81476886AA0FE29CF93C77C34F11A2E73EF4FC9C0E7690B915017227B08F8BE1757D24C56F3653855A693BEBFC8D700590D5833CBE9ACC68D7E0EEE41AD728C1FCB5B04913D900A7FE3E13836B830343AE759676CDD34A29E0E31FE775B08F2D163B0EB7275D5AFFC599D7E9AB0A27D3FB2FC7CF8A8391541F7EEE9C1F0ABB2FFED55C131DD7040C3EC84C14"));
    return decryptData(encryptedResult.encryptedData); 
}