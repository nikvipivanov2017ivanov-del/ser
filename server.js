const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// =========================
// НАЗВАНИЯ ЗНАКОВ
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
    return oppositePairs.some(
        ([a, b]) =>
            (z1 === a && z2 === b) ||
            (z1 === b && z2 === a)
    );
}

// =========================
// РАСЧЁТ ЗОДИАКА
// максимум 8 баллов
// =========================

function calculateZodiacCompatibility(zodiac1, zodiac2) {
    const element1 = elements[zodiac1];
    const element2 = elements[zodiac2];

    let score = 0;
    let verdict = "";

    if (zodiac1 === zodiac2) {
        score = 8;

        verdict =
            `✨ Два одинаковых знака — ${zodiacNames[zodiac1]} и ${zodiacNames[zodiac2]}. ` +
            "Вы легко узнаёте в другом человеке собственные желания, эмоции и привычки. " +
            "Между вами может возникнуть очень сильное взаимопонимание, но важно не соревноваться друг с другом.";
    }

    else if (
        (element1 === "fire" && element2 === "air") ||
        (element1 === "air" && element2 === "fire")
    ) {
        score = 8;

        verdict =
            "🔥🌬️ Огонь и Воздух — очень яркое сочетание. " +
            "Воздух разжигает пламя, а Огонь добавляет отношениям страсть, движение и смелость. " +
            "Вместе вам трудно скучать.";
    }

    else if (
        (element1 === "earth" && element2 === "water") ||
        (element1 === "water" && element2 === "earth")
    ) {
        score = 8;

        verdict =
            "🌿🌊 Земля и Вода прекрасно дополняют друг друга. " +
            "Один знак создаёт чувство надёжности, а другой приносит эмоциональную глубину и тепло. " +
            "Очень гармоничная комбинация.";
    }

    else if (isOpposite(zodiac1, zodiac2)) {
        score = 7;

        verdict =
            "🧲 Ваши знаки находятся напротив друг друга в зодиакальном круге. " +
            "Такие союзы часто дают сильнейшее притяжение: вы очень разные, но именно поэтому способны дополнять друг друга.";
    }

    else if (element1 === element2) {
        score = 7;

        verdict =
            `💫 Вы принадлежите к одной стихии — ${elementNames[element1]}. ` +
            "Ваш ритм, темперамент и способ смотреть на жизнь во многом похожи. " +
            "Это создаёт хорошую основу для взаимопонимания.";
    }

    else if (
        (element1 === "fire" && element2 === "water") ||
        (element1 === "water" && element2 === "fire")
    ) {
        score = 4;

        verdict =
            "🔥🌊 Вода и Огонь — союз сильных эмоций. " +
            "Между вами может быть огромное притяжение, но реакции на одни и те же ситуации часто отличаются. " +
            "Если научиться слышать друг друга, отношения становятся особенно яркими.";
    }

    else if (
        (element1 === "earth" && element2 === "air") ||
        (element1 === "air" && element2 === "earth")
    ) {
        score = 4;

        verdict =
            "🌿🌬️ Земля и Воздух живут в немного разных ритмах. " +
            "Один ищет устойчивость, другой — свободу и новые идеи. " +
            "Но ваши различия способны очень хорошо дополнять друг друга.";
    }

    else {
        score = 6;

        verdict =
            "🔮 Ваши стихии создают необычную комбинацию. " +
            "Здесь многое зависит не от гороскопа, а от того, насколько легко вы принимаете особенности друг друга.";
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

        const name = String(data.name || "").trim();

        const zodiac1 = String(data.zodiac1 || "")
            .toLowerCase()
            .trim();

        const zodiac2 = String(data.zodiac2 || "")
            .toLowerCase()
            .trim();

        const feelings = String(data.feelings || "").trim();
        const date = String(data.date || "").trim();
        const place = String(data.place || "").trim();
        const time = String(data.time || "").trim();
        const message = String(data.message || "").trim();

        // =========================
        // ПРОВЕРКА
        // =========================

        if (!name) {
            return res.status(400).json({
                error: "Не указано имя"
            });
        }

        if (!zodiac1) {
            return res.status(400).json({
                error: "Не выбран твой знак зодиака"
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

        // Максимум:
        // зодиак 8
        // энергия 3
        // свидание 2
        // место 3
        // время 3
        // сообщение 3
        //
        // ИТОГО = 22

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

        if (feelings === "Влюблённая энергия 💗") {
            score += 3;

            energyVerdict =
                "💗 Влюблённая энергия усиливает тепло, нежность и желание быть ближе.";
        }

        else if (feelings === "Загадочная энергия 🔮") {
            score += 3;

            energyVerdict =
                "🔮 Загадочная энергия добавляет отношениям интригу и сильное любопытство друг к другу.";
        }

        else if (feelings === "Авантюрная энергия ⚡") {
            score += 3;

            energyVerdict =
                "⚡ Авантюрная энергия обещает движение, спонтанность и массу совместных приключений.";
        }

        else if (feelings === "Спокойная энергия 🌙") {
            score += 2;

            energyVerdict =
                "🌙 Спокойная энергия располагает к искренним разговорам, доверию и мягкому развитию отношений.";
        }

        else if (feelings === "Дерзкая энергия 😎") {
            score += 2;

            energyVerdict =
                "😎 Дерзкая энергия создаёт игру, флирт и желание бросить судьбе небольшой вызов.";
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
            dateLower.includes("путеше") ||
            dateLower.includes("прогул")
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
        // ТАЙНОЕ ПОСЛАНИЕ
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

        let lovePercentage =
            Math.round(
                (score / maxScore) * 100
            );

        // Чтобы результат не был унылым :)
        if (lovePercentage < 40) {
            lovePercentage = 40;
        }

        if (lovePercentage > 100) {
            lovePercentage = 100;
        }

        // =========================
        // ФИНАЛЬНЫЙ ВЕРДИКТ
        // =========================

        let finalVerdict = "";

        if (lovePercentage >= 90) {
            finalVerdict =
                "💖 Звёзды показывают почти идеальное совпадение. Между вами очень сильное притяжение, а ваши различия только добавляют отношениям энергии.";
        }

        else if (lovePercentage >= 80) {
            finalVerdict =
                "✨ Очень высокая совместимость. В этой истории есть и химия, и интерес, и отличный потенциал для чего-то большего.";
        }

        else if (lovePercentage >= 70) {
            finalVerdict =
                "🔮 Знаки хорошо сочетаются. Между вами определённо есть искра, которую стоит проверить в реальной встрече.";
        }

        else if (lovePercentage >= 60) {
            finalVerdict =
                "💫 Хорошая совместимость. Вы не во всём одинаковы, но именно различия могут сделать отношения особенно интересными.";
        }

        else {
            finalVerdict =
                "🌙 Не самый очевидный союз, зато очень интригующий. Иногда именно такие сочетания превращаются в самые неожиданные истории.";
        }

        // =========================
        // ПОЛНЫЙ ВЕРДИКТ
        // =========================

        const fullVerdict =
            `${zodiacResult.verdict} ${energyVerdict} ${finalVerdict}`;

        // =========================
        // TELEGRAM
        // =========================

        if (BOT_TOKEN && CHAT_ID) {

            const text =
`🔮 НОВЫЙ АНАЛИЗ СОВМЕСТИМОСТИ

👤 Имя:
${name}

🌌 Первый знак:
${zodiacNames[zodiac1]}

💞 Второй знак:
${zodiacNames[zodiac2]}

🔥 Стихии:
${elementNames[zodiacResult.element1]} × ${elementNames[zodiacResult.element2]}

💗 Энергия:
${feelings || "не указана"}

✨ Идеальное свидание:
${date}

🗺️ Место встречи:
${place}

◷ Когда:
${time}

🔐 Тайное послание:
${message || "не оставлено"}

━━━━━━━━━━━━━━━━

📊 СОВМЕСТИМОСТЬ:
${lovePercentage}%

🪐 АСТРОЛОГИЧЕСКИЙ АНАЛИЗ:
${zodiacResult.verdict}

💗 ВЛИЯНИЕ ЭНЕРГИИ:
${energyVerdict}

🔮 ВЕРДИКТ:
${finalVerdict}`;

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
                            chat_id: CHAT_ID,
                            text: text
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
        } else {
            console.warn(
                "BOT_TOKEN или CHAT_ID не настроены. Telegram пропущен."
            );
        }

        // =========================
        // ОТВЕТ САЙТУ
        // =========================

        return res.json({
            success: true,

            percentage:
                lovePercentage,

            zodiac1:
                zodiac1,

            zodiac2:
                zodiac2,

            zodiac1Name:
                zodiacNames[zodiac1],

            zodiac2Name:
                zodiacNames[zodiac2],

            element1:
                zodiacResult.element1,

            element2:
                zodiacResult.element2,

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
