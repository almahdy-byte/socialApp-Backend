import { connect } from "mongoose"

export const connectToDB = async () => {
    try {
        await connect(process.env.DB_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting to DB", error);
    }
}