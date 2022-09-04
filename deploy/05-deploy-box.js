const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // deploying contract
    const box = await deploy("Box", {
        contract: "Box",
        from: deployer,
        args: [], //  constructor args
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("Transfering ownership...")
    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTx = await boxContract.transferOwnership(
        timeLock.address
    )
    await transferOwnerTx.wait(1)

    // verifying contract
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(box.address, [])
    }

    log("------------------------------------------")
}

module.exports.tags = ["all", "box"]
