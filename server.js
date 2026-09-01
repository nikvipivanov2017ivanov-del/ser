const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const BOT_TOKEN = "8917405371:AAECfn7xNP86pZ8rlFlI28YGcaWTI1qDm84";
const CHAT_ID = "7610345900";
const MY_ZODIAC = "стрілець";
app.post("/api/send", async (req, res) => {
    try {
        const data = req.body;
        const userZodiac = data.zodiac ? data.zodiac.toLowerCase().trim() : "";
        let score = 0;
        let maxScore = 15;
        let zodiacVerdict = "";
        let zodiacBonus = 0;
        if (userZodiac === MY_ZODIAC) {
            zodiacBonus = 5;
            zodiacVerdict = "Два Стрільця! Це вибух адреналіну, спільні пригоди та абсолютна свобода. Ви бачите один одного наскрізь! 🏹🔥";
        } else if (["лев", "овен"].includes(userZodiac)) {
            zodiacBonus = 5;
            zodiacVerdict = "Стихія Вогню! Максимальна пристрасть, спільні безумства та ідеальне розуміння без зайвих слів. 💥🦁";
        } else if (["близнецы", "близнюки", "весы", "терези", "водолей"].includes(userZodiac)) {
            zodiacBonus = 4;
            zodiacVerdict = "Вогонь і Повітря! Повітря роздмухує ваше полум'я. Разом вам ніколи не буде нудно, ідеальний інтелектуальный зв'язок. 🌬️✨";
        } else if (["телец", "тілець", "дева", "діва", "козерог"].includes(userZodiac)) {
            zodiacBonus = 2;
            zodiacVerdict = "Земні знаки прагнуть стабільності, а Стрілець — свободи. Потрібен час для притирки, але союз може быть дуже міцним. 🏔️";
        } else if (["рак", "скорпион", "скорпіон", "рыбы", "риби"].includes(userZodiac)) {
            zodiacBonus = 1;
            zodiacVerdict = "Вогонь і Вода. Глибокі почуття та штормові емоции. Вода может загасити ваш запал, але магнетизм между вами неймовірний. 🌊";
        } else {
            zodiacBonus = 2;
            zodiacVerdict = "Зірки дивляться на ваш союз із цікавістю. Магия кохання сильніша за будь-які гороскопи! 🌌";
        }
        score += zodiacBonus;
        if (data.feelings === "Влюблённая энергия 💗") score += 3;
        else if (data.feelings === "Загадочная энергия 🔮") score += 3;
        else if (data.feelings === "Авантюрная энергия ⚡") score += 2;
        else if (data.feelings === "Спокойная энергия 🌙") score += 2;
        else if (data.feelings === "Мне нравится статус-код 200 😏") score += 1;
        const placeLower = data.place ? data.place.toLowerCase() : "";
        if (placeLower.includes("кафе") || placeLower.includes("ресторан") || placeLower.includes("кино")) score += 3;
        else if (placeLower.includes("космос") || placeLower.includes("звезд") || placeLower.includes("неб")) score += 3;
        else score += 2;
        const timeLower = data.time ? data.time.toLowerCase() : "";
        if (timeLower.includes("сегодня") || timeLower.includes("сейчас") || timeLower.includes("всегда")) score += 3;
        else score += 1;
        if (data.message && data.message.length > 15) score += 3;
        else if (data.message && data.message.length > 0) score += 2;
        let lovePercentage = Math.round((score / maxScore) * 100);
        if (lovePercentage < 35) lovePercentage = 45;
        if (lovePercentage > 100) lovePercentage = 100;
        let finalVerdict = "";
        if (lovePercentage >= 85) {
            finalVerdict = "✨ Всесвіт ликує! Ваша астрологічна та душевна гармонія бездоганна. Ви створені один для одного! 🌌";
        } else if (lovePercentage >= 65) {
            finalVerdict = "🔮 Магія діє! Знаки зодіаку прихильні до вас, а енергії притягуються. Вам обов'язково треба зустрітися! 🧭";
        } else {
            finalVerdict = "🌙 Таємничий союз! Ви народилися під різними сузір'ями, але саме протилежності створюють найсильніше тяжіння. ✨";
        }
        const text = `🔮 *АСТРОЛОГИЧЕСКИЙ АНАЛИЗ СОВМЕСТИМОСТИ*\n\n👤 *Странник:* ${data.name}\n🏹 *Знак зодиака:* ${data.zodiac}\n🌟 *Энергия сердца:* ${data.feelings}\n✨ *Идеальное свидание:* ${data.date}\n🗺️ *Место встречи:* ${data.place}\n◷ *Когда сойдутся звезды:* ${data.time}\n🔐 *Тайное послание:* ${data.message || "скрыто"}\n\n📊 *МАГИЧЕСКИЙ РЕЗУЛЬТАТ:* ${lovePercentage}%\n🪐 *Анализ знаков:* _${zodiacVerdict}_\n🔮 *Вердикт звезд:* _${finalVerdict}_`;
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" })
        });
        const result = await response.json();
        if (!result.ok) return res.status(500).json({ error: result });
        res.json({ success: true, percentage: lovePercentage, verdict: `${zodiacVerdict} ${finalVerdict}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
