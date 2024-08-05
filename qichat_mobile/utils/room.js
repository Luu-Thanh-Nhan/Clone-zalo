

export const returnImage = (room, currentUser) => {
    if (!room)
        return undefined
    if (room.type === 'Group')
        return room.image
    return room.users?.filter(user => user.fullName !== currentUser.fullName)[0].avatar
}

export const returnName = (room, currentUser) => {
    if (!room)
        return undefined
    if (room.type === 'Group')
        return room.name
    return room.users?.filter(user => user.fullName !== currentUser.fullName)[0].fullName
}

export const returnID = (room, currentUser) => {
    if (!room)
        return undefined
    if (room.type === 'Group')
        return room.name
    return room.users?.filter(user => user.fullName !== currentUser.fullName)[0]._id
}

export const returnRemainingObject = (room, currentUser) => {
    return room?.users?.filter(user => user.fullName !== currentUser.fullName)[0]
}

