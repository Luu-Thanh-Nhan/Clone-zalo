export const handleResizeScreenByNumberOfParticipants = (num) => {
    if (num === 1)
        return '1fr'
    if (num === 2)
        return '1fr 1fr'
    return '1fr 1fr 1fr'
}

export const formatPhoneByFireBase = (phone) => {
    const cleanedNumber = phone.replace(/\D/g, '');
    return `+84 ${cleanedNumber.slice(1, 4)} ${cleanedNumber.slice(4, 7)} ${cleanedNumber.slice(7)}`;
}