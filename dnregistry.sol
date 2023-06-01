// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";


contract TableStorage is Ownable {
    struct NodeEntry {
        string uuid;
        string node;
        string webhook;
        string serviceable_region;
        string industry_code;
        string category; //should be type but type is a keyword, discuss how we want to change this
        string status;
        string valid_from;
        string valid_to;
        string created;
        string updated;
    }

    struct userEntry {
        string userName;
        address publicKey;
        string node;
        string host_id;
    }

    UserEntry[] public userTable;
    mapping(address => uint256) private userAddressToIndex;  // Index mapping for user address
    mapping(string => uint256) private userNameToIndex;  // Index mapping for user name

    NodeEntry[] public nodeTable;
    mapping(uint256 => uint256) private nodeIdToIndex;  // Index mapping for node_id
    mapping(address => bool) private authorizedOwners; // Mapping to track authorized owners

    constructor() {
        authorizedOwners[msg.sender] = true; // Set the contract deployer as an authorized owner
    }

    function addAuthorizedOwner(address _owner) public onlyOwner {
        authorizedOwners[_owner] = true;
    }
    function removeAuthorizedOwner(address _owner) public onlyOwner {
        require(_owner != msg.sender, "Cannot remove yourself as an authorized owner.");
        authorizedOwners[_owner] = false;
    }
    function isAuthorizedOwner(address _owner) public view returns (bool) {
        return authorizedOwners[_owner];
    }


    function addNodeEntry(string memory _uuid, string memory _node, string memory _webhook,
        string memory _serviceable_region, string memory _industry_code, string memory _category,
        string memory _status, string memory _valid_from, string memory _valid_to, string memory _created,
        string memory _updated) public onlyOwner {
        require(nodeIdToIndex[_nodeId] == 0, "Entry with the given node_id already exists.");  // Ensure node_id is unique
        Entry memory newEntry = NodeEntry(_uuid, _node, _webhook, _serviceable_region, _industry_code, _category, _status, _valid_from, _valid_to, _created, _updated);
        nodeTable.push(newEntry);
        nodeIdToIndex[_nodeId] = nodeTable.length;
    }
    
    function getNodeEntryCount() public view returns (uint256) {
        return NodeEntry.length;
    }
    
    function getEntryByNodeId(uint256 _uuid ) public view returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(nodeIdToIndex[_nodeId] != 0, "No entry found for the given node_id.");
        uint256 index = nodeIdToIndex[_nodeId] - 1;
        Entry storage entry = nodeTable[index];
        return (
            entry.uuid,
            entry.node,
            entry.webhook,
            entry.serviceable_region,
            entry.industry_code,
            entry.category,
            entry.status,
            entry.valid_from,
            entry.valid_to,
            entry.created,
            entry.updated
        );
    }
    
    function updateNodeEntry(string memory _uuid, string memory _node, string memory _webhook, string memory _serviceable_region, string memory _industry_code, string memory _category, string memory _updated) public onlyOwner{
        require(nodeIdToIndex[_uuid] != 0, "No entry found for the given node_id.");
        uint256 index = nodeIdToIndex[_uuid] - 1;
        Entry storage entry = nodeTable[index];
        require(msg.sender == entry.publicKey, "Only the owner of the entry can update it.");
        entry.node = _node;
        entry.webhook = _webhook;
        entry.serviceable_region = _serviceable_region;
        entry.industry_code = _industry_code;
        entry.category = _category;
        entry.updated = _updated;
    }

    function deleteNodeEntry(uint256 _uuid) public onlyOwner {
        require(nodeIdToIndex[_uuid] != 0, "No entry found for the given node_id.");
        uint256 index = nodeIdToIndex[_uuid] - 1;
        delete table[index];
        delete nodeIdToIndex[_uuid];
    }

    function addUser (string memory _uuid, address _publicKey, string memory _userName, string memory _node, string memory _host_id) public onlyOwner {
        require(userAddressToIndex[_publicKey] == 0, "Entry with the given public key already exists.");  // Ensure public key is unique
        require(userNameToIndex[_userName] == 0, "Entry with the given user name already exists.");  // Ensure user name is unique
        Entry memory newEntry = UserEntry(_uuid, _publicKey, _userName, _node, _host_id);
        userTable.push(newEntry);
        userAddressToIndex[_publicKey] = userTable.length;
        userNameToIndex[_userName] = userTable.length;
    }

    function getUserEntryCount() public view returns (uint256) {
        return userTable.length;
    }

    function updateUser(string memory _userName, string _node, string _host_id) public onlyOwner {
        require(userAddressToIndex[_publicKey] != 0, "No entry found for the given public key.");
        uint256 index = userAddressToIndex[_publicKey] - 1;
        Entry storage entry = userTable[index];
        require(msg.sender == entry.publicKey, "Only the owner of the entry can update it.");
        entry.userName = _userName;
        entry.node = _node;
        entry.host_id = _host_id;
    }

    
}
