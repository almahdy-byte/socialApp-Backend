import bcrypt from 'bcrypt';
export const hash = (password) => bcrypt.hashSync(password,Number(process.env.HASH_ROUNDS));