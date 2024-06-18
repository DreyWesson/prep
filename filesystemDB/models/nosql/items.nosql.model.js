import mongoose, {Schema} from 'mongoose';

const ItemSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
});

export default mongoose.model('Item', ItemSchema);