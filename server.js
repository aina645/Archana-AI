const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const question = userMessage.toLowerCase();

        // Fixed identity replies
        if (
            question.includes("tumhe kisne banaya") ||
            question.includes("kisne banaya") ||
            question.includes("who created you") ||
            question.includes("who made you") ||
            question.includes("creator")
        ) {
            return res.json({
                reply: "😊 Namaste! Main Archana AI hoon. Mujhe Archana ne banaya hai."
            });
        }

        if (
            question.includes("tum kaun ho") ||
            question.includes("who are you")
        ) {
            return res.json({
                reply: "😊 Main Archana AI hoon, ek smart AI assistant. Mujhe Archana ne banaya hai aur main padhai, coding aur general questions me aapki help karti hoon."
            });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [
                            {
                                text: `You are Archana AI.

Rules:
- Your name is Archana AI.
- You were created by Archana.
- Never claim that Google or Gemini created you.
- Always introduce yourself as Archana AI.
- You are a smart, friendly and helpful AI assistant.
- Answer in the same language as the user.`
                            }
                        ]
                    },
                    contents: [
                        {
                            parts: [
                                {
                                    text: userMessage
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (
            data.candidates &&
            data.candidates.length > 0 &&
            data.candidates[0].content.parts.length > 0
        ) {
            res.json({
                reply: data.candidates[0].content.parts[0].text
            });
        } else {
            console.log(data);
            res.json({
                reply: "Mujhe abhi jawab dene me thodi dikkat ho rahi hai."
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            reply: "Sorry, kuch error aa gaya."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Archana AI server running on port ${PORT}`);
});