# 🚗 Vehicle Ownership Transfer using Hyperledger Fabric

A permissioned blockchain-based system for securely registering vehicles, transferring ownership, and maintaining a tamper-resistant history of ownership changes.

The application combines **Hyperledger Fabric**, **Node.js/Express**, and **React** to provide a complete end-to-end vehicle ownership management system.

---

## 📌 Problem Statement

Traditional vehicle ownership records are generally maintained by centralized authorities or databases. Such systems can face challenges related to:

- Data integrity
- Unauthorized modification
- Lack of transparent ownership history
- Coordination between multiple authorized stakeholders
- Auditing previous ownership transfers

The key question addressed by this project is:

> **How can vehicle ownership records be maintained and transferred between authorized stakeholders in a secure, traceable, and tamper-resistant manner while preserving a verifiable history of ownership changes?**

---

## 💡 Proposed Solution

This project implements a **permissioned blockchain-based Vehicle Ownership Transfer System using Hyperledger Fabric**.

Authorized organizations participate in a shared blockchain network where:

- Vehicle records are stored on the blockchain ledger.
- Smart contracts enforce vehicle registration and ownership-transfer operations.
- Every ownership change becomes a blockchain transaction.
- Previous ownership states remain available through transaction history.
- Only authorized participants can interact with the network.

The application provides a web interface so users do not need to interact directly with Fabric CLI commands.

---

## ✨ Key Features

### Vehicle Registration
Register a vehicle with:

- Vehicle ID
- Registration number
- Manufacturer
- Model
- Manufacturing year
- Initial owner

### Vehicle Lookup
View complete vehicle information from the blockchain ledger.

### Ownership Transfer
Transfer a vehicle from the current owner to a new owner through a blockchain transaction.

### Ownership History
View the historical blockchain records associated with a vehicle, including:

- Transaction ID
- Timestamp
- Vehicle state
- Transaction type information

### Vehicle Dashboard
The React frontend provides:

- Vehicle statistics
- Registered vehicle cards
- Vehicle details
- Registration form
- Ownership transfer interface
- Blockchain history timeline

### Input Validation
The frontend validates:

- Required fields
- Vehicle ID format
- Registration number format
- Vehicle year
- Owner name
- Duplicate vehicle IDs
- Duplicate registration numbers

### Transfer Protection
Ownership transfers require:

- Valid new owner
- A different owner from the current owner
- Explicit confirmation before submitting the blockchain transaction

### Responsive UI
The frontend includes a modern dark-themed interface with:

- Animations
- Hover effects
- Loading states
- Transaction progress indicators
- Success and error feedback

---

## 🏗️ System Architecture

```text
                    ┌───────────────────────┐
                    │      React Frontend   │
                    │      localhost:5173   │
                    └───────────┬───────────┘
                                │
                                │ REST API
                                ▼
                    ┌───────────────────────┐
                    │   Node.js / Express   │
                    │      localhost:8000   │
                    └───────────┬───────────┘
                                │
                                │ Fabric Gateway
                                ▼
              ┌─────────────────────────────────────┐
              │       Hyperledger Fabric Network    │
              │                                     │
              │   ┌─────────────┐ ┌─────────────┐  │
              │   │    Org1     │ │    Org2     │  │
              │   │    Peer     │ │    Peer     │  │
              │   └──────┬──────┘ └──────┬──────┘  │
              │          │               │         │
              │          └───────┬───────┘         │
              │                  │                 │
              │          ┌───────▼───────┐         │
              │          │ Orderer Node  │         │
              │          └───────────────┘         │
              │                                     │
              │          Channel: mychannel        │
              │          Chaincode: vehicle        │
              └─────────────────────────────────────┘
```

---

## 🔗 Hyperledger Fabric Components

### Organizations

The network uses two organizations:

- **Org1**
- **Org2**

Each organization operates its own peer and participates in transaction endorsement.

### Peers

Peers maintain ledger data and execute chaincode.

The test network uses:

- `peer0.org1.example.com`
- `peer0.org2.example.com`

### Ordering Service

The ordering service receives transactions and establishes their order before they are committed to the ledger.

### Channel

The project uses:

```text
mychannel
```

The channel provides a private communication and ledger environment for participating organizations.

### Chaincode

The vehicle business logic is implemented as Node.js chaincode named:

```text
vehicle
```

### Fabric CA

Fabric Certificate Authorities are used to manage identities within the Fabric network.

### Fabric Gateway

The Express backend communicates with Fabric through the **Hyperledger Fabric Gateway API** rather than directly executing Fabric CLI commands.

---

## 📜 Smart Contract Functions

The `VehicleContract` implements the following functions.

### `CreateVehicle()`

Registers a new vehicle.

```text
CreateVehicle(
    vehicleId,
    registrationNumber,
    manufacturer,
    model,
    year,
    owner
)
```

The stored vehicle contains:

