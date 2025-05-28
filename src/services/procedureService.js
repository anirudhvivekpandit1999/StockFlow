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
    console.log("E3B64FE72A7DC4781028B5BB2C2BF3A8D36DF471B9DB1D8CC91DA08AD75E6A68C98581FE8E3D45DCACA7324F7BBFDBC3D49A8BA789547BF49A9A1279B3823E5BD5652B1535BC60E02AA2C5ABC4190B8E");
    return decryptData(encryptedResult.encryptedData); 
}