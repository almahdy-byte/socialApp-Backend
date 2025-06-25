import { findOne } from "../../DB/dbService.js";
import userModel, { Roles } from "../../DB/models/user.model.js";
import { verify } from "./verify.js";

export const tokenTypes = {
    access: 'access',
    refresh: 'refresh'
};
Object.freeze(tokenTypes);

export const decodeToken = async ({ authorization, type = tokenTypes.access, next }) => {
    if (!authorization)
        return next(new Error('please send token'));

    const parts = authorization.split(" ");
    if (parts.length !== 2) return next(new Error('Invalid token format'));
    
    
    const [barer, token] = parts;
    if (!barer || !token) return next(new Error('please send token'));
    

    
    let accessSignature, refreshSignature;
    
    switch (barer) {
        case Roles.Admin:
            accessSignature = process.env.ADMIN_ACCESS_TOKEN;
            refreshSignature = process.env.ADMIN_REFRESH_TOKEN;
            break;
        case Roles.User:
            accessSignature = process.env.USER_ACCESS_TOKEN;
            refreshSignature = process.env.USER_REFRESH_TOKEN;
            break;
        default:
            return next(new Error('Invalid role'));
    }

    let sign = type === tokenTypes.access ? accessSignature : refreshSignature;

    if (!sign) return next(new Error('Token signature is missing'));

    try {
        const decoded = await verify(token, sign);
        const user = await userModel.findOne({_id : decoded.id, isConfirmed: true});
        
        if (!user) return next(new Error('Invalid token'));

        return { user, accessSignature };
    } catch (error) {
        return next(new Error('Token verification failed'));
    }
};


export const graphDecodeToken = async ({ authorization, type = tokenTypes.access}) => {
    if (!authorization) throw new Error('please send token');

    const parts = authorization.split(" ");
    if (parts.length !== 2) throw new Error('Invalid token format');

    const [barer, token] = parts;
    if (!barer || !token) throw new Error('please send token');

    let accessSignature, refreshSignature;

    switch (barer) {
        case Roles.Admin:
            accessSignature = process.env.ADMIN_ACCESS_TOKEN;
            refreshSignature = process.env.ADMIN_REFRESH_TOKEN;
            break;
        case Roles.User:
            accessSignature = process.env.USER_ACCESS_TOKEN;
            refreshSignature = process.env.USER_REFRESH_TOKEN;
            break;
        default:
            return next(new Error('Invalid role'));
    }

    let sign = type === tokenTypes.access ? accessSignature : refreshSignature;

    if (!sign) throw new Error('Token signature is missing');

    try {
        const decoded = await verify(token, sign);
        const user = await findOne({
            model: userModel,
            filter: { _id: decoded.id, isConfirmed: true }
        });
        if (!user) throw new Error('Invalid token');
        return { user, accessSignature };
    } catch (error) {
        throw new Error('Token verification failed');
    }
};