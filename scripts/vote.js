const { ethers, network } = require("hardhat")
const {
    proposalFile,
    VOTING_PERIOD,
    developmentChains,
} = require("../helper-hardhat-config")
const fs = require("fs")
const { moveBlocks } = require("../utils/move-blocks")

const index = 0

async function main(proposalIndex) {
    const chainId = network.config.chainId.toString()
    const governor = await ethers.getContract("GovernorContract")
    const proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"))
    const proposalId = proposals[chainId][proposalIndex]
    const reason = "It's become more spacious"

    // 0 = against, 1 = for, 2 = abstain
    const voteWay = 1
    const voteTx = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        reason
    )
    await voteTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1, 1000)
    }
    console.log("Voted! " + reason)
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
