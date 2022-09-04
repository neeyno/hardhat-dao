const { ethers } = require("hardhat")
require("dotenv").config()

const networkConfig = {
    4: {
        name: "rinkeby",
    },
    31337: {
        name: "hardhat",
    },
}

const developmentChains = ["hardhat", "localhost"]

//const BASE_FEE = ethers.utils.parseEther("0.25") //0.25 LINK - "premium" section at chainlink docs
//const GAS_LINK_PRICE = 1e9 // 1000000000 // link per gas, calculated value based on the gas price on the chain
const MIN_DELAY = 3600
const VOTING_DELAY = 1
const VOTING_PERIOD = 5
const QUORUM_PERCENTAGE = 4
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
const NEW_STORE_VALUE = 77
const FUNCTION_TO_CALL = "store"
const PROPOSAL_DESCRIPTION = "test proposal: store 77 in the box"
const proposalFile = "proposals.json"

module.exports = {
    networkConfig,
    developmentChains,
    MIN_DELAY,
    VOTING_PERIOD,
    VOTING_DELAY,
    QUORUM_PERCENTAGE,
    ADDRESS_ZERO,
    NEW_STORE_VALUE,
    FUNCTION_TO_CALL,
    PROPOSAL_DESCRIPTION,
    proposalFile,
}
