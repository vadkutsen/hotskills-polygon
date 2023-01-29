import { connect } from "mongoose";

export const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected")
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}
