
const GetBestScoresData = require("../getBestScoresData");
module.exports = {
    enabled: true,
    adminCommand: false,
    type: "change",
    info: "pp变化最大谱面",
    command: ["change"],
    argsInfo: "[玩家名]",
    call: async (host, apiKey, args) => {
        try {
            const user = args[0];
            if (!user) throw "格式不正确\n请输入expp " + module.exports.command[0] + ", " + module.exports.argsInfo + "\n";
            const exScoreObjects = await new GetBestScoresData(host, apiKey, user).getBestScoresObject();
            const length = exScoreObjects.length;
            let ppdelta = [];
            for (let i = 0; i < length; i++) {
                ppdelta.push({ score: exScoreObjects[i], ppval: exScoreObjects[i].newpp.total - exScoreObjects[i].oldpp.total });
            }
            ppdelta = ppdelta.sort((a, b) => b.ppval - a.ppval);
            const upmax = ppdelta[0];
            const downmax = ppdelta[ppdelta.length - 1];
            let output = user + ":\n";
            output += "pp最大上涨：" + upmax.ppval.toFixed(0) + "\n";
            output += upmax.score.toString2();
            output += "pp最大下降：" + downmax.ppval.toFixed(0) + "\n";
            output += downmax.score.toString2();

            return output;
        }
        catch (ex) {
            return ex;
        }
    }
};
