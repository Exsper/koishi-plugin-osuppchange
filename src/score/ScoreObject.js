/* eslint-disable radix */
const MapCalculator = require("./MapCalculator");
const utils = require("./utils");
class ScoreObject {
    constructor(score) {
        this.beatmap_id = score.beatmap_id;
        // this.score_id = score.score_id;
        this.score = parseInt(score.score);
        // this.user_id = score.user_id;
        this.time = new Date(score.date + " UTC"); // 字符串格式，YYYY-MM-DDTHH:MM:SSZ
        this.combo = parseInt(score.maxcombo);
        this.count50 = parseInt(score.count50);
        this.count100 = parseInt(score.count100);
        this.count300 = parseInt(score.count300);
        this.countmiss = parseInt(score.countmiss);
        this.countkatu = parseInt(score.countkatu);
        this.countgeki = parseInt(score.countgeki);
        // this.perfect = parseInt(score.perfect); //0,1
        this.mods = parseInt(score.enabled_mods);
        this.rank = score.rank;
        // this.pp = parseFloat(score.pp) || 0; // recent没有提供pp
        // this.replay_available = score.replay_available;
        this.acc = this.calACC();
    }
    calACC() {
        const total = this.count50 + this.count100 + this.count300 + this.countmiss;
        return total === 0 ? 0 : ((this.count50 * 50 + this.count100 * 100 + this.count300 * 300) / (total * 300) * 100);
    }
    async extendScore() {
        // 获取谱面信息
        const mapCalculator = await new MapCalculator(this.beatmap_id, {
            mods: this.mods,
            combo: this.combo,
            nmiss: this.countmiss,
            count50: this.count50,
            count100: this.count100,
            count300: this.count300,
            score: this.score,
            acc: this.acc
        }).init();
        const map = mapCalculator.map;
        if (map.artist_unicode === "") map.artist_unicode = map.artist;
        if (map.title_unicode === "") map.title_unicode = map.title;
        this.beatmapTitle = this.beatmap_id + " " + map.artist_unicode + " - " + map.title_unicode + " (" + map.creator + ") [" + map.version + "]";
        const ar = map.ar;
        const od = map.od;
        const hp = map.hp;
        const cs = map.cs;
        const resultStat = mapCalculator.calculateStatWithMods({ ar, od, hp, cs }, this.mods);
        this.fullCombo = mapCalculator.maxcombo;
        this.cs = resultStat.cs;
        this.ar = resultStat.ar;
        this.od = resultStat.od;
        this.hp = resultStat.hp;
        this.stars = mapCalculator.stars.total;
        const oldpp = {};
        oldpp.total = mapCalculator.oldpp.total;
        oldpp.aim = mapCalculator.oldpp.aim;
        oldpp.acc = mapCalculator.oldpp.acc;
        oldpp.speed = mapCalculator.oldpp.speed;
        this.oldpp = oldpp;
        const newpp = {};
        newpp.total = mapCalculator.newpp.pp;
        newpp.aim = mapCalculator.newpp.Aim;
        newpp.acc = mapCalculator.newpp.Accuracy;
        newpp.speed = mapCalculator.newpp.Speed;
        this.newpp = newpp;
        return this;
    }
    toString() {
        const beatmapParams = "CS" + this.cs.toFixed(1) + "  AR" + this.ar.toFixed(1) + "  OD" + this.od.toFixed(1) + "  HP" + this.hp.toFixed(1);
        const beatmapString = this.beatmapTitle + "\n" + beatmapParams + "  ★" + this.stars.toFixed(2) + "\n";
        const accString = "ACC：" + this.acc.toFixed(2) + "%\n";
        const comboString = "combo: " + this.combo + " / " + this.fullCombo + "\n";
        const modsString = "mod：" + utils.getScoreModsString(this.mods) + "\n";
        const rankString = "rank：" + this.rank + "\n";
        const scoreString = "score：" + utils.format_number(this.score) + "\n";
        const oldppString = "oldpp: " + this.oldpp.total.toFixed(2) + "pp (aim: " + this.oldpp.aim.toFixed(0) + "  spd: " + this.oldpp.speed.toFixed(0) + "  acc: " + this.oldpp.acc.toFixed(0) + ")";
        const newppString = "newpp: " + this.newpp.total.toFixed(2) + "pp (aim: " + this.newpp.aim.toFixed(0) + "  spd: " + this.newpp.speed.toFixed(0) + "  acc: " + this.newpp.acc.toFixed(0) + ")";
        const ppAll = oldppString + "\n" + newppString + "\n";
        return beatmapString + accString + comboString + modsString + rankString + scoreString + ppAll;
    }
}
module.exports = ScoreObject;
