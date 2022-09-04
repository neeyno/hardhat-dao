const { network, ethers } = require("hardhat")

function sleep(timeInMs) {
    return new Promise((resolve) => setTimeout(resolve, timeInMs))
}

async function moveTime(amount) {
    await network.provider.send("evm_increaseTime", [amount])
    console.log(`Moved time for ${amount} msec`)
}

async function moveBlocks(amount, sleepAmount = 0, timeAmount = 0) {
    console.log("Moving blocks...")
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })

        if (sleepAmount > 0) {
            console.log(`block ${index + 1}`)
            await sleep(sleepAmount)
        }
    }

    if (timeAmount > 0) {
        console.log(`Moving time...`)
        await moveTime(timeAmount)
    }
}

module.exports = {
    moveBlocks,
    sleep,
    moveTime,
}
