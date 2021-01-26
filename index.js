/* eslint-disable consistent-return */
const Command = require("./src/Command/Command");
const CommandsInfo = require("./src/Command/CommandInfo");
class OsuPPChange {
    /**
     * @param {Object} params
     * @param {String} params.apiKey osu apiKey，必要
     * @param {String} [params.host] osu网址，默认为"osu.ppy.sh"
     * @param {Array<String>} [params.prefixs] 指令前缀，必须为单个字符，默认为[!,！]
     */
    constructor(params) {
        this.apiKey = params.apiKey || "";
        this.host = params.host || "osu.ppy.sh";
        this.prefixs = params.prefixs || ["!", "！"];
        this.commandsInfo = new CommandsInfo();
    }
    /**
     * 获得返回消息
     * @param {Number} qqId
     * @param {String} message 输入的消息
     */
    async apply(qqId, message, stat) {
        try {
            if (!message.length || message.length < 2) return "";
            if (this.prefixs.indexOf(message.substring(0, 1)) < 0) return "";
            const commandObject = new Command(message.substring(1).trim());
            const reply = await commandObject.apply(stat, this.host, this.apiKey, this.commandsInfo);
            return reply;
        } catch (ex) {
            console.log(ex);
            return "";
        }
    }
}
module.exports.osuppchange = OsuPPChange;
// koishi插件
module.exports.name = "koishi-plugin-osuppchange";
module.exports.apply = (ctx, options) => {
    const exs = new OsuPPChange(options);
    const stat = { isbusy: false };
    ctx.middleware(async (meta, next) => {
        try {
            const message = meta.message;
            const userId = meta.userId;
            const reply = await exs.apply(userId, message, stat);
            if (reply) await meta.$send(`[CQ:at,qq=${userId}]\n` + reply);
            else return next();
        } catch (ex) {
            console.log(ex);
            return next();
        }
    });
};
