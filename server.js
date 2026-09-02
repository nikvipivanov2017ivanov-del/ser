const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const MY_ZODIAC = "стрілець";

app.post("/api/send", async (req, res) => {
    try {
        const data = req.body || {};

        const name = String(data.name || "").trim();
        const zodiac = String(data.zodiac || "").toLowerCase().trim();
        const feelings = String(data.feelings || "").trim();
        const date = String(data.date || "").trim();
        const place = String(data.place || "").trim();
        const time = String(data.time || "").trim();
        const message = String(data.message || "").trim();

        if (!BOT_TOKEN || !CHAT_ID) {
            return res.status(500).json({
                error: "BOT_TOKEN или CHAT_ID не настроены в Render"
            });
        }

        if (!name) {
            return res.status(400).json({
                error: "Не указано имя"
            });
        }

        let score = 0;
        const maxScore = 17;

        let zodiacBonus = 0;
        let zodiacVerdict = "";

        // =========================
        // ЗОДИАК
        // =========================

        if (zodiac === MY_ZODIAC) {
            zodiacBonus = 5;

            zodiacVerdict =
                "Два Стрільця! Це вибух адреналіну, спільні пригоди та абсолютна свобода. Ви бачите один одного наскрізь! 🏹🔥";

        } else if (["лев", "львів", "овен"].includes(zodiac)) {
            zodiacBonus = 5;

            zodiacVerdict =
                "Стихія Вогню! Максимальна пристрасть, спільні безумства та ідеальне розуміння без зайвих слів. 💥🦁";

        } else if (
            [
                "близнецы",
                "близнюки",
                "весы",
                "терези",
                "водолей",
                "водолій"
            ].includes(zodiac)
        ) {
            zodiacBonus = 4;

            zodiacVerdict =
                "Вогонь і Повітря! Повітря роздмухує ваше полум'я. Разом вам ніколи не буде нудно — ідеальний інтелектуальний зв'язок. 🌬️✨";

        } else if (
            [
                "телец",
                "тілець",
                "дева",
                "діва",
                "козерог",
                "козеріг"
            ].includes(zodiac)
        ) {
            zodiacBonus = 2;

            zodiacVerdict =
                "Земні знаки прагнуть стабільності, а Стрілець — свободи. Потрібен час для притирки, але союз може бути дуже міцним. 🏔️";

        } else if (
            [
                "рак",
                "скорпион",
                "скорпіон",
                "рыбы",
                "риби"
            ].includes(zodiac)
        ) {
            zodiacBonus = 1;

            zodiacVerdict =
                "Вогонь і Вода. Глибокі почуття та штормові емоції. Вода може загасити ваш запал, але магнетизм між вами неймовірний. 🌊";

        } else {
            zodiacBonus = 2;

            zodiacVerdict =
                "Зірки дивляться на ваш союз із цікавістю. Магія кохання сильніша за будь-які гороскопи! 🌌";
        }

        score += zodiacBonus;

        // =========================
        // ЭНЕРГИЯ
        // =========================

        if (feelings === "Влюблённая энергия 💗") {
            score += 3;
        } else if (feelings === "Загадочная энергия 🔮") {
            score += 3;
        } else if (feelings === "Авантюрная энергия ⚡") {
            score += 2;
        } else if (feelings === "Спокойная энергия 🌙") {
            score += 2;
        } else if (feelings === "Мне нравится статус-код 200 😏") {
            score += 1;
        }

        // =========================
        // МЕСТО
        // =========================

        const placeLower = place.toLowerCase();

        if (
            placeLower.includes("кафе") ||
            placeLower.includes("ресторан") ||
            placeLower.includes("кино")
        ) {
            score += 3;
        } else if (
            placeLower.includes("космос") ||
            placeLower.includes("звезд") ||
            placeLower.includes("неб")
        ) {
            score += 3;
        } else {
            score += 2;
        }

        // =========================
        // ВРЕМЯ
        // =========================

        const timeLower = time.toLowerCase();

        if (
            timeLower.includes("сегодня") ||
            timeLower.includes("сейчас") ||
            timeLower.includes("всегда")
        ) {
            score += 3;
        } else {
            score += 1;
        }

        // =========================
        // ТАЙНОЕ СООБЩЕНИЕ
        // =========================

        if (message.length > 15) {
            score += 3;
        } else if (message.length > 0) {
            score += 2;
        }

        // =========================
        // ПРОЦЕНТ
        // =========================

        let lovePercentage = Math.round(
            (score / maxScore) * 100
        );

        if (lovePercentage < 35) {
            lovePercentage = 45;
        }

        if (lovePercentage > 100) {
            lovePercentage = 100;
        }

        // =========================
        // ВЕРДИКТ
        // =========================

        let finalVerdict = "";

        if (lovePercentage >= 85) {
            finalVerdict =
                "✨ Всесвіт ликує! Ваша астрологічна та душевна гармонія бездоганна. Ви створені один для одного! 🌌";

        } else if (lovePercentage >= 65) {
            finalVerdict =
                "🔮 Магія діє! Знаки зодіаку прихильні до вас, а енергії притягуються. Вам обов'язково треба зустрітися! 🧭";

        } else {
            finalVerdict =
                "🌙 Таємничий союз! Ви народилися під різними сузір'ями, але саме протилежності створюють найсильніше тяжіння. ✨";
        }

        // =========================
        // TELEGRAM
        // =========================

        const text =
`🔮 *АСТРОЛОГИЧЕСКИЙ АНАЛИЗ СОВМЕСТИМОСТИ*

👤 *Странник:* ${name}
🏹 *Знак зодиака:* ${data.zodiac || "не указан"}
🌟 *Энергия сердца:* ${feelings || "не указана"}
✨ *Идеальное свидание:* ${date || "не указано"}
🗺️ *Место встречи:* ${place || "не указано"}
◷ *Когда сойдутся звезды:* ${time || "не указано"}
🔐 *Тайное послание:* ${message || "скрыто"}

📊 *МАГИЧЕСКИЙ РЕЗУЛЬТАТ:* ${lovePercentage}%

🪐 *Анализ знаков:*
_${zodiacVerdict}_

🔮 *Вердикт звезд:*
_${finalVerdict}_`;

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
                parse_mode: "Markdown"
            })
        });

        const result = await response.json();

        if (!result.ok) {
            console.error("Telegram error:", result);

            return res.status(500).json({
                error: "Telegram не принял сообщение"
            });
        }

        // =========================
        // ОТВЕТ САЙТУ
        // =========================

        res.json({
            success: true,
            percentage: lovePercentage,
            verdict: `${zodiacVerdict} ${finalVerdict}`
        });

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

// =========================
// PORT
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
