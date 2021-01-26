/* eslint-disable class-methods-use-this */
/* eslint-disable new-cap */
const ojsama = require("ojsama");
const PPCal = require("./PPCalApi");
// const utils = require("./utils");
class MapCalculator {
    /**
     * @param {Number} beatmapId
     * @param {Object} options
     * @param {Number} [options.mods=0]
     * @param {Number} [options.combo]
     * @param {Number} [options.nmiss=0]
     * @param {Number} [options.acc=100]
     */
    constructor(beatmapId, options) {
        this.ppcal = new PPCal(beatmapId, options);
        this.beatmapId = beatmapId;
        this.mods = options.mods || 0;
        this.combo = options.combo;
        this.nmiss = options.nmiss || 0;
        this.acc = options.acc || 100;
    }
    calculateStatWithMods(values, mods) {
        return new ojsama.std_beatmap_stats(values).with_mods(mods);
    }
    async init() {
        const rawBeatmap = await this.ppcal.getMap();
        const { map } = new ojsama.parser().feed(rawBeatmap);
        this.map = map;
        this.maxcombo = this.map.max_combo();
        this.stars = new ojsama.diff().calc({ map: this.map, mods: this.mods });
        this.oldpp = ojsama.ppv2({
            stars: this.stars,
            combo: this.combo,
            nmiss: this.nmiss,
            acc_percent: this.acc,
        });
        this.newpp = await this.ppcal.getApiPPcal();
        return this;
    }
}
module.exports = MapCalculator;
