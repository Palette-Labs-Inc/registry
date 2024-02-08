import { config } from 'dotenv';
config(); // This loads the .env file at the root of your project into process.env

import { NodeRegistry, NodeStatus, NodeType } from "@palette-labs/registry-sdk";
import { ethers, JsonRpcProvider } from 'ethers';
import { NodeEntryStruct } from '@palette-labs/registry-contracts/typechain-types/INodeRegistry';


/*const register = async () => {
    const nodeRegistryContractAddress = "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb";

    // Setup provider and signer using environment variables
    const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL; // Using Sepolia as an example
    const privateKey = process.env.SIGNER!; // Assuming DEPLOYER is your private key env variable name
    const provider = new JsonRpcProvider(providerUrl);

    const signer = new ethers.Wallet(privateKey, provider);

    // Instantiate the NodeRegistry SDK and connect it with the signer
    const nodeRegistry = new NodeRegistry(nodeRegistryContractAddress);
    nodeRegistry.connect(signer);

    // Define a new node to register
    const newNode = {
        name: "Example Node",
        callbackUrl: "http://example.com/callback",
        location: ["882681a339fffff"], // Example location
        industryCode: "EX",
        nodeType: 0, // Assuming 0 corresponds to PSN
    };

    console.log("Registering a new node...");

    // Register the new node
    try {
        const transaction = await nodeRegistry.registerNode(newNode);
        await transaction.wait(); // Optionally wait for the transaction to be mined

        const uid = await transaction.wait()

        console.log(`Node registered with UID: ${uid}`);

        // Retrieve the registered node by UID
        console.log("Retrieving the registered node...");
        
        const nodeEntry = await nodeRegistry.getNode({ uid });
        console.log("Retrieved node:", nodeEntry);
    } catch (error) {
        console.error("Error during node registration or retrieval:", error);
    }
};

const getNodeDuration = async (nodeRegistry: NodeRegistry) => {
    const uid = '0x6da4e3a839151079116291a9bac3eb762d353e08b08f83ba37af8bf588fd90a1';

    try {
        const startTime = Date.now(); 
        await nodeRegistry.getNode({ uid });
        const duration = Date.now() - startTime; 
        return duration; 
    } catch (error) {
        console.error("Error during node retrieval:", error);
        return 0;
    }
};


const testNode = async () => {
    // nodeRegistryContractAddress is from yarn deploy:base-sepolia - see README in registry-contracts for the latest address.
    const nodeRegistryContractAddress = "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb";
    const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL; 
    const privateKey = process.env.SIGNER!; 
    const provider = new JsonRpcProvider(providerUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    const nodeRegistry = new NodeRegistry(nodeRegistryContractAddress);
    nodeRegistry.connect(signer);

    let totalDuration = 0;
    const numberOfQueries = 100;

    const progressBarLength = 20; // Length of the progress bar

    for (let i = 0; i < numberOfQueries; i++) {
        const duration = await getNodeDuration(nodeRegistry);
        totalDuration += duration;

        const progress = Math.round(((i + 1) / numberOfQueries) * progressBarLength);
         const filledBar = '|'.repeat(progress);
         const emptyBar = '.'.repeat(progressBarLength - progress);
         process.stdout.write(`\rProgress: [${filledBar}${emptyBar}] ${i + 1}/${numberOfQueries}`);
     }

     console.log("\nDone."); 

    const averageDuration = totalDuration / numberOfQueries;
    console.log(`\nAverage query time: ${averageDuration} ms`);
};

// testNode().catch(console.error);

*/

async function testVerifySignature() {
    const nodeRegistryContractAddress = "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb";
    const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL!;
    const privateKey = process.env.SIGNER!;
    const provider = new JsonRpcProvider(providerUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    const nodeRegistry = new NodeRegistry(nodeRegistryContractAddress, { signerOrProvider: signer });

    // Example data to construct the signature header
    const url = '/api/node';
    const method = 'POST';
    const body = { data: 'Example data' };
    const node: NodeEntryStruct = {
        uid: 'example-uid',
        name: 'Example Node',
        callbackUrl: 'http://example.com/callback',
        location: ['882681a339fffff'],
        industryCode: 'EX',
        nodeType: NodeType.PSN,
        status: NodeStatus.INITIATED,
        owner: signer.address
    };

    // Construct the signature header
    const signatureHeader = await nodeRegistry.constructSignatureHeader(url, method, body, signer, node);

    console.log(`Constructed Signature Header: ${signatureHeader}`);

    // Simulate receiving the request and signature header
    // For the purpose of this test, we'll reuse the `url`, `method`, and `body` used to construct the signature
    // Normally, you would extract these from the actual received HTTP request
    const isSignatureValid = await nodeRegistry.verifySignatureHeader(signatureHeader, method, url, body);

    if (isSignatureValid) {
        console.log('Signature verification succeeded.');
    } else {
        console.log('Signature verification failed.');
    }
}

testVerifySignature().catch(console.error);