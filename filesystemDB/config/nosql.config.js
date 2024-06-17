import mongoose from 'mongoose';

export const connectNOSQL = async () => {
    try {
        const uri = process.env.NOSQL_DB;

        await mongoose.connect(process.env.NOSQL_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("Error: ", error);
    }
}