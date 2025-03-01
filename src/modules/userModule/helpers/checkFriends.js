export const areFriends = ({user , friend})=>{

    const userFriends =user.friends.map(id => id.toString());
    const friendFriends =friend.friends.map(id => id.toString());
    
    if(userFriends.includes(friend._id.toString())|| friendFriends.includes(user._id.toString())){
        return true
    }
    return false
}