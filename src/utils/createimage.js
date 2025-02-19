import cloudinary from './multer/cloudinary.js';
export const createImage =async({img , folder}) =>{
    let image;   
    log 
    if(img){
        const {public_id , secure_url} = await cloudinary.uploader.upload(img.path ,
            {folder})
            image = {public_id , secure_url}
    }
    return image
}
