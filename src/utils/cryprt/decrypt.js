import CryptoJS from "crypto-js";

export const decrypt = (data) => {
    return CryptoJS.AES.decrypt(data, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
}