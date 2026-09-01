const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
    console.error("❌ Не заданы BOT_TOKEN или CHAT_ID");
    process.exit(1);
}

function safe(value) {
    return String(value ?? "").trim();
}

function escapeHTML(value) {
    return safe(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

app.post("/api/send", async (req, res) => {
    try {
        const data = req.body || {};

        const name = safe(data.name);
        const feelings = safe(data.feelings);
        const zodiac = safe(data.zodiac);
        const date = safe(data.date);
        const place = safe(data.place);
        const time = safe(data.time);
        const message = safe(data.message);

        let score = 0;
        const maxScore = 12;

        if (feelings === "Это великолепно! 🥰") {
            score += 3;
        } else if (feelings === "Очень мило 😳") {
            score += 2;
        } else if (feelings === "Мне нравится статус-код 200 😏") {
            score += 1;
        } else {
            score += 1;
        }

        const placeLower = place.toLowerCase();

        if (
            placeLower.includes("кафе") ||
            placeLower.includes("ресторан")
        ) {
            score += 3;
        } else if (
            placeLower.includes("дом") ||
            placeLower.includes("кино")
        ) {
            score += 2;
        } else {
            score += 1;
        }

        const timeLower = time.toLowerCase();

        if (
            timeLower.includes("сегодня") ||
            timeLower.includes("сейчас")
        ) {
            score += 3;
        } else if (
            timeLower.includes("суббот") ||
            timeLower.includes("выходн")
        ) {
            score += 2;
        } else {
            score += 1;
        }

        if (message.length > 20) {
            score += 3;
        } else if (message.length > 0) {
            score += 2;
        }

        let lovePercentage = Math.round((score / maxScore) * 100);

        if (lovePercentage < 30) {
            lovePercentage = 35;
        }

        if (lovePercentage > 100) {
            lovePercentage = 100;
        }

        let verdict;

        if (lovePercentage >= 85) {
            verdict =
                "🔥 Идеальное совпадение! Ваши биоритмы и планы на свидание синхронизированы на максимум. Срочно бегите на встречу!";
        } else if (lovePercentage >= 60) {
            verdict =
                "💞 Отличная совместимость! У вас очень похожие взгляды, искра определенно есть. Осталось обсудить детали.";
        } else {
            verdict =
                "⚡ Противоположности притягиваются! Ваши ответы очень уникальны, а значит, свидание будет максимально интересным и необычным.";
        }

        const text =
            `🔮 <b>АСТРОЛОГИЧЕСКИЙ АНАЛИЗ СОВМЕСТИМОСТИ</b>\n\n` +
            `👤 <b>Странник:</b> ${escapeHTML(name || "неизвестно")}\n` +
            `🏹 <b>Знак зодиака:</b> ${escapeHTML(zodiac || "не указан")}\n` +
            `🌟 <b>Энергия сердца:</b> ${escapeHTML(feelings || "не указана")}\n` +
            `✨ <b>Идеальное свидание:</b> ${escapeHTML(date || "не указано")}\n` +
            `🗺️ <b>Место встречи:</b> ${escapeHTML(place || "не указано")}\n` +
            `◷ <b>Когда сойдутся звезды:</b> ${escapeHTML(time || "не указано")}\n` +
            `🔐 <b>Тайное послание:</b> ${escapeHTML(message || "скрыто")}\n\n` +
            `📊 <b>МАГИЧЕСКИЙ РЕЗУЛЬТАТ:</b> ${lovePercentage}%\n\n` +
            `🔮 <b>Вердикт звезд:</b> ${escapeHTML(verdict)}`;

        const url =
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: "HTML"
            })
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
            console.error("Ошибка Telegram:", result);

            return res.status(500).json({
                success: false,
                error: "Не удалось отправить сообщение в Telegram"
            });
        }

        res.json({
            success: true,
            percentage: lovePercentage,
            verdict: verdict
        });

    } catch (error) {
        console.error("Ошибка сервера:", error);

        res.status(500).json({
            success: false,
            error: "Внутренняя ошибка сервера"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});
