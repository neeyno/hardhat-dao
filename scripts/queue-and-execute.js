const { ethers, network } = require("hardhat")
const {
    NEW_STORE_VALUE,
    FUNCTION_TO_CALL,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    MIN_DELAY,
} = require("../helper-hardhat-config")
const { moveBlocks, moveTime } = require("../utils/move-blocks")

async function queueAndExecute(args, functionTocall, proposalDescription) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const chainId = network.config.chainId.toString()
    const encodedFuncCall = box.interface.encodeFunctionData(
        functionTocall,
        args
    )
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(proposalDescription)
    )

    console.log("Queueing...")
    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFuncCall],
        descriptionHash
    )
    await queueTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1, 0, 0)
    }

    console.log("Executing...")
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFuncCall],
        descriptionHash
    )
    await executeTx.wait(1)
    const boxNewValue = await box.retrieve()
    console.log(`Box new value: ${boxNewValue.toString()}`)
}

queueAndExecute([NEW_STORE_VALUE], FUNCTION_TO_CALL, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
