import { GraphQLID, GraphQLObjectType, GraphQLScalarType, GraphQLString } from "graphql";

export const postType = new GraphQLObjectType({
    name:'postType' , 
    fields:{ 
        title:{type:GraphQLString},
        body:{type:GraphQLString},
        _id:{type:GraphQLID}
}
})
export const postTypeRes = new GraphQLObjectType({
    name:'postTypeRes' , 
    fields:{ 
        message:{type:GraphQLString},
        post:{type:postType}
}
})