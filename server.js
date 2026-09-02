const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

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
                error: "BOT_TOKEN или CHAT_ID не настроены"
            });
        }

        if (!name) {
            return res.status(400).json({
                error: "Не указано имя"
            });
        }

        if (!zodiac) {
            return res.status(400).json({
                error: "Не выбран знак зодиака"
            });
        }

        let score = 0;

        const maxScore = 17;

        let zodiacBonus = 0;
        let zodiacVerdict = "";

        if (
            zodiac === "стрелец" ||
            zodiac === "стрілець"
        ) {
            zodiacBonus = 5;

            zodiacVerdict =
                "♐ Два Стрельца! Это союз двух свободных огненных душ. Приключения, юмор, страсть и желание покорять мир вместе. Главное — иногда всё-таки останавливаться и слушать друг друга. 🏹🔥";
        }

        else if (
            zodiac === "овен" ||
            zodiac === "лев"
        ) {
            zodiacBonus = 5;

            zodiacVerdict =
                "🔥 Огонь встречает Огонь! Между вами легко вспыхивает сильная искра. Стрелец любит свободу и движение, а твой знак способен поддерживать этот безумный ритм. Очень мощное притяжение.";
        }

        else if (
            zodiac === "близнецы" ||
            zodiac === "весы" ||
            zodiac === "водолей"
        ) {
            zodiacBonus = 4;

            zodiacVerdict =
                "🌬️ Воздух раздувает огонь Стрельца. Между вами может быть много разговоров, шуток, спонтанных идей и приключений. Скука этому союзу почти не угрожает.";
        }

        else if (
            zodiac === "телец" ||
            zodiac === "дева" ||
            zodiac === "козерог"
        ) {
            zodiacBonus = 2;

            zodiacVerdict =
                "🌿 Земля встречает огонь. Стрелец тянется к свободе и приключениям, а земные знаки чаще любят стабильность. Вы разные, но именно эта разница может хорошо дополнять друг друга.";
        }

        else if (
            zodiac === "рак" ||
            zodiac === "скорпион" ||
            zodiac === "рыбы"
        ) {
            zodiacBonus = 2;

            zodiacVerdict =
                "🌊 Вода и Огонь создают сильные эмоции. Стрелец может казаться слишком свободным, а водный знак — слишком глубоким. Но именно между такими противоположностями часто возникает мощный магнетизм.";
        }

        else {
            zodiacBonus = 2;

            zodiacVerdict =
                "🌌 Созвездия пока держат часть тайны при себе. Но совместимость определяется не только знаком зодиака.";
        }

        score += zodiacBonus;

        if (feelings === "Влюблённая энергия 💗") {
            score += 3;
        }

        else if (feelings === "Загадочная энергия 🔮") {
            score += 3;
        }

        else if (feelings === "Авантюрная энергия ⚡") {
            score += 2;
        }

        else if (feelings === "Спокойная энергия 🌙") {
            score += 2;
        }

        else if (
            feelings ===
            "Мне нравится статус-код 200 😏"
        ) {
            score += 1;
        }

        const placeLower = place.toLowerCase();

        if (
            placeLower.includes("кафе") ||
            placeLower.includes("ресторан") ||
            placeLower.includes("кино")
        ) {
            score += 3;
        }

        else if (
            placeLower.includes("море") ||
            placeLower.includes("пляж") ||
            placeLower.includes("горы") ||
            placeLower.includes("парк") ||
            placeLower.includes("звезд") ||
            placeLower.includes("небо")
        ) {
            score += 3;
        }

        else {
            score += 2;
        }

        const timeLower = time.toLowerCase();

        if (
            timeLower.includes("сегодня") ||
            timeLower.includes("сейчас") ||
            timeLower.includes("вечером") ||
            timeLower.includes("ночью")
        ) {
            score += 3;
        }

        else {
            score += 1;
        }

        if (message.length > 15) {
            score += 3;
        }

        else if (message.length > 0) {
            score += 2;
        }

        let lovePercentage =
            Math.round((score / maxScore) * 100);

        if (lovePercentage < 45) {
            lovePercentage = 45;
        }

        if (lovePercentage > 100) {
            lovePercentage = 100;
        }

        let finalVerdict = "";

        if (lovePercentage >= 90) {
            finalVerdict =
                "✨ Звёзды почти кричат о совпадении. Между вами очень сильная энергия, и этот союз определённо заслуживает настоящей встречи. 💖";
        }

        else if (lovePercentage >= 75) {
            finalVerdict =
                "🔮 Очень сильная совместимость. У этого знакомства есть отличные шансы превратиться во что-то намного интереснее обычной переписки.";
        }

        else if (lovePercentage >= 60) {
            finalVerdict =
                "💫 Хорошее притяжение. Некоторые ваши качества отличаются, но именно это может сделать историю намного интереснее.";
        }

        else {
            finalVerdict =
                "🌙 Звёзды оставляют интригу. Вы не самый очевидный союз, но иногда именно самые неожиданные сочетания становятся самыми запоминающимися.";
        }

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

        const zodiacName =
            zodiacNames[zodiac] || zodiac;

        const text =
`🔮 АСТРОЛОГИЧЕСКИЙ АНАЛИЗ

👤 Имя: ${name}
♐ Совместимость с: Стрельцом
🌌 Знак пользователя: ${zodiacName}

💗 Энергия:
${feelings || "не указана"}

✨ Идеальное свидание:
${date || "не указано"}

🗺️ Место:
${place || "не указано"}

◷ Время:
${time || "не указано"}

🔐 Тайное послание:
${message || "не оставлено"}

━━━━━━━━━━━━━━

📊 СОВМЕСТИМОСТЬ: ${lovePercentage}%

🪐 Анализ знаков:
${zodiacVerdict}

🔮 Вердикт:
${finalVerdict}`;

        const telegramUrl =
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(
            telegramUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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

            return res.status(500).json({
                error: "Telegram не принял сообщение"
            });
        }

        return res.json({
            success: true,
            percentage: lovePercentage,
            zodiacVerdict: zodiacVerdict,
            verdict:
                zodiacVerdict + " " + finalVerdict
        });

    } catch (error) {
        console.error(
            "Server error:",
            error
        );

        return res.status(500).json({
            error: error.message
        });
    }
});

app.get("/", (req, res) => {
    res.send("Magic compatibility server is running 🔮");
});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Сервер запущен на порту ${PORT}`
    );
});
