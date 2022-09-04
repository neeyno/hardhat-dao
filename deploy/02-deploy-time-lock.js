const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // constructor args
    const timeLockArgs = [MIN_DELAY, [], []]

    // deploying contract
    const timeLock = await deploy("TimeLock", {
        contract: "TimeLock",
        from: deployer,
        args: timeLockArgs, //  constructor args
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // verifying contract
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(timeLock.address, timeLockArgs)
    }

    log("------------------------------------------")
}

module.exports.tags = ["all", "timelock"]
