import { ethers } from 'ethers'
import { NodeRegistry__factory } from '@palette-labs/registry-contracts/typechain-types';
// Set up provider (using Sepolia as an example)
const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');

// Contract details
const contractAddress = '0x56e3B524302Ec60Ec7850aF492D079367E03e5fb';

const nodeRegistryContract = NodeRegistry__factory.connect(
    contractAddress,
    provider
);


/*async function getRegisteredEvents(startBlock: number, endBlock: number, batchSize = 1000) {
    let currentBlock = startBlock;

    while (currentBlock <= endBlock) {
        const toBlock = Math.min(currentBlock + batchSize - 1, endBlock);

        const filter = nodeRegistryContract.filters.Registered();
        const logs = await nodeRegistryContract.queryFilter(filter, currentBlock, toBlock);

        console.log('logs.length:',logs.length, `${currentBlock}:${toBlock}`)

        // Loop through the event logs and access the event data strongly typed
        logs.forEach(log => {
            const event = log.args;
            console.log(`UID: ${event}`);
            console.log(`Registerer: ${event.registerer}`);
            console.log(`Node Name: ${event.node.name}`);
            console.log(`Node Callback URL: ${event.node.callbackUrl}`);
            console.log(`Node Industry Code: ${event.node.industryCode}`);
            console.log(`Node Owner: ${event.node.owner}`);
            console.log(`Node Type: ${event.node.nodeType}`);
            console.log(`Node Status: ${event.node.status}`);
        });
    }
}
*/



// Use the contract's ABI to create an ethers Interface instance
const contractInterface = new ethers.Interface(NodeRegistry__factory.abi);

// Function to get the event topic hash using the event name
function getEventTopicHash(eventName: string): string | undefined {
    try {
        const eventFragment = contractInterface.getEvent(eventName);
        return eventFragment ? ethers.keccak256(ethers.toUtf8Bytes(eventFragment.format())) : undefined;
    } catch (error) {
        console.error("Could not find event or compute topic hash:", error);
        return undefined;
    }
}


async function getRegisteredEvents2(startBlock: number, endBlock: number, batchSize = 1000) {

    const eventTopicHash = getEventTopicHash("Registered");
    console.log('eventTopicHash: ',JSON.stringify(eventTopicHash));
    const filter = nodeRegistryContract.filters.Registered();

    
    let currentBlock = startBlock;

    while (currentBlock <= endBlock) {
        const toBlock = Math.min(currentBlock + batchSize - 1, endBlock);

        try {
            console.log(`Fetching 'Registered' events from block ${currentBlock} to ${toBlock}`);
            
            const registeredLogs = await provider.getLogs({
                fromBlock: currentBlock,
                toBlock: toBlock,
                address: contractAddress,
                topics: [eventTopicHash!], // Use the manually created topic hash
            });

            console.log('Registered logs', registeredLogs.length);

            // Process each registered log
            registeredLogs.forEach(log => {
                const logCopy = {
                    topics: [...log.topics], // Spread into a new array to make it mutable
                    data: log.data,
                };
            
                // Now decode the log
                const decodedEvent = contractInterface.parseLog(logCopy);
                console.log('decodedEvent:',decodedEvent);
                if (decodedEvent){
                    console.log('decodedEvent:',decodedEvent.args);
                }
            });

            currentBlock = toBlock + 1; // Move to the next batch
        } catch (error) {
            console.error('Error fetching logs:', error);
            break; // Exit loop on error
        }
    }
}

async function main() {

    // Adjust these values based on your needs
    const startBlock = 5789193; // Block at which the contract was deployed
    const latestBlock = 5798192; //await provider.getBlockNumber(); // Dynamically fetch the latest block number

    // getRegisteredEvents(startBlock, latestBlock).catch(console.error);
    getRegisteredEvents2(startBlock, latestBlock).catch(console.error);

}


main()
