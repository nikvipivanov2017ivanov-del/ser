const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// =========================
// ЗНАКИ
// =========================

const zodiacNames = {
    овен: "♈ Овен",
    телец: "♉ Телец",
    близнецы: "♊ Близнецы",
    рак: "♋ Рак",
    лев: "♌ Лев",
    дева: "♍ Дева",
    весы: "♎ Весы",
    скорпион: "♏ Скорпион",
    стрелец: "♐ Стрелец",
    козерог: "♑ Козерог",
    водолей: "♒ Водолей",
    рыбы: "♓ Рыбы"
};

// =========================
// СТИХИИ
// =========================

const elements = {
    овен: "fire",
    лев: "fire",
    стрелец: "fire",

    телец: "earth",
    дева: "earth",
    козерог: "earth",

    близнецы: "air",
    весы: "air",
    водолей: "air",

    рак: "water",
    скорпион: "water",
    рыбы: "water"
};

const elementNames = {
    fire: "Огонь 🔥",
    earth: "Земля 🌿",
    air: "Воздух 🌬️",
    water: "Вода 🌊"
};

// =========================
// ПРОТИВОПОЛОЖНЫЕ ЗНАКИ
// =========================

const oppositePairs = [
    ["овен", "весы"],
    ["телец", "скорпион"],
    ["близнецы", "стрелец"],
    ["рак", "козерог"],
    ["лев", "водолей"],
    ["дева", "рыбы"]
];

function isOpposite(z1, z2) {
    return oppositePairs.some(([a, b]) => {
        return (
            (z1 === a && z2 === b) ||
            (z1 === b && z2 === a)
        );
    });
}

// =========================
// АСТРОЛОГИЧЕСКИЙ РАСЧЁТ
// максимум 8
// =========================

function calculateZodiacCompatibility(z1, z2) {
    const element1 = elements[z1];
    const element2 = elements[z2];

    let score = 0;
    let verdict = "";

    if (z1 === z2) {
        score = 8;

        verdict =
            `✨ ${zodiacNames[z1]} встречает своё отражение. ` +
            "Вы хорошо понимаете реакции, желания и настроение друг друга. " +
            "Союз может быть очень сильным, если не начать соревноваться.";
    }

    else if (
        (element1 === "fire" && element2 === "air") ||
        (element1 === "air" && element2 === "fire")
    ) {
        score = 8;

        verdict =
            "🔥🌬️ Огонь и Воздух создают яркий союз. " +
            "Между вами легко появляются интерес, движение, страсть и желание пробовать новое.";
    }

    else if (
        (element1 === "earth" && element2 === "water") ||
        (element1 === "water" && element2 === "earth")
    ) {
        score = 8;

        verdict =
            "🌿🌊 Земля и Вода отлично дополняют друг друга. " +
            "Один приносит стабильность, другой — эмоциональную глубину и тепло.";
    }

    else if (isOpposite(z1, z2)) {
        score = 7;

        verdict =
            "🧲 Ваши знаки находятся напротив друг друга в зодиакальном круге. " +
            "Это часто создаёт очень сильное притяжение: вы разные, но можете идеально дополнять друг друга.";
    }

    else if (element1 === element2) {
        score = 7;

        verdict =
            `💫 Вы принадлежите одной стихии — ${elementNames[element1]}. ` +
            "У вас похожий ритм и способ смотреть на жизнь, что даёт хорошее взаимопонимание.";
    }

    else if (
        (element1 === "fire" && element2 === "water") ||
        (element1 === "water" && element2 === "fire")
    ) {
        score = 4;

        verdict =
            "🔥🌊 Вода и Огонь создают эмоциональный и очень яркий союз. " +
            "Между вами может быть сильное притяжение, но важно не пытаться изменить друг друга.";
    }

    else if (
        (element1 === "earth" && element2 === "air") ||
        (element1 === "air" && element2 === "earth")
    ) {
        score = 4;

        verdict =
            "🌿🌬️ Земля и Воздух смотрят на многие вещи по-разному. " +
            "Один любит устойчивость, второй свободу и новые идеи. " +
            "Но именно различия способны хорошо вас дополнять.";
    }

    else {
        score = 6;

        verdict =
            "🔮 Между вашими знаками есть необычная химия. " +
            "Здесь многое зависит от характера и желания слышать друг друга.";
    }

    return {
        score,
        verdict,
        element1,
        element2
    };
}

