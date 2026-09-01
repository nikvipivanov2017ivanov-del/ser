
реально находятся в файле `server.js`, их нужно удалить. Это Markdown-обёртка, в JavaScript она вызовет ошибку.

### Готовый исправленный `server.js`

```js
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
        const date = safe(data.date);
        const place = safe(data.place);
        const time = safe(data.time);
        const message = safe(data.message);

        // --- РАСЧЕТ СОВМЕСТИМОСТИ ---

        let score = 0;
        const maxScore = 12;

        // 1. Чувства
        if (feelings === "Это великолепно! 🥰") {
            score += 3;
        } else if (feelings === "Очень мило 😳") {
            score += 2;
        } else if (feelings === "Мне нравится статус-код 200 😏") {
            score += 1;
        } else {
            score += 1;
        }

        // 2. Место свидания
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

        // 3. Время встречи
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

        // 4. Длина сообщения
        if (message.length > 20) {
            score += 3;
        } else if (message.length > 0) {
            score += 2;
        }

        // --- ИТОГОВЫЙ ПРОЦЕНТ ---

        let lovePercentage = Math.round((score / maxScore) * 100);

        if (lovePercentage < 30) {
            lovePercentage = 35;
        }

        if (lovePercentage > 100) {
            lovePercentage = 100;
        }

        // --- ВЕРДИКТ ---

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

        // --- СООБЩЕНИЕ В TELEGRAM ---

        const text =
            `💌 <b>НОВЫЙ РАСЧЕТ СОВМЕСТИМОСТИ!</b>\n\n` +
            `👤 <b>Имя:</b> ${escapeHTML(name || "не указано")}\n` +
            `❤️ <b>Чувства:</b> ${escapeHTML(feelings || "не указано")}\n` +
            `📅 <b>Свидание:</b> ${escapeHTML(date || "не указано")}\n` +
            `📍 <b>Место:</b> ${escapeHTML(place || "не указано")}\n` +
            `⏰ <b>Когда:</b> ${escapeHTML(time || "не указано")}\n` +
            `💬 <b>Сообщение:</b> ${escapeHTML(message || "не указано")}\n\n` +
            `📊 <b>РЕЗУЛЬТАТ АНАЛИЗА:</b> ${lovePercentage}%\n` +
            `🔮 <b>Вердикт бэкенда:</b> <i>${escapeHTML(verdict)}</i>`;

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

        // --- ОТВЕТ САЙТУ ---

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
