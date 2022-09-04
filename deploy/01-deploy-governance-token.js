const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // deploying contract
    const governanceToken = await deploy("GovernanceToken", {
        contract: "GovernanceToken",
        from: deployer,
        args: [], //  constructor args
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    await delegate(governanceToken.address, deployer)
    log("Delegated")

    // verifying contract
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(governanceToken.address, [])
    }

    log("------------------------------------------")
}

const delegate = async (governanceTokenAddress, delegatedAccount) => {
    const governanceToken = await ethers.getContractAt(
        "GovernanceToken",
        governanceTokenAddress
    )
    const tx = await governanceToken.delegate(delegatedAccount)
    await tx.wait(1)
    console.log(
        `Checkpoint ${await governanceToken.numCheckpoints(delegatedAccount)}`
    )
}

module.exports.tags = ["all", "token"]
