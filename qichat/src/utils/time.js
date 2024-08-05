export const formatTime = (date) => {
    var currentDate = new Date();
    var isoDate = new Date(date);

    // Tính khoảng cách thời gian giữa currentDate và isoDate
    var timeDiff = Math.abs(currentDate.getTime() - isoDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Nếu khoảng cách thời gian lớn hơn 1 ngày
    if (diffDays > 1) {
        return diffDays + " days ago";
    }

    // Chuyển thời gian sang múi giờ Việt Nam (UTC+7)
    isoDate.setHours(isoDate.getHours());

    // Lấy giờ và phút từ đối tượng Date
    var hours = isoDate.getHours();
    var minutes = isoDate.getMinutes();

    // Xác định AM hoặc PM
    var ampm = hours >= 12 ? 'PM' : 'AM';

    // Điều chỉnh giờ theo định dạng 12 giờ
    hours = hours % 12;
    hours = hours ? hours : 12; // Nếu hours là 0 thì sẽ hiển thị 12 giờ

    // Định dạng giờ và phút thành chuỗi
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Tạo chuỗi kết quả
    var formattedTime = hours + ':' + minutes + ' ' + ampm;

    return formattedTime;
}


export const tinhSoPhutCham = (isoDateStr) => {
    const targetDate = new Date(isoDateStr);
    const now = new Date();
    const diffInMilliseconds = now - targetDate;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const diffInSeconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

    if (diffInDays > 0) {
        return diffInDays === 1 ? diffInDays + ' day' : diffInDays + ' days'
    }
    if (diffInHours > 0) {
        return diffInHours === 1 ? diffInHours + ' hour' : diffInHours + ' hours'
    }
    if (diffInMinutes > 0) {
        return diffInMinutes === 1 ? diffInMinutes + ' minute' : diffInMinutes + ' minutes'
    }
    if (diffInSeconds > 0) {
        return diffInSeconds === 1 ? diffInSeconds + ' second' : diffInSeconds + ' seconds'
    }
}

export const tinhSoPhutChamIcon = (isoDateStr) => {

    if (!isoDateStr)
        return '0s'

    const targetDate = new Date(isoDateStr);
    const now = new Date();
    const diffInMilliseconds = now - targetDate;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const diffInSeconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

    if (diffInDays > 0) {
        return diffInDays + 'd';
    }
    if (diffInHours > 0) {
        return diffInHours + 'h';
    }
    if (diffInMinutes > 0) {
        return diffInMinutes + 'm';
    }
    if (diffInSeconds > 0) {
        return diffInSeconds + 's';
    }
}


export const formatDateOfBirth = (isoDateStr) => {
    var date = new Date(isoDateStr);

    // Lấy ngày, tháng, năm từ đối tượng Date
    var ngay = date.getDate();
    var thang = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
    var nam = date.getFullYear();

    // Định dạng lại chuỗi ngày/tháng/năm
    var chuoiNgayThangNam = ngay + '/' + thang + '/' + nam;

    return chuoiNgayThangNam;
}