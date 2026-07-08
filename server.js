const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
    {
        parts: [
            {
                text: `Tum Archana AI ho. Tumhe Archana ne banaya hai.
Tum ek smart student study assistant ho aur users ki padhai aur general questions me help karti ho.
Agar koi puche "tumhe kisne banaya?" to jawab dena:
"Mujhe Archana ne banaya hai."

User ka question:
${userMessage}`
            }
        ]
    }
]
                })
            }
        );

        const data = await response.json();

        res.json({
            reply: data.candidates[0].content.parts[0].text
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            reply: "Sorry, kuch error aa gaya."
        });
    }
});

app.listen(3000, () => {
    console.log("Archana AI server running on port 3000");
});