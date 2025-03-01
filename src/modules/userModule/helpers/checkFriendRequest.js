export const checkFriendRequest = ({user , friend})=>{
    
    const userFriendRequests =user.friendRequests.map(id => id.toString());
    const friendFriendRequests =friend.friendRequests.map(id => id.toString());
                                            
    if(userFriendRequests.includes(friend._id.toString())|| friendFriendRequests.includes(user._id.toString())){
        return true
    }
    return false
}