

export const create = async({model , date={}}) => {
const dictionary = new model(date);
return await dictionary.save();
}

export const createMany = async({model , data}) => {
    return await model.insertMany(data);
}

export const findOne = async({model , filter = {} , populate =[] , select =''}) => {
    const data = await model.findOne(filter).select(select).populate(populate);
    return data;
}

export const findById = async({model , id , populate = [] , select =''}) => {
    const data = await model.findById(id).select(select).populate(populate);
    return data;
}

export const findOneAndUpdate = async({model , filter ={} , update ={} , options ={}  , populate = [] , select = ''}) => {
    const data = await model.findOneAndUpdate(filter , update , options).select(select).populate(populate);
    await data.save();
    return data;
}

export const findByIdAndUpdate = async({model , id={} , update ={} , options ={}  , populate = [] , select = ''}) => {
    const data = await model.findByIdAndUpdate(id , update , options).select(select).populate(populate);
     await data.save();
    return data;
}

export const find = async({model , filter , select ="" , populate =[] , skip = 0 , limit = 20}) => {
    const data = await model.find(filter).select(select).populate(populate).skip(skip).limit(limit);
    return data;
}
export const update = async({model ,  select = "" , options={} ,data = {} , populate=[]})=>{
return model.update(data).select(select).populate(populate);

}
export const deleteOne = async({model , filter}) => await model.findOneAndDelete(filter);

export const deleteById = async({model , id}) => {
    const result = await model.deleteOne({_id:id})
    return result
}

