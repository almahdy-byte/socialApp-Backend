import { asyncErrorHandler } from "../errorHandler/asyncErrorHandler.js";
import { GoogleGenerativeAI } from "@google/generative-ai"


export const AI = async(message , next) => {
    const prompt = `
    You are an intelligent assistant. Your task is to respond to user messages in a clear, professional, and helpful manner.
    
    Analyze the message provided below, and generate an appropriate and relevant reply. The response **must be in the same language** as the original message (e.g., respond in Arabic if the message is in Arabic, respond in English if the message is in English, and so on).
    
    If the message is unclear or contains ambiguous language, kindly ask the user for clarification.
    
    Keep the response direct, informative, and avoid unnecessary introductions or repetition.

    and chat like human and chatgpt .
    
    and try to skip grammer and spelling mistakes.

    and try to answer the message if user send less information.

    and try to answer the message if user send more information.
    
    The message to respond to is:
    """
    ${message}
    """
    `;
    console.log(message);
    

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
try {
    const result = await model.generateContent(prompt);
    console.log(result.response.candidates[0].content.parts[0].text);
    
    const AIMessage = result.response.candidates[0].content.parts[0].text;
    return AIMessage;

} catch (error) {
    throw new Error(`Error calling Gemini API: ${error.response?.data || error.message}`);

}
}
