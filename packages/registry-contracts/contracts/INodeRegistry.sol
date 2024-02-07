// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Define an enum for a Provider Supporting Node and Buyer Supporting Node
enum NodeType {
    PSN, // provider supporting node
    BSN, // buyer supporting node
    GP // gateway provider
}

// Define an enum for the status
enum NodeStatus {
    INITIATED,
    VERIFIED,
    INVALID
}

struct NodeEntry {
    bytes32 uid; // Unique identifier
    string name; // Name of the node
    string callbackUrl; // Callback URL of the server for the node
    string[] location; // Array of h3 strings for the supported location
    string industryCode; // Industry code
    address owner; // the wallet holder of the registrant.
    NodeType nodeType; // Type of the node (PSN or BSN)
    NodeStatus status; // Status of the node (VERIFIED or UNVERIFIED)
}

struct RegisterNodeEntryParams {
    string name; // Name of the node
    string callbackUrl; // Callback URL of the server for the node
    string[] location; // Array of h3 strings for the supported location
    string industryCode; // Industry code
    NodeType nodeType; // Type of the node (PSN or BSN)
}

/// @title INodeEntry
/// @notice Interface for Node Entry management in a Solidity smart contract.
interface INodeRegistry {
    /// @notice Emitted when a new node has been registered
    /// @param uid The schema UID.
    /// @param registerer The address of the account used to register the schema.
    /// @param node The node entry data.
    event Registered(bytes32 indexed uid, address indexed registerer, NodeEntry node);

    /// @notice Registers a new node entry
    /// @param entry The NodeEntry data.
    /// @return The UID of the registered node.
    function registerNode(RegisterNodeEntryParams calldata entry) external returns (bytes32);

    /// @notice Retrieves a node entry by its UID
    /// @param uid The UID of the node to retrieve.
    /// @return The NodeEntry data.
    function getNode(bytes32 uid) external view returns (NodeEntry memory);
}
