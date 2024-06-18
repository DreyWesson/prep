import mongoose from 'mongoose';

export const connectNOSQL = async () => {
    try {
        const uri = process.env.NOSQL_URI;
        await mongoose.connect(uri, {});
    } catch (error) {
        console.error("Error: ", error);
    }
}