// =========================
// API
// =========================

app.post("/api/send", async (req, res) => {
    try {
        const data = req.body || {};

        const name =
            String(data.name || "").trim();

        const zodiac1 =
            String(data.zodiac1 || "")
                .toLowerCase()
                .trim();

        const zodiac2 =
            String(data.zodiac2 || "")
                .toLowerCase()
                .trim();

        const feelings =
            String(data.feelings || "").trim();

        const date =
            String(data.date || "").trim();

        const place =
            String(data.place || "").trim();

        const time =
            String(data.time || "").trim();

        const message =
            String(data.message || "").trim();

        // =========================
        // ПРОВЕРКИ
        // =========================

        if (!name) {
            return res.status(400).json({
                error: "Не указано имя"
            });
        }

        if (!zodiac1) {
            return res.status(400).json({
                error: "Не выбран первый знак зодиака"
            });
        }

        if (!zodiac2) {
            return res.status(400).json({
                error: "Не выбран второй знак зодиака"
            });
        }

        if (!zodiacNames[zodiac1]) {
            return res.status(400).json({
                error: "Неизвестный первый знак зодиака"
            });
        }

        if (!zodiacNames[zodiac2]) {
            return res.status(400).json({
                error: "Неизвестный второй знак зодиака"
            });
        }

        if (!date) {
            return res.status(400).json({
                error: "Не указано идеальное свидание"
            });
        }

        if (!place) {
            return res.status(400).json({
                error: "Не указано место встречи"
            });
        }

        if (!time) {
            return res.status(400).json({
                error: "Не указано время встречи"
            });
        }

        let score = 0;

        // максимум:
        // зодиак 8
        // энергия 3
        // свидание 2
        // место 3
        // время 3
        // сообщение 3
        //
        // TOTAL = 22

        const maxScore = 22;

        // =========================
        // ЗОДИАК
        // =========================

        const zodiacResult =
            calculateZodiacCompatibility(
                zodiac1,
                zodiac2
            );

        score += zodiacResult.score;

        // =========================
        // ЭНЕРГИЯ
        // =========================

        let energyVerdict = "";

        if (
            feelings ===
            "Влюблённая энергия 💗"
        ) {
            score += 3;

            energyVerdict =
                "💗 Влюблённая энергия усиливает тепло, нежность и желание быть рядом.";
        }

        else if (
            feelings ===
            "Загадочная энергия 🔮"
        ) {
            score += 3;

            energyVerdict =
                "🔮 Загадочная энергия усиливает интригу и интерес друг к другу.";
        }

        else if (
            feelings ===
            "Авантюрная энергия ⚡"
        ) {
            score += 3;

            energyVerdict =
                "⚡ Авантюрная энергия обещает движение, спонтанность и совместные приключения.";
        }

        else if (
            feelings ===
            "Спокойная энергия 🌙"
        ) {
            score += 2;

            energyVerdict =
                "🌙 Спокойная энергия помогает доверию и искренним разговорам.";
        }

        else if (
            feelings ===
            "Дерзкая энергия 😎"
        ) {
            score += 2;

            energyVerdict =
                "😎 Дерзкая энергия добавляет флирт, игру и желание удивлять друг друга.";
        }

        else {
            score += 1;

            energyVerdict =
                "✨ Энергия сердца пока остаётся загадкой.";
        }

        // =========================
        // ИДЕАЛЬНОЕ СВИДАНИЕ
        // =========================

        const dateLower =
            date.toLowerCase();

        if (
            dateLower.includes("звезд") ||
            dateLower.includes("звёзд") ||
            dateLower.includes("луна") ||
            dateLower.includes("луной") ||
            dateLower.includes("море") ||
            dateLower.includes("прогул") ||
            dateLower.includes("путеше")
        ) {
            score += 2;
        } else {
            score += 1;
        }

        // =========================
        // МЕСТО
        // =========================

        const placeLower =
            place.toLowerCase();

        if (
            placeLower.includes("кафе") ||
            placeLower.includes("ресторан") ||
            placeLower.includes("кино") ||
            placeLower.includes("море") ||
            placeLower.includes("пляж") ||
            placeLower.includes("крыша") ||
            placeLower.includes("парк") ||
            placeLower.includes("горы")
        ) {
            score += 3;
        } else {
            score += 2;
        }

        // =========================
        // ВРЕМЯ
        // =========================

        const timeLower =
            time.toLowerCase();

        if (
            timeLower.includes("сегодня") ||
            timeLower.includes("вечер") ||
            timeLower.includes("ноч") ||
            timeLower.includes("луна") ||
            timeLower.includes("луной")
        ) {
            score += 3;
        }

        else if (
            timeLower.includes("завтра") ||
            timeLower.includes("выходн") ||
            timeLower.includes("суббот") ||
            timeLower.includes("воскрес")
        ) {
            score += 2;
        }

        else {
            score += 1;
        }

        // =========================
        // ПОСЛАНИЕ
        // =========================

        if (message.length >= 20) {
            score += 3;
        }

        else if (message.length > 0) {
            score += 2;
        }

        // =========================
        // ПРОЦЕНТ
        // =========================

        let percentage =
            Math.round(
                (score / maxScore) * 100
            );

        if (percentage < 40) {
            percentage = 40;
        }

        if (percentage > 100) {
            percentage = 100;
        }

        // =========================
        // ФИНАЛЬНЫЙ ВЕРДИКТ
        // =========================

        let finalVerdict = "";

        if (percentage >= 90) {
            finalVerdict =
                "💖 Почти идеальное совпадение. Между вами очень сильное притяжение, и ваши энергии действительно усиливают друг друга.";
        }

        else if (percentage >= 80) {
            finalVerdict =
                "✨ Очень высокая совместимость. В этой истории есть и химия, и интерес, и отличный потенциал для чего-то большего.";
        }

        else if (percentage >= 70) {
            finalVerdict =
                "🔮 Между вами определённо есть искра. Звёзды советуют проверить эту совместимость настоящей встречей.";
        }

        else if (percentage >= 60) {
            finalVerdict =
                "💫 Хорошая совместимость. Вы отличаетесь, но именно эти различия могут сделать отношения особенно интересными.";
        }

        else {
            finalVerdict =
                "🌙 Союз не самый очевидный, зато интригующий. Иногда именно такие сочетания превращаются в самые необычные истории.";
        }

        const fullVerdict =
            `${zodiacResult.verdict} ${finalVerdict}`;

        // =========================
        // TELEGRAM
        // =========================

        if (BOT_TOKEN && CHAT_ID) {

            const text =
`🔮 НОВЫЙ МАГИЧЕСКИЙ АНАЛИЗ

👤 Имя:
${name}

🌌 Первый знак:
${zodiacNames[zodiac1]}

💞 Второй знак:
${zodiacNames[zodiac2]}

🌠 Стихии:
${elementNames[zodiacResult.element1]}
×
${elementNames[zodiacResult.element2]}

💗 Энергия:
${feelings || "не указана"}

✨ Идеальное свидание:
${date}

🗺️ Место:
${place}

◷ Когда:
${time}

🔐 Тайное послание:
${message || "не оставлено"}

━━━━━━━━━━━━━━

📊 СОВМЕСТИМОСТЬ:
${percentage}%

🪐 Астрологический анализ:
${zodiacResult.verdict}

💗 Энергия сердца:
${energyVerdict}

🔮 Финальный вердикт:
${finalVerdict}`;

            try {

                const telegramUrl =
                    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

                const telegramResponse =
                    await fetch(
                        telegramUrl,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                chat_id:
                                    CHAT_ID,

                                text:
                                    text
                            })
                        }
                    );

                const telegramResult =
                    await telegramResponse.json();

                if (!telegramResult.ok) {
                    console.error(
                        "Telegram error:",
                        telegramResult
                    );
                }

            } catch (telegramError) {

                console.error(
                    "Telegram request error:",
                    telegramError
                );

            }
        }

        // =========================
        // ОТВЕТ САЙТУ
        // =========================

        return res.json({

            success: true,

            percentage:
                percentage,

            zodiacVerdict:
                zodiacResult.verdict,

            energyVerdict:
                energyVerdict,

            finalVerdict:
                finalVerdict,

            verdict:
                fullVerdict

        });

    } catch (error) {

        console.error(
            "Server error:",
            error
        );

        return res.status(500).json({
            error:
                error.message ||
                "Внутренняя ошибка сервера"
        });
    }
});

// =========================
// ПРОВЕРКА RENDER
// =========================

app.get("/", (req, res) => {
    res.send(
        "🔮 Magic compatibility server is running"
    );
});

// =========================
// PORT
// =========================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Сервер запущен на порту ${PORT}`
    );
});
