'use strict';

const { Contract } = require('fabric-contract-api');

class VehicleContract extends Contract {

    // Create a new vehicle
    async CreateVehicle(
        ctx,
        vehicleId,
        registrationNumber,
        manufacturer,
        model,
        year,
        owner
    ) {

        const exists = await this.VehicleExists(ctx, vehicleId);

        if (exists) {
            throw new Error(`Vehicle ${vehicleId} already exists`);
        }

        const txTimestamp = ctx.stub.getTxTimestamp();

        const seconds = Number(txTimestamp.seconds);
        const nanos = Number(txTimestamp.nanos);

        const createdAt = new Date(seconds * 1000 + Math.floor(nanos / 1000000)).toISOString();

        const vehicle = {
            vehicleId: vehicleId,
            registrationNumber: registrationNumber,
            manufacturer: manufacturer,
            model: model,
            year: parseInt(year),
            currentOwner: owner,
            status: 'ACTIVE',
            createdAt: createdAt
        };

        await ctx.stub.putState(
            vehicleId,
            Buffer.from(JSON.stringify(vehicle))
        );

        return JSON.stringify(vehicle);
    }


    // Read a vehicle
    async ReadVehicle(ctx, vehicleId) {

        const vehicleJSON = await ctx.stub.getState(vehicleId);

        if (!vehicleJSON || vehicleJSON.length === 0) {
            throw new Error(`Vehicle ${vehicleId} does not exist`);
        }

        return vehicleJSON.toString();
    }


    // Check whether a vehicle exists
    async VehicleExists(ctx, vehicleId) {

        const vehicleJSON = await ctx.stub.getState(vehicleId);

        return vehicleJSON && vehicleJSON.length > 0;
    }


    // Transfer vehicle ownership
    async TransferOwnership(ctx, vehicleId, newOwner) {

        const vehicleJSON = await ctx.stub.getState(vehicleId);

        if (!vehicleJSON || vehicleJSON.length === 0) {
            throw new Error(`Vehicle ${vehicleId} does not exist`);
        }

        const vehicle = JSON.parse(vehicleJSON.toString());

        const previousOwner = vehicle.currentOwner;

        vehicle.currentOwner = newOwner;

        await ctx.stub.putState(
            vehicleId,
            Buffer.from(JSON.stringify(vehicle))
        );

        return JSON.stringify({
            vehicleId: vehicleId,
            previousOwner: previousOwner,
            newOwner: newOwner
        });
    }


    // Get all vehicles
    async GetAllVehicles(ctx) {

        const iterator = await ctx.stub.getStateByRange('', '');

        const vehicles = [];

        let result = await iterator.next();

        while (!result.done) {

            if (result.value && result.value.value.toString()) {

                const vehicle = JSON.parse(
                    result.value.value.toString('utf8')
                );

                vehicles.push(vehicle);
            }

            result = await iterator.next();
        }

        await iterator.close();

        return JSON.stringify(vehicles);
    }


    // Get complete ownership history
    async GetVehicleHistory(ctx, vehicleId) {

        const exists = await this.VehicleExists(ctx, vehicleId);

        if (!exists) {
            throw new Error(`Vehicle ${vehicleId} does not exist`);
        }

        const iterator = await ctx.stub.getHistoryForKey(vehicleId);

        const history = [];

        let result = await iterator.next();

        while (!result.done) {

            const record = {
                transactionId: result.value.txId,
                timestamp: result.value.timestamp,
                isDelete: result.value.isDelete,
                value: result.value.value.toString('utf8')
            };

            history.push(record);

            result = await iterator.next();
        }

        await iterator.close();

        return JSON.stringify(history);
    }
}

module.exports = VehicleContract;
