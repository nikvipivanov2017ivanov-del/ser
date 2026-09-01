const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = "8917405371:AAECfn7xNP86pZ8rlFlI28YGcaWTI1qDm84";
const CHAT_ID = "7610345900";

app.post("/api/send", async (req, res) => {
    try {
        const data = req.body;
        
        const text = `💌 *Новая симпатия!*\n\n` +
                     `👤 *Имя:* ${data.name}\n` +
                     `❤️ *Чувства:* ${data.feelings}\n` +
                     `📅 *Свидание:* ${data.date}\n` +
                     `📍 *Формат:* ${data.place}\n` +
                     `⏰ *Когда:* ${data.time}\n` +
                     `💬 *Сообщение:* ${data.message || "не указано"}`;

        // Исправлено: теперь переменная BOT_TOKEN подставляется правильно
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: "Markdown" // Чтобы текст с астерисками (*) был жирным
            })
        });

        const result = await response.json();
        
        if (!result.ok) {
            return res.status(500).json({ error: result });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Сервер запущен: http://localhost:3000");
});
