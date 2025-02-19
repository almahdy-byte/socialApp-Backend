import CryptoJS from "crypto-js";
export const encrypt = (data) => {
    return CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();
}