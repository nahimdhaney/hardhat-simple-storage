import { ethers, run, network } from "hardhat"

async function main() {

  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }
  console.log("Simple Storage deployed to:", simpleStorage.address)

  let currentValue = await simpleStorage.retrieve()
  console.log(`Current value: ${currentValue}`)

  console.log("Updating contract...")
  let transactionResponse = await simpleStorage.store(2)
  await transactionResponse.wait()   
  currentValue = await simpleStorage.retrieve()
  console.log(`Current value: ${currentValue}`)
  const nahim = "nahim";nahim
  transactionResponse = await simpleStorage.addPerson(nahim,7);
  await transactionResponse.wait() 
  const favoriteNumberOfNahim = await simpleStorage.nameToFavoriteNumber(nahim); 
  // await transactionResponse.wait() 
  console.log(`Nahim fav: ${favoriteNumberOfNahim}`);
}

const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    } else {
      console.log(e)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
