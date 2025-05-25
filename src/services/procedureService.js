import { decryptData, encryptData } from "./encryptionDecryptionService";

export async function callStoredProcedure(url,parameters) {
    const encryptedData = encryptData(parameters); 
console.log(encryptedData);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "encryptedData" : encryptedData 
        })
    });

    if (!response.ok) {
        throw new Error('Failed to call stored procedure');
    }

    const encryptedResult = await response.json();
    return decryptData(encryptedResult.encryptedData); 
}