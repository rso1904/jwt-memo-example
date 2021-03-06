import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Image = new Schema({
    img : {
        data: Buffer,
        contentType: String,
        convert: String,
        contents: String,
        writer: String,
        hashtags: Array
    }
});

export default mongoose.model('image', Image);