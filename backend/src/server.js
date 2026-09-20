'use strict';

const express = require('express');
const cors = require('cors');
const { connectToFabric } = require('./fabric');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());
const PORT = 8000;

app.use(express.json());

let gateway;
let client;
let contract;

/*
 * Convert Fabric Gateway's Uint8Array result into JSON.
 */
function parseResult(result) {
    const text = Buffer.from(result).toString('utf8');

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

/*
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Vehicle Ownership API',
        fabric: 'connected'
    });
});


/*
 * Get all vehicles
 */
app.get('/vehicles', async (req, res) => {
    try {
        const result = await contract.evaluateTransaction(
            'GetAllVehicles'
        );

        res.json(parseResult(result));
    } catch (error) {
        console.error('GetAllVehicles error:', error);

        res.status(500).json({
            error: 'Failed to retrieve vehicles',
            details: error.message
        });
    }
});


/*
 * Get one vehicle
 */
app.get('/vehicles/:id', async (req, res) => {
    try {
        const result = await contract.evaluateTransaction(
            'ReadVehicle',
            req.params.id
        );

        res.json(parseResult(result));
    } catch (error) {
        console.error('ReadVehicle error:', error);

        res.status(404).json({
            error: `Vehicle ${req.params.id} not found`,
            details: error.message
        });
    }
});


/*
 * Register a new vehicle
 */
app.post('/vehicles', async (req, res) => {
    try {
        const {
            vehicleId,
            registrationNumber,
            manufacturer,
            model,
            year,
            owner
        } = req.body;

        if (
            !vehicleId ||
            !registrationNumber ||
            !manufacturer ||
            !model ||
            !year ||
            !owner
        ) {
            return res.status(400).json({
                error: 'All vehicle fields are required'
            });
        }

        const result = await contract.submitTransaction(
            'CreateVehicle',
            vehicleId,
            registrationNumber,
            manufacturer,
            model,
            String(year),
            owner
        );

        res.status(201).json(parseResult(result));
    } catch (error) {
        console.error('CreateVehicle error:', error);

        res.status(500).json({
            error: 'Failed to create vehicle',
            details: error.message
        });
    }
});


/*
 * Transfer ownership
 */
app.put('/vehicles/:id/transfer', async (req, res) => {
    try {
        const { newOwner } = req.body;

        if (!newOwner) {
            return res.status(400).json({
                error: 'newOwner is required'
            });
        }

        const result = await contract.submitTransaction(
            'TransferOwnership',
            req.params.id,
            newOwner
        );

        res.json(parseResult(result));
    } catch (error) {
        console.error('TransferOwnership error:', error);

        res.status(500).json({
            error: 'Failed to transfer ownership',
            details: error.message
        });
    }
});


/*
 * Get complete vehicle history
 */
app.get('/vehicles/:id/history', async (req, res) => {
    try {
        const result = await contract.evaluateTransaction(
            'GetVehicleHistory',
            req.params.id
        );

        res.json(parseResult(result));
    } catch (error) {
        console.error('GetVehicleHistory error:', error);

        res.status(404).json({
            error: `History for vehicle ${req.params.id} not found`,
            details: error.message
        });
    }
});


/*
 * Start server only after Fabric connection succeeds.
 */
async function startServer() {
    try {
        const connection = await connectToFabric();

        gateway = connection.gateway;
        client = connection.client;
        contract = connection.contract;

        console.log('✅ Connected to Hyperledger Fabric');
        console.log('✅ Channel: mychannel');
        console.log('✅ Chaincode: vehicle');

        app.listen(PORT, () => {
            console.log(
                `🚗 Vehicle Ownership API running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error('❌ Failed to connect to Fabric');
        console.error(error);

        process.exit(1);
    }
}


/*
 * Clean shutdown
 */
function shutdown() {
    console.log('\nShutting down backend...');

    if (gateway) {
        gateway.close();
    }

    if (client) {
        client.close();
    }

    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();