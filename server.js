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
        
        // --- СЛОЖНАЯ ЛОГИКА РАСЧЕТА СОВМЕСТИМОСТИ ---
        let score = 0;
        let maxScore = 12; // Максимально возможный балл (4 вопроса по 3 балла)

        // 1. Анализ чувств
        if (data.feelings === "Это великолепно! 🥰") score += 3;
        else if (data.feelings === "Очень мило 😳") score += 2;
        else if (data.feelings === "Мне нравится статус-код 200 😏") score += 1;

        // 2. Анализ формата свидания
        if (data.place.toLowerCase().includes("кафе") || data.place.toLowerCase().includes("ресторан")) score += 3;
        else if (data.place.toLowerCase().includes("дом") || data.place.toLowerCase().includes("кино")) score += 2;
        else score += 1; // Любые другие варианты

        // 3. Анализ времени (насколько быстро готовы встретиться)
        if (data.time.toLowerCase().includes("сегодня") || data.time.toLowerCase().includes("сейчас")) score += 3;
        else if (data.time.toLowerCase().includes("суббот") || data.time.toLowerCase().includes("выходн")) score += 2;
        else score += 1;

        // 4. Длина секретного сообщения (проверка на искренность)
        if (data.message && data.message.length > 20) score += 3;
        else if (data.message && data.message.length > 0) score += 2;
        else score += 0;

        // Рассчитываем итоговый процент (минимум 30% для милоты, максимум 100%)
        let lovePercentage = Math.round((score / maxScore) * 100);
        if (lovePercentage < 30) lovePercentage = 35; 
        if (lovePercentage > 100) lovePercentage = 100;

        // Генерируем вердикт от сервера
        let verdict = "";
        if (lovePercentage >= 85) {
            verdict = "🔥 Идеальное совпадение! Ваши биоритмы и планы на свидание синхронизированы на максимум. Срочно бегите на встречу!";
        } else if (lovePercentage >= 60) {
            verdict = "💞 Отличная совместимость! У вас очень похожие взгляды, искра определенно есть. Осталось обсудить детали.";
        } else {
            verdict = "⚡ Противоположности притягиваются! Ваши ответы очень уникальны, а значит, свидание будет максимально интересным и необычным.";
        }

        // --- ФОРМИРОВАНИЕ СООБЩЕНИЯ ДЛЯ ТЕЛЕГРАМ ---
        const text = `💌 *НОВЫЙ РАСЧЕТ СОВМЕСТИМОСТИ!*\n\n` +
                     `👤 *Имя:* ${data.name}\n` +
                     `❤️ *Чувства:* ${data.feelings}\n` +
                     `📅 *Свидание:* ${data.date}\n` +
                     `📍 *Место:* ${data.place}\n` +
                     `⏰ *Когда:* ${data.time}\n` +
                     `💬 *Сообщение:* ${data.message || "не указано"}\n\n` +
                     `📊 *РЕЗУЛЬТАТ АНАЛИЗА:* ${lovePercentage}%\n` +
                     `🔮 *Вердикт бэкенда:* _${verdict}_`;

        // ЗДЕСЬ АДРЕС ИСПРАВЛЕН НА 100% ПРАВИЛЬНЫЙ И БЕЗ СЛОЖНЫХ КАВЫЧЕК
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: "Markdown"
            })
        });

        const result = await response.json();
        
        if (!result.ok) {
            return res.status(500).json({ error: result });
        }
        
        // Возвращаем результат обратно на сайт
        res.json({ success: true, percentage: lovePercentage, verdict: verdict });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
