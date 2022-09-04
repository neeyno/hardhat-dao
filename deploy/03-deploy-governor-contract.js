const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const {
    developmentChains,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const timeLock = await get("TimeLock")
    const governanceToken = await get("GovernanceToken")
    // constructor args
    const governorContractArgs = [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE,
    ]

    // deploying contract
    const governorContract = await deploy("GovernorContract", {
        contract: "GovernorContract",
        from: deployer,
        args: governorContractArgs, //  constructor args
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // verifying contract
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(governorContract.address, governorContractArgs)
    }

    log("------------------------------------------")
}

module.exports.tags = ["all", "governor"]
