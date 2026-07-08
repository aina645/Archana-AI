const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                                    text: `You are Archana AI, a helpful AI assistant specially designed for students. Answer clearly and simply.

User: ${message}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            return res.status(400).json(data);
        }

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response.";

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            reply: "Server Error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Archana AI running at http://localhost:${PORT}`);
});