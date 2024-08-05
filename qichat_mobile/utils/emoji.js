import { View } from "react-native-animatable"

export const emojiStatus = {
    likelike: '❤️',
    like: '👍',
    sad: '😥',
    wow: '😮',
    angry: '😡',
    smile: '🤣'
}


export const emoji = (status) => {
    switch (status) {
        case 'likelike':
            return emojiStatus.likelike
        case 'like':
            return emojiStatus.like
        case 'sad':
            return emojiStatus.sad
        case 'wow':
            return emojiStatus.wow
        case 'angry':
            return emojiStatus.angry
        case 'smile':
            return emojiStatus.smile
    }
}
