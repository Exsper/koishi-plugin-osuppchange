
const GetBestScoresData = require("../getBestScoresData");
const Chart = require("lchart");
module.exports = {
    enabled: true,
    adminCommand: false,
    type: "chartd",
    info: "新旧pp差值",
    command: ["chartd"],
    argsInfo: "[玩家名]",
    call: async (host, apiKey, args) => {
        try {
            const user = args[0];
            if (!user) throw "格式不正确\n请输入expp " + module.exports.command[0] + ", " + module.exports.argsInfo + "\n";
            const exScoreObjects = await new GetBestScoresData(host, apiKey, user).getBestScoresObject();
            const length = exScoreObjects.length;
            let ppdelta = [];
            for (let i = 0; i < length; i++) {
                ppdelta.push(exScoreObjects[i].newpp.total - exScoreObjects[i].oldpp.total);
            }
            ppdelta = ppdelta.sort((a, b) => b - a);
            const xLabel = new Array(length);
            for (let i = 0; i < length; ++i) {
                xLabel[i] = i + 1;
            }
            const points = ppdelta.map((d, index) => {
                return { x: index + 1, y: d };
            });
            const chart = new Chart([{ name: "新pp-旧pp", points }], {
                padding: {
                    up: 100,
                    down: 80,
                    left: 100,
                    right: 100
                },
                color: {
                    background: "white",
                    title: "#000000",
                    titleX: "#005cc5",
                    titleY: "#7d04c8",
                    coordinate: "#000000",
                    grid: "#999999"
                },
                size: {
                    width: 1024,
                    height: 768
                },
                label: {
                    title: user,
                    titleY: "new pp - old pp",
                    divideX: 10,
                    divideY: 20
                },
                // font: "15px 宋体",
                // xDateMode: true,
                // xDateLabel: xLabel,
            });
            const picUrl = chart.draw();
            const base64 = picUrl.substring(picUrl.indexOf(",") + 1);
            return `[CQ:image,file=base64://${base64}]`;
        }
        catch (ex) {
            return ex;
        }
    }
};
