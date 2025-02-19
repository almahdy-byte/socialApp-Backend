import jwt from 'jsonwebtoken';

export const sign = (payload={} , signature =" " ,expiresIn="1w") => {
    return jwt.sign(payload, signature, {expiresIn});
}