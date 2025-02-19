import { GraphQLString } from "graphql";
import { createPost } from "./post.graphQl.controller.js";
import { postType, postTypeRes } from "./post.graphQl.types.js";

export const postMutation = {
    createPost:{
        type:postTypeRes,
        args:{
            title:{type:GraphQLString},
            body:{type:GraphQLString},
            authorization:{type:GraphQLString}
        },
        resolve:createPost
    }
}