```text
vehicleId
registrationNumber
manufacturer
model
year
currentOwner
status
createdAt
```

---

### `ReadVehicle()`

Retrieves a vehicle from the ledger using its vehicle ID.

```text
ReadVehicle(vehicleId)
```

---

### `VehicleExists()`

Checks whether a vehicle already exists.

```text
VehicleExists(vehicleId)
```

---

### `TransferOwnership()`

Transfers ownership of an existing vehicle.

```text
TransferOwnership(
    vehicleId,
    newOwner
)
```

The function preserves the vehicle record while updating:

```text
currentOwner
```

---

### `GetAllVehicles()`

Retrieves all vehicle records stored on the ledger.

```text
GetAllVehicles()
```

---

### `GetVehicleHistory()`

Retrieves the blockchain history associated with a vehicle.

```text
GetVehicleHistory(vehicleId)
```

This allows previous ledger states to be inspected using Fabric's transaction history.

---

## 🧩 Technology Stack

### Blockchain

- Hyperledger Fabric 2.5.16
- Hyperledger Fabric CA 1.5.17
- Node.js Chaincode
- Fabric Gateway

### Backend

- Node.js
- Express.js
- `@hyperledger/fabric-gateway`
- `@grpc/grpc-js`
- CORS

### Frontend

- React
- Vite
- JavaScript
- CSS

### Infrastructure

- Docker
- Docker Compose
- WSL2
- Ubuntu

---

## 📁 Project Structure

```text
vehicle-ownership/
│
├── chaincode/
│   └── vehicle/
│       ├── index.js
│       ├── vehicleContract.js
│       └── package.json
│
├── backend/
│   ├── src/
│   │   ├── fabric.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── VehicleCard.jsx
│   │       ├── VehicleForm.jsx
│   │       ├── TransferForm.jsx
│   │       └── HistoryTimeline.jsx
│   └── package.json
│
└── README.md
```

---

## 🔄 Application Workflow

### 1. Register Vehicle

The user enters vehicle details in the React frontend.

```text
React Form
    ↓
POST /vehicles
    ↓
Express Backend
    ↓
Fabric Gateway
    ↓
CreateVehicle()
    ↓
Blockchain Ledger
```

---

### 2. View Vehicle

The frontend requests a vehicle by ID.

```text
React
  ↓
GET /vehicles/:id
  ↓
Express
  ↓
Fabric Gateway
  ↓
ReadVehicle()
  ↓
Ledger
```

---

### 3. Transfer Ownership

The user enters a new owner.

```text
User
  ↓
Validation
  ↓
Confirmation
  ↓
PUT /vehicles/:id/transfer
  ↓
Express Backend
  ↓
Fabric Gateway
  ↓
TransferOwnership()
  ↓
Blockchain Transaction
  ↓
Updated Ledger State
```

---

### 4. View Ownership History

```text
React
  ↓
GET /vehicles/:id/history
  ↓
Express
  ↓
Fabric Gateway
  ↓
GetVehicleHistory()
  ↓
Fabric Ledger History
  ↓
Timeline UI
```

---

## 🌐 REST API

The backend exposes the following endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check backend status |
| GET | `/vehicles` | Get all vehicles |
| GET | `/vehicles/:id` | Get a specific vehicle |
| POST | `/vehicles` | Register a vehicle |
| PUT | `/vehicles/:id/transfer` | Transfer ownership |
| GET | `/vehicles/:id/history` | Get ownership history |

---

## 🧪 Example Vehicle

Example vehicle data used during testing:

```json
{
  "vehicleId": "V001",
  "registrationNumber": "TN01AB1234",
  "manufacturer": "Toyota",
  "model": "Camry",
  "year": 2024,
  "currentOwner": "Rahul",
  "status": "ACTIVE"
}
```

The vehicle was initially registered to one owner and later transferred, demonstrating that the ownership history can be retrieved from the blockchain ledger.

---

## ⚙️ Running the Project

### Prerequisites

Make sure the following are installed:

- WSL2
- Ubuntu
- Docker
- Docker Compose
- Node.js
- npm
- Hyperledger Fabric binaries
- Hyperledger Fabric samples

---

## 1. Start the Fabric Network

```bash
cd ~/hyperledger-projects/fabric-samples/test-network
```

Start the test network:

```bash
./network.sh up -ca
```

Create the channel if required:

```bash
./network.sh createChannel -c mychannel
```

---

## 2. Set Fabric Environment

```bash
export FABRIC_CFG_PATH=$PWD/../config
source scripts/envVar.sh
setGlobals 1
```

---

## 3. Deploy Vehicle Chaincode

The vehicle chaincode should be packaged and deployed through the Fabric lifecycle.

Verify the committed chaincode:

```bash
peer lifecycle chaincode querycommitted \
  --channelID mychannel \
  --name vehicle
```

The current project uses the `vehicle` chaincode on:

```text
Channel: mychannel
```

