import axios from "axios";
import { decryptData, encryptData } from "./encryptionDecryptionService";

export async function callStoredProcedure(url, parameters) {
    console.log('Incoming parameters:', parameters);
    if (!parameters) {
        parameters = {};
    }
    const encryptedData = encryptData(parameters); 
    console.log("Request payload:", JSON.stringify({
        "encryptedData": encryptedData 
    }, null, 2));        try {
            const response = await axios.post(url, {
                encryptedData: encryptedData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 10000
            });

            console.log("Response:", response.status, response.data);

            // Handle 400 error responses
            if (response.status === 400) {
                throw new Error(response.data[0]?.Message || 'Bad Request');
            }

            // Handle other non-200 responses
            if (response.status !== 200) {
                throw new Error('Failed to call stored procedure');
            }

            // Only try to decrypt if we have data
            if (response.data && response.data.encryptedData) {
                return decryptData(response.data.encryptedData);
            } else {
                // If we have a message in the response, throw it
                if (response.data && response.data[0] && response.data[0].Message) {
                    throw new Error(response.data[0].Message);
                }
                throw new Error('Invalid response format');
            }
        } catch (error) {
            if (error.response) {
                // The server responded with an error
                console.log('Server Error:', error.response.status, error.response.data);
                if (error.response.data && error.response.data[0]) {
                    throw new Error(error.response.data[0].Message);
                }
            } else if (error.request) {
                // Network error
                console.log('Network Error:', error.message);
                throw new Error('Network connection failed. Please check your internet connection.');
            }
            // Throw the original error if we couldn't handle it specifically
            throw error;
        }
        
    // const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'accept':'*/*'
    //     },
    //     body: JSON.stringify({
    //         "encryptedData" : encryptedData 
    //     })
    // });
    
}