import CryptoJS from "crypto-js";

const secretKey = "qwertyuiopasdfghjklzxcvbnm123456"; 
const iv = "1234567890123456"; 

export function encryptData(data) {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Hex); 
}

export function decryptData(encryptedHex) {
    const encryptedBytes = CryptoJS.enc.Hex.parse(encryptedHex);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedBytes },
        CryptoJS.enc.Utf8.parse(secretKey),
        {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)); 
}
