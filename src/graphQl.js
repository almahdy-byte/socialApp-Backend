import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { postMutation } from "./modules/postModule/post.graphQl.js";


export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:"Query" , 
        fields:{
            hello:{
                type:GraphQLString,
                resolve:function(){
                    return 'QUERY GQL'
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name:'Mutation',
        fields:{
            ...postMutation
        }
    })

})