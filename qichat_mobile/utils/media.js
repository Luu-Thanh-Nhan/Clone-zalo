import { decode } from 'base-64';
export const base64ToArrayBuffer = (base64) => {
    const binaryString = decode(base64);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    console.log(byteArray.buffer)
    return byteArray.buffer;
};