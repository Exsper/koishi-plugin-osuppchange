const querystring = require("querystring");
const fetch = require("node-fetch");
const fs = require("fs").promises;

class PPCalApi {
    /**
     * @param {Number} beatmapId
     * @param {Object} options
     */
    constructor(beatmapId, options) {
        this.beatmapId = beatmapId;
        this.mods = options.mods;
        this.combo = options.combo;
        this.nmiss = options.nmiss;
        this.count50 = options.count50;
        this.count100 = options.count100;
        this.count300 = options.count300;
        this.score = options.score;
    }

    // eslint-disable-next-line class-methods-use-this
    async apiCall(_path, _data, isText = false) {
        const contents = querystring.stringify(_data);
        const url = "http://localhost:1611/" + _path + "?" + contents;
        if (isText) {
            const data = await fetch(url, { timeout: 20000 }).then((res) => res.text());
            return data;
        }
        const data = await fetch(url, { timeout: 20000 }).then((res) => res.json());
        return data;
    }


    async getBeatmapPath() {
        const data = { id: this.beatmapId };
        const filepath = await this.apiCall("getBeatmap", data, true);
        return filepath;
    }

    async getMap() {
        try {
            const filepath = await this.getBeatmapPath();
            const rawBeatmap = await fs.readFile(filepath, "utf-8");
            return rawBeatmap;
        }
        catch (ex) {
            throw "获取谱面失败";
        }
    }

    async getApiDiff() {
        try {
            const data = { id: this.beatmapId, mods: this.mods, m: 0 };
            const filepath = await this.apiCall("difficulty", data);
            return filepath;
        }
        catch (ex) {
            throw "获取谱面失败";
        }
    }

    async getApiPPcal() {
        try {
            const data = { id: this.beatmapId, mods: this.mods, m: 0 };
            if (this.combo) data.combo = this.combo;
            if (this.nmiss) data.miss = this.nmiss;
            if (this.count50) data["50"] = this.count50;
            if (this.count100) data["100"] = this.count100;
            const filepath = await this.apiCall("cal", data);
            return filepath;
        }
        catch (ex) {
            throw "获取谱面失败";
        }
    }

    async init() {
        try {
            const sr = "star rating";
            const stars = await this.getApiDiff();
            this.stars = stars[sr];
            this.pp = await this.getApiPPcal();
            return this;
        }
        catch (ex) {
            console.log(ex);
            return "下载谱面出错";
        }
    }
}

module.exports = PPCalApi;
