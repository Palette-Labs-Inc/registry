# UTP Registry
Registry infrastructure for the universal transaction protocol

### Registrar
Palette Labs, Inc. has the unilateral authority to add a new record to the registry. Over time, the registration process will become fully decentralized and adding a new, verifiable record to the registry will be permissionless. 

### Node operators
Node operators are businesses, non-profits, foundations, individuals, application developers, academic institutions, or other entities that host, store, and serve user data for the network. Node operators can represent and service one or many sides of the network's user's and are represented by a network-defined code accordingly.
- Universal Node Operators support the seller, buyer, and courier sides of the network and are defined by the three letter enumerated string ***UNO***
- Buyer Supporting Node Operators support the buyer side of the network and are defined by the three letter enumerated string ***BSN***
- Seller Supporting Node Operators support the seller side of the network and are defined by the three letter enumerated string ***SSN***
- Courier Supporting Node Operators support the courier side of the network and are defined by the three letter enumerated string ***CSN***

## Overview
The Registry Infrastructure stores identity, industry, and coverage information about Node operators. Approved registrants obtain VERIFIED status after a brief community and technical review. 

### Registration
Node operators submit the relevant credentials to the registrar. After submitting credentials to the registrar, node operators undergo a community and technical review. After completing a community and technical review, the registrar creates an entry in the table for the Node. 

### Community review
The community review involves evaluating the operator's reputation, trustworthiness, and alignment with the network's values. The community members actively participate in the evaluation process, considering factors such as track record, reputation, trustworthiness, and alignment. They provide feedback, raise concerns, and engage in discussions to reach a consensus on approving or rejecting the operator's application. Once a decision is made, the operator's status is updated accordingly, indicating their eligibility to participate as a registered node operator.

### Technical review
The technical review ensures that the node operator is able to receive, interpert, respond to and authenticate the server-to-server communication standards for their self-designated code (UNO, BSN, SSN, or CSN) as defined in the [protocol specification documents](https://github.com/Palette-Labs-Inc/protocol/blob/main/docs/SPECIFICATION.md). Until the Node is able to successfully respond to and authenticate all requests for the relevant API endpoints, their status within the registry will be set to IN_REVIEW.

## Table
Once all checks are passed, the Registrar creates an entry for the participant on the Registry with the status as VERIFIED. Below is an example of the table.

|   uuid     |   node      |         callbackUrl          | servicablePolygon | industryCode |    Type     |        status       |  validFrom  |   validTo   |     created     |    updated    |
|------------|-------------|-------------------------|-------------------|---------------|-------------|---------------------|--------------|--------------|-----------------|---------------|
| 5k8D92xR |    Nosh     | https://noshdelivery.xyz |   [{lat,lng},...]    |     FOOD      | UNO | VERIFIED | utc timestamp | utc timestamp | utc timestamp   | utc timestamp |
| J3t7fGhE |  GrubDash  | https://grubdash.xyz  |   [{lat,lng},...]    |     FOOD      | UNO | VERIFIED | utc timestamp | utc timestamp | utc timestamp   | utc timestamp |
| qR9u2YsT |  RocketRides  | https://rocketrides.xyz  |   [{lat,lng},...]    |     RIDES      | CSN | VERIFIED | utc timestamp | utc timestamp | utc timestamp   | utc timestamp |
| dF8nH7jK |  SnackAttack  | https://snackattack.xyz  |   [{lat,lng},...]    |     FOOD      | BSN | VERIFIED | utc timestamp | utc timestamp | utc timestamp   | utc timestamp |
| tN6sH4mE |  Drivers Coop  | https://drivers.coop  |   [{lat,lng},...]    |     RIDES      | CSN | VERIFIED | utc timestamp | utc timestamp | utc timestamp   | utc timestamp |
| eG2hT6nQ |  Boulder Local  | https://boulderlocal.org  |   [{lat,lng},...]    |     RIDES      | SSN | VERIFIED | utc timestamp | utc timestamp | utc timestamp   | utc timestamp |

### URI
- the domain name of the node url must be an ```https``` domain with a ```.com```, ```.xyz```, ```.org```, or ```.coop``` extension.
