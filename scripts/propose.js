const { ethers, network } = require("hardhat")
const {
    NEW_STORE_VALUE,
    FUNCTION_TO_CALL,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalFile,
} = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
const fs = require("fs")

async function propose(args, functionTocall, proposalDescription) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const chainId = network.config.chainId.toString()
    //const { deployer } = await getNamedAccounts()

    const encodedFuncCall = box.interface.encodeFunctionData(
        functionTocall,
        args
    )
    console.log(`Proposing ${FUNCTION_TO_CALL} on ${box.address} with ${args}`)
    console.log(`Proposal description: \n${proposalDescription}`)

    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFuncCall],
        proposalDescription
    )
    const proposeReceipt = await proposeTx.wait(1)
    //const proposalId = proposeReceipt.event[0].args.proposalId

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1, 1000)
    }

    const proposalId = proposeReceipt.events[0].args.proposalId
    let proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"))
    // if (chainId in proposals) {
    //     proposals[chainId].push(proposalId.toString())
    // }
    // proposals[chainId.toString()].push(proposalId.toString())
    // fs.writeFileSync(proposalFile, JSON.stringify(proposals))

    if (chainId in proposals) {
        if (!proposals[chainId].includes(proposalId.toString())) {
            proposals[chainId].push(proposalId.toString())
        }
    } else {
        proposals[chainId] = [proposalId.toString()]
    }
    fs.writeFileSync(proposalFile, JSON.stringify(proposals))
}

propose([NEW_STORE_VALUE], FUNCTION_TO_CALL, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