---

## 4. Start the Backend

Open another terminal:

```bash
cd ~/hyperledger-projects/vehicle-ownership/backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node src/server.js
```

Expected output includes:

```text
✅ Connected to Hyperledger Fabric
✅ Channel: mychannel
✅ Chaincode: vehicle
✅ Identity: User1@org1.example.com
```

Backend:

```text
http://localhost:8000
```

---

## 5. Start the Frontend

Open another terminal:

```bash
cd ~/hyperledger-projects/vehicle-ownership/frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔐 Security and Integrity

This project uses Hyperledger Fabric's permissioned architecture to provide controlled participation in the network.

Important properties include:

### Identity-Based Access

Participants use Fabric identities rather than anonymous blockchain accounts.

### Endorsement

Transactions are processed according to the Fabric network's endorsement requirements.

### Immutable Ledger History

Once transactions are committed, previous ledger records can be inspected through Fabric's history functionality.

### Deterministic Smart Contract

The chaincode uses the transaction timestamp supplied by Fabric rather than generating a local timestamp independently on each peer. This prevents different peers from producing different transaction results during endorsement.

---

## 🧠 Why Hyperledger Fabric?

A vehicle ownership system involves known and authorized stakeholders rather than anonymous participants.

Hyperledger Fabric is appropriate because it provides:

- Permissioned membership
- Identity-based transactions
- Smart contracts
- Organization-based participation
- Endorsement policies
- Shared ledger
- Transaction history

This allows the project to demonstrate blockchain concepts in a controlled enterprise-style environment.

---

## 📊 Project Demonstration

The application demonstrates an end-to-end workflow:

```text
Register Vehicle
       ↓
Store Vehicle on Ledger
       ↓
View Vehicle
       ↓
Transfer Ownership
       ↓
Commit New Transaction
       ↓
View Updated Owner
       ↓
Inspect Complete History
```

This makes the project more than a simple CRUD application because the underlying state changes are recorded through a permissioned blockchain network.

---

## 🚀 Future Enhancements

Possible future improvements include:

- Role-based access control
- Separate dashboards for different organizations
- Private data collections
- CouchDB integration for richer queries
- Blockchain event notifications
- Digital document storage
- Vehicle ownership certificates
- Advanced audit dashboards
- Search and filtering
- Authentication for application users
- Deployment to a cloud-hosted Fabric environment

---

## 🎯 Learning Outcomes

This project provided hands-on experience with:

- Hyperledger Fabric architecture
- Organizations and peers
- Channels
- Orderers
- Certificate Authorities
- MSP identities
- Chaincode development
- Fabric chaincode lifecycle
- Transaction endorsement
- Fabric Gateway
- REST API development
- React frontend development
- Docker-based blockchain infrastructure
- Blockchain transaction history
- Full-stack blockchain application development

---

## 👩‍💻 Author

**Sana Sinha**

B.Tech CSE — Blockchain Technology

SRM Institute of Science and Technology

---

## ⭐ Project Goal

The goal of this project is to demonstrate how a permissioned blockchain can be integrated with a modern web application to create a secure, traceable, and auditable vehicle ownership management system.

1. Start Docker + WSL
Open Ubuntu/WSL and check:
docker ps

If your Fabric containers are already running, proceed to Step 2.

If they are not running, start the Fabric network:
cd ~/hyperledger-projects/fabric-samples/test-network
./network.sh up -ca

Then verify:
docker ps

You should see the peers and orderer.
2. Start the Backend
Open a new WSL terminal:
cd ~/hyperledger-projects/vehicle-ownership/backend

Start it:
node src/server.js

You should see:
✅ Connected to Hyperledger Fabric
✅ Channel: mychannel
✅ Chaincode: vehicle
✅ Identity: User1@org1.example.com

Keep this terminal running.
3. Start the Frontend
Open another new WSL terminal:
cd ~/hyperledger-projects/vehicle-ownership/frontend

Run:
npm run dev

You'll get something like:
Local: http://localhost:5173/

Open:

http://localhost:5173/
Your setup should look like this
Terminal 1
───────────
Fabric Network
     ↓
Docker
     ↓
Peers + Orderer + Chaincode


Terminal 2
───────────
Backend
node src/server.js
     ↓
http://localhost:8000


Terminal 3
───────────
Frontend
npm run dev
     ↓
http://localhost:5173

If Fabric isn't running after restart
Before starting the backend, run:
cd ~/hyperledger-projects/fabric-samples/test-network

./network.sh up -ca

export FABRIC_CFG_PATH=$PWD/../config
source scripts/envVar.sh
setGlobals 1

peer lifecycle chaincode querycommitted \
  --channelID mychannel \
  --name vehicle

You want to see your committed:
Name: vehicle
Version: 1.2
Sequence: 3

Then start the backend and frontend.

Important: Don't run ./network.sh down unless we intentionally want to tear down the Fabric network.
