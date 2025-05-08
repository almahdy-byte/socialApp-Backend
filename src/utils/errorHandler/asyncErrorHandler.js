
export const asyncErrorHandler = (fn) => {
    return (req , res , next) => {
        try {
            fn(req, res, next)
        } catch (error) {
            next(new Error(error + " " || 'Something went wrong'  , {cause:501}));
            
        }
    }
}

