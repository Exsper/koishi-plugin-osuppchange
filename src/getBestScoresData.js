/* eslint-disable array-callback-return */
/* eslint-disable no-sync */
/* eslint-disable no-throw-literal */
const ScoreObject = require("./score/ScoreObject");
const OsuApi = require("./ApiRequest");
class getBestScoresData {
    constructor(host, apiKey, user) {
        this.host = host;
        this.apiKey = apiKey;
        this.user = user;
    }
    async getBestScoresObject() {
        const result = await OsuApi.getUserStdBp(this.user, this.host, this.apiKey);
        if (result.code === 404) throw "查不到" + this.user + "的成绩";
        if (result.code === "error") throw "获取" + this.user + "的成绩出错";
        if ((!Array.isArray(result)) || (result.length <= 0)) throw "查不到" + this.user + "的成绩";
        const scoreObjects = result.map((item) => { return new ScoreObject(item) });
        const exScoreObjects = [];
        for (let i = 0; i < scoreObjects.length; i++) {
            exScoreObjects.push(await scoreObjects[i].extendScore());
        }
        return exScoreObjects;
    }
}

module.exports = getBestScoresData;
