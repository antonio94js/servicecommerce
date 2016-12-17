import Common from '../utils/Common';

const processImage = (ImageData) => {
    let [none,mimeType,base64] = ImageData.file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if(!_isValidMime(mimeType))
        return false;

    return [mimeType,new Buffer(base64,'base64'),ImageData];

}

const checkObjectType = (ObjectType) => ['user','product'].includes(ObjectType);


const _isValidMime = (mimeType) => {
    let regex = /(jpe?g|png|gif|bmp)$/i;
    let [type,format] = mimeType.split("/");
    return regex.test(format);
}

export default {processImage,checkObjectType};
