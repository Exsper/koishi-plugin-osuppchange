const osuppchange = require("./index").osuppchange;
// eslint-disable-next-line new-cap
const exs = new osuppchange({
    apiKey: require("./apiToken.json").apiToken,
});

const myQQ = 1;
const stat = { isbusy: false };
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", async (line) => {
    console.log(await exs.apply(myQQ, line, stat));
});
