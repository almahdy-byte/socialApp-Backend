export const globalErrorHandler = (error , req ,res ,next)=>{
    return res.status(error.cause || 500).json({Error: error+" " || 'Something went wrong'});
}