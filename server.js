const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

/* =========================
   ЗНАКИ
========================= */

const zodiacNames = {
    овен:"♈ Овен",
    телец:"♉ Телец",
    близнецы:"♊ Близнецы",
    рак:"♋ Рак",
    лев:"♌ Лев",
    дева:"♍ Дева",
    весы:"♎ Весы",
    скорпион:"♏ Скорпион",
    стрелец:"♐ Стрелец",
    козерог:"♑ Козерог",
    водолей:"♒ Водолей",
    рыбы:"♓ Рыбы"
};

/* =========================
   ХАРАКТЕРИСТИКИ
========================= */

const zodiacProfiles = {

    овен:
        "Овен — энергичный, смелый и прямой. Быстро загорается идеями и чувствами, любит инициативу и не боится сделать первый шаг. В отношениях ему важны страсть, движение и честность.",

    телец:
        "Телец — спокойный, чувственный и надёжный. Он ценит стабильность, внимание и поступки сильнее громких обещаний. В отношениях ищет доверие, комфорт и ощущение настоящей близости.",

    близнецы:
        "Близнецы — общительные, любознательные и лёгкие на подъём. Им важно постоянно открывать что-то новое и чувствовать интеллектуальную связь. Скука — главный враг их отношений.",

    рак:
        "Рак — чувствительный, заботливый и интуитивный. Для него особенно важны доверие и эмоциональная безопасность. Если Рак действительно открывает сердце, он способен очень глубоко привязаться.",

    лев:
        "Лев — яркий, уверенный и щедрый. Ему нравится чувствовать себя особенным для любимого человека. В отношениях ценит восхищение, верность, сильные эмоции и красивые поступки.",

    дева:
        "Дева — внимательная, практичная и наблюдательная. Она замечает мелочи, которые другие часто пропускают. Свою симпатию обычно показывает заботой и поступками, а не громкими словами.",

    весы:
        "Весы — романтичные, дипломатичные и тонко чувствующие красоту. Они стремятся к гармонии и взаимности. Для них важны приятное общение, уважение и эмоциональный баланс.",

    скорпион:
        "Скорпион — глубокий, страстный и загадочный. Он редко относится к чувствам поверхностно. Если возникает настоящая близость, Скорпион хочет искренности, верности и сильной эмоциональной связи.",

    стрелец:
        "Стрелец — оптимистичный, свободолюбивый и авантюрный. Он любит новые впечатления, юмор и ощущение движения. В отношениях ему нужен человек, который не ограничивает его, а идёт исследовать мир вместе.",

    козерог:
        "Козерог — серьёзный, устойчивый и целеустремлённый. Он не всегда показывает чувства сразу, но ценит надёжность и долгосрочную перспективу. Сильнее всего его убеждают поступки.",

    водолей:
        "Водолей — независимый, необычный и интеллектуальный. Ему важны свобода, интересные разговоры и ощущение дружеского партнёрства. Он ценит людей, рядом с которыми можно оставаться собой.",

    рыбы:
        "Рыбы — мечтательные, эмоциональные и интуитивные. Они тонко чувствуют настроение другого человека и способны создавать очень романтичную атмосферу. Им нужны нежность и эмоциональная близость."
};

/* =========================
   СТИХИИ
========================= */

const elements = {

    овен:"fire",
    лев:"fire",
    стрелец:"fire",

    телец:"earth",
    дева:"earth",
    козерог:"earth",

    близнецы:"air",
    весы:"air",
    водолей:"air",

    рак:"water",
    скорпион:"water",
    рыбы:"water"

};

const elementNames = {
    fire:"Огонь 🔥",
    earth:"Земля 🌿",
    air:"Воздух 🌬️",
    water:"Вода 🌊"
};

/* =========================
   ПРОТИВОПОЛОЖНЫЕ
========================= */

const oppositePairs = [
    ["овен","весы"],
    ["телец","скорпион"],
    ["близнецы","стрелец"],
    ["рак","козерог"],
    ["лев","водолей"],
    ["дева","рыбы"]
];

function isOpposite(a,b){

    return oppositePairs.some(
        ([x,y])=>
            (a === x && b === y) ||
            (a === y && b === x)
    );
}

/* =========================
   ЗОДИАКАЛЬНАЯ СОВМЕСТИМОСТЬ
========================= */

function calculateZodiacCompatibility(z1,z2){

    const e1 = elements[z1];
    const e2 = elements[z2];

    let score = 0;
    let verdict = "";

    if(z1 === z2){

        score = 8;

        verdict =
            "Вы принадлежите одному знаку, поэтому во многих ситуациях мгновенно понимаете реакции друг друга. Такая связь может быть очень сильной, если ваши одинаковые черты не превращаются в соревнование.";

    }

    else if(
        (e1 === "fire" && e2 === "air") ||
        (e1 === "air" && e2 === "fire")
    ){

        score = 8;

        verdict =
            "Огонь и Воздух создают яркую и динамичную связь. Воздух вдохновляет, а Огонь добавляет смелость и страсть. Вместе вы способны постоянно придумывать новые приключения.";

    }

    else if(
        (e1 === "earth" && e2 === "water") ||
        (e1 === "water" && e2 === "earth")
    ){

        score = 8;

        verdict =
            "Земля и Вода прекрасно дополняют друг друга. Один человек помогает отношениям обрести устойчивость, другой приносит эмоциональную глубину, нежность и интуицию.";

    }

    else if(isOpposite(z1,z2)){

        score = 7;

        verdict =
            "Ваши знаки находятся напротив друг друга в зодиакальном круге. Между такими людьми часто возникает необычно сильное притяжение: каждый обладает качествами, которых немного не хватает другому.";

    }

    else if(e1 === e2){

        score = 7;

        verdict =
            `Вы принадлежите одной стихии — ${elementNames[e1]}. У вас похожий внутренний ритм и способ воспринимать мир, поэтому взаимопонимание возникает легче.`;

    }

    else if(
        (e1 === "fire" && e2 === "water") ||
        (e1 === "water" && e2 === "fire")
    ){

        score = 4;

        verdict =
            "Вода и Огонь создают очень эмоциональный союз. Между вами может быть мощное притяжение, но реакции и потребности отличаются. Здесь особенно важно уважать характер друг друга.";

    }

    else if(
        (e1 === "earth" && e2 === "air") ||
        (e1 === "air" && e2 === "earth")
    ){

        score = 4;

        verdict =
            "Земля и Воздух живут в разных ритмах: один человек ищет устойчивость, другой — свободу и перемены. Но именно различия способны сделать этот союз интересным и развивающим.";

    }

    else{

        score = 6;

        verdict =
            "Ваше сочетание не относится к самым очевидным, зато в нём есть своя химия. Такие отношения сильнее всего раскрываются через общение, доверие и готовность принимать различия.";

    }

    return{
        score,
        verdict,
        element1:e1,
        element2:e2
    };
}

/* =========================
   API
========================= */

app.post("/api/send", async(req,res)=>{

    try{

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

        /* ПРОВЕРКИ */

        if(!name){
            return res.status(400).json({
                error:"Не указано имя"
            });
        }

        if(!zodiacNames[zodiac1]){
            return res.status(400).json({
                error:"Не выбран первый знак зодиака"
            });
        }

        if(!zodiacNames[zodiac2]){
            return res.status(400).json({
                error:"Не выбран второй знак зодиака"
            });
        }

        if(!date){
            return res.status(400).json({
                error:"Не указано идеальное свидание"
            });
        }

        if(!place){
            return res.status(400).json({
                error:"Не указано место встречи"
            });
        }

        if(!time){
            return res.status(400).json({
                error:"Не указано время"
            });
        }

        let score = 0;

        const maxScore = 22;

        /* ЗОДИАК */

        const zodiacResult =
            calculateZodiacCompatibility(
                zodiac1,
                zodiac2
            );

        score += zodiacResult.score;

        /* ЭНЕРГИЯ */

        let energyVerdict = "";

        if(feelings === "Влюблённая энергия 💗"){

            score += 3;

            energyVerdict =
                "Влюблённая энергия усиливает тепло и желание быть ближе. Сейчас особенно хорошо проявлять симпатию через искренность и внимание.";

        }

        else if(feelings === "Загадочная энергия 🔮"){

            score += 3;

            energyVerdict =
                "Между вами может чувствоваться интрига и лёгкая неизвестность. Именно недосказанность сейчас делает общение особенно притягательным.";

        }

        else if(feelings === "Авантюрная энергия ⚡"){

            score += 3;

            energyVerdict =
                "Ваша энергия отлично подходит для спонтанности. Совместное приключение или необычная встреча способны заметно усилить притяжение.";

        }

        else if(feelings === "Спокойная энергия 🌙"){

            score += 2;

            energyVerdict =
                "Спокойная энергия располагает к доверию и глубокому разговору. Вам не обязательно торопиться — связь лучше раскрывается постепенно.";

        }

        else if(feelings === "Дерзкая энергия 😎"){

            score += 2;

            energyVerdict =
                "В отношениях сейчас много игровой энергии. Флирт, юмор и небольшой вызов могут сделать общение особенно ярким.";

        }

        else{

            score += 1;

            energyVerdict =
                "Энергия между вами пока остаётся загадкой, и многое может измениться после настоящей встречи.";

        }

        /* СВИДАНИЕ */

        const dateLower =
            date.toLowerCase();

        if(
            dateLower.includes("звезд") ||
            dateLower.includes("звёзд") ||
            dateLower.includes("луна") ||
            dateLower.includes("море") ||
            dateLower.includes("прогул") ||
            dateLower.includes("путеше")
        ){
            score += 2;
        }else{
            score += 1;
        }

        /* МЕСТО */

        const placeLower =
            place.toLowerCase();

        if(
            placeLower.includes("кафе") ||
            placeLower.includes("ресторан") ||
            placeLower.includes("кино") ||
            placeLower.includes("парк") ||
            placeLower.includes("море") ||
            placeLower.includes("пляж") ||
            placeLower.includes("крыша") ||
            placeLower.includes("горы")
        ){
            score += 3;
        }else{
            score += 2;
        }

        /* ВРЕМЯ */

        const timeLower =
            time.toLowerCase();

        if(
            timeLower.includes("сегодня") ||
            timeLower.includes("вечер") ||
            timeLower.includes("ноч")
        ){
            score += 3;
        }

        else if(
            timeLower.includes("завтра") ||
            timeLower.includes("выходн") ||
            timeLower.includes("суббот") ||
            timeLower.includes("воскрес")
        ){
            score += 2;
        }

        else{
            score += 1;
        }

        /* СООБЩЕНИЕ */

        if(message.length >= 20){
            score += 3;
        }

        else if(message.length > 0){
            score += 2;
        }

        /* ПРОЦЕНТ */

        let percentage =
            Math.round(
                (score / maxScore) * 100
            );

        if(percentage < 40){
            percentage = 40;
        }

        if(percentage > 100){
            percentage = 100;
        }

        /* ФИНАЛ */

        let finalVerdict = "";

        if(percentage >= 90){

            finalVerdict =
                "Звёзды показывают почти идеальное совпадение. Между вами сильное притяжение, а ваши характеры способны усиливать лучшие качества друг друга.";

        }

        else if(percentage >= 80){

            finalVerdict =
                "Совместимость очень высокая. Здесь есть и эмоциональная химия, и интерес, и хороший потенциал для развития отношений.";

        }

        else if(percentage >= 70){

            finalVerdict =
                "Между вами определённо есть искра. Эта история заслуживает продолжения и настоящей встречи.";

        }

        else if(percentage >= 60){

            finalVerdict =
                "Хорошее сочетание. Вы не во всём одинаковы, но именно различия способны сделать общение интереснее.";

        }

        else{

            finalVerdict =
                "Не самый очевидный союз, зато именно такие сочетания иногда создают самые неожиданные и запоминающиеся истории.";

        }

        /* ХАРАКТЕРИСТИКИ */

        const zodiac1Profile =
            zodiacProfiles[zodiac1];

        const zodiac2Profile =
            zodiacProfiles[zodiac2];

        let pairProfile = "";

        if(
            zodiacResult.element1 ===
            zodiacResult.element2
        ){

            pairProfile =
                `${zodiacNames[zodiac1]} и ${zodiacNames[zodiac2]} принадлежат одной стихии. Вам легче почувствовать внутренний ритм друг друга, но иногда похожие слабые стороны могут усиливаться. Главное преимущество союза — естественное взаимопонимание.`;

        }

        else if(
            (
                zodiacResult.element1 === "fire" &&
                zodiacResult.element2 === "air"
            ) ||
            (
                zodiacResult.element1 === "air" &&
                zodiacResult.element2 === "fire"
            )
        ){

            pairProfile =
                "Ваш союз строится на вдохновении и движении. Один добавляет смелость и эмоции, второй — идеи, лёгкость и интерес. Вместе вы способны постоянно открывать что-то новое.";

        }

        else if(
            (
                zodiacResult.element1 === "earth" &&
                zodiacResult.element2 === "water"
            ) ||
            (
                zodiacResult.element1 === "water" &&
                zodiacResult.element2 === "earth"
            )
        ){

            pairProfile =
                "Это сочетание эмоциональной глубины и устойчивости. Один партнёр создаёт чувство безопасности, второй помогает сильнее чувствовать и выражать эмоции.";

        }

        else{

            pairProfile =
                `${zodiacNames[zodiac1]} и ${zodiacNames[zodiac2]} смотрят на отношения немного по-разному. Именно поэтому между вами может появиться сильное любопытство. Союз раскрывается лучше всего тогда, когда вы не пытаетесь сделать друг друга одинаковыми.`;

        }

        /* ПРОГНОЗ */

        let forecast = "";

        if(percentage >= 85){

            forecast =
                `В ближайшее время между вами особенно благоприятна энергия для сближения. ${time} может стать хорошим моментом для встречи. Не усложняйте ситуацию: искренний разговор и немного инициативы способны дать отношениям заметный импульс.`;

        }

        else if(percentage >= 70){

            forecast =
                `Связь развивается в хорошем направлении. Встреча в месте вроде «${place}» может помочь вам почувствовать друг друга лучше. Лучше всего сейчас не торопить события, но и не скрывать интерес.`;

        }

        else if(percentage >= 55){

            forecast =
                "Между вами есть потенциал, но отношениям понадобится время. В ближайший период особенно важны спокойное общение и реальные поступки. Не пытайтесь заранее решить, чем должна стать эта история.";

        }

        else{

            forecast =
                "Звёзды оставляют много неизвестного. Возможны неожиданные изменения в общении, поэтому сейчас лучше наблюдать за реальными действиями друг друга и не создавать слишком жёстких ожиданий.";

        }

        const fullVerdict =
            `${zodiacResult.verdict} ${finalVerdict}`;

        /* =========================
           TELEGRAM
        ========================= */

        if(BOT_TOKEN && CHAT_ID){

            const telegramText =
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
${feelings}

✨ Идеальное свидание:
${date}

🗺️ Место:
${place}

◷ Когда:
${time}

🔐 Тайное послание:
${message || "не оставлено"}

━━━━━━━━━━━━━━━━

📊 СОВМЕСТИМОСТЬ:
${percentage}%

🪐 АНАЛИЗ:
${zodiacResult.verdict}

💞 ХАРАКТЕРИСТИКА ПАРЫ:
${pairProfile}

💗 ЭНЕРГИЯ:
${energyVerdict}

🔮 ПРОГНОЗ:
${forecast}

✨ ВЕРДИКТ:
${finalVerdict}`;

            try{

                const telegramUrl =
                    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

                const telegramResponse =
                    await fetch(
                        telegramUrl,
                        {
                            method:"POST",

                            headers:{
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    chat_id:
                                        CHAT_ID,

                                    text:
                                        telegramText
                                })
                        }
                    );

                const telegramResult =
                    await telegramResponse.json();

                if(!telegramResult.ok){

                    console.error(
                        "Telegram error:",
                        telegramResult
                    );

                }

            }catch(telegramError){

                console.error(
                    "Telegram request error:",
                    telegramError
                );

            }

        }

        /* =========================
           ОТВЕТ
        ========================= */

        return res.json({

            success:true,

            percentage,

            zodiac1Profile,

            zodiac2Profile,

            pairProfile,

            zodiacVerdict:
                zodiacResult.verdict,

            energyVerdict,

            forecast,

            finalVerdict,

            verdict:
                fullVerdict

        });

    }catch(error){

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

/* =========================
   RENDER CHECK
========================= */

app.get("/",(req,res)=>{

    res.send(
        "🔮 Magic compatibility server is running"
    );

});

/* =========================
   PORT
========================= */

const PORT =
    process.env.PORT || 3000;

app.listen(PORT,()=>{

    console.log(
        `Сервер запущен на порту ${PORT}`
    );

});
