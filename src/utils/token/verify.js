import jwt from 'jsonwebtoken';
export const verify = async(token , signature) => {
    return await jwt.verify(token, signature);
}