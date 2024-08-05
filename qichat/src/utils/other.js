export function shuffleArray(array) {
    for (let i = array?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export const checkBlock = (currentUser, user) => {
    if (currentUser.friends?.map(item => item._id).includes(user?._id) && user.friends?.map(item => item._id).includes(currentUser._id)) {
        if (currentUser.friends.filter(item => item._id === user._id)[0].block === true)
            return `You has blocked ${user.fullName}`
        if (user.friends.filter(item => item._id === currentUser._id)[0].block === true)
            return `${user.fullName} has blocked you`
    }
    return null
}

export function secondsToHms(seconds) {
    var hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 360000) / 6000);
    const secondsRemain = Math.floor((seconds % 6000) / 100);

    var hoursString = (hours < 10) ? "0" + hours : hours;
    var minutesString = (minutes < 10) ? "0" + minutes : minutes;
    var secondsString = (secondsRemain < 10) ? "0" + secondsRemain : secondsRemain;

    return minutesString + ":" + secondsString;
}

export function formatElapsedTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

export function concatenateArrayBuffers(buffer1, buffer2) {
    // Tạo DataView từ buffer1 để truy cập dữ liệu
    const dataView1 = new DataView(buffer1);
    // Tạo DataView từ buffer2 để truy cập dữ liệu
    const dataView2 = new DataView(buffer2);

    // Tính toán kích thước của ArrayBuffer mới
    const totalLength = buffer1.byteLength + buffer2.byteLength;

    // Tạo một ArrayBuffer mới có kích thước bằng tổng kích thước của cả hai ArrayBuffer
    const concatenatedBuffer = new ArrayBuffer(totalLength);
    // Tạo DataView từ ArrayBuffer mới để ghi dữ liệu vào đó
    const concatenatedDataView = new DataView(concatenatedBuffer);

    // Sao chép dữ liệu từ buffer1 vào ArrayBuffer mới
    for (let i = 0; i < buffer1.byteLength; i++) {
        concatenatedDataView.setUint8(i, dataView1.getUint8(i));
    }

    // Sao chép dữ liệu từ buffer2 vào ArrayBuffer mới, bắt đầu từ vị trí sau khi sao chép buffer1
    for (let i = 0; i < buffer2.byteLength; i++) {
        concatenatedDataView.setUint8(buffer1.byteLength + i, dataView2.getUint8(i));
    }

    // Trả về ArrayBuffer mới đã được ghép
    return concatenatedBuffer;
}