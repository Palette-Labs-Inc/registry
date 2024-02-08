import { config } from 'dotenv';
config(); // This loads the .env file at the root of your project into process.env

import { NodeRegistry } from "@palette-labs/registry-sdk";
import { ethers, JsonRpcProvider } from 'ethers';

const run = async () => {
    const nodeRegistryContractAddress = "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb";

    // Setup provider and signer using environment variables
    const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL; // Using Sepolia as an example
    const privateKey = process.env.DEPLOYER!; // Assuming DEPLOYER is your private key env variable name
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

run().catch(console.error);
