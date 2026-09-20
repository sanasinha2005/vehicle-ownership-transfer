'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const grpc = require('@grpc/grpc-js');

const {
    connect,
    hash,
    signers
} = require('@hyperledger/fabric-gateway');

const FABRIC_SAMPLES = path.resolve(
    __dirname,
    '../../../fabric-samples'
);

const ORG1_PATH = path.join(
    FABRIC_SAMPLES,
    'test-network',
    'organizations',
    'peerOrganizations',
    'org1.example.com'
);

const USER_CERT_PATH = path.join(
    ORG1_PATH,
    'users',
    'User1@org1.example.com',
    'msp',
    'signcerts',
    'cert.pem'
);

const USER_KEY_DIR = path.join(
    ORG1_PATH,
    'users',
    'User1@org1.example.com',
    'msp',
    'keystore'
);

const TLS_CERT_PATH = path.join(
    ORG1_PATH,
    'peers',
    'peer0.org1.example.com',
    'tls',
    'ca.crt'
);

const PEER_ENDPOINT = 'localhost:7051';
const PEER_HOST_OVERRIDE = 'peer0.org1.example.com';

const CHANNEL_NAME = 'mychannel';
const CHAINCODE_NAME = 'vehicle';


function getPrivateKeyPath() {
    const files = fs.readdirSync(USER_KEY_DIR);

    const keyFile = files.find(
        file => file.endsWith('_sk')
    );

    if (!keyFile) {
        throw new Error(
            `No private key found in ${USER_KEY_DIR}`
        );
    }

    return path.join(USER_KEY_DIR, keyFile);
}


async function connectToFabric() {
    // Read User1 certificate
    const certificate = fs.readFileSync(
        USER_CERT_PATH
    );

    // Read User1 private key
    const privateKeyPem = fs.readFileSync(
        getPrivateKeyPath()
    );

    const privateKey = crypto.createPrivateKey(
        privateKeyPem
    );

    const signer = signers.newPrivateKeySigner(
        privateKey
    );

    // Read peer TLS certificate
    const tlsRootCert = fs.readFileSync(
        TLS_CERT_PATH
    );

    const tlsCredentials =
        grpc.credentials.createSsl(
            tlsRootCert
        );

    // Create gRPC connection to Org1 peer / Gateway
    const client = new grpc.Client(
        PEER_ENDPOINT,
        tlsCredentials,
        {
            'grpc.ssl_target_name_override':
                PEER_HOST_OVERRIDE
        }
    );

    // Connect as Org1 User1
    const gateway = connect({
        client,
        identity: {
            mspId: 'Org1MSP',
            credentials: certificate
        },
        signer,
        hash: hash.sha256
    });

    // Access our channel
    const network = gateway.getNetwork(
        CHANNEL_NAME
    );

    // Access our vehicle chaincode
    const contract = network.getContract(
        CHAINCODE_NAME
    );

    return {
        gateway,
        client,
        contract
    };
}


module.exports = {
    connectToFabric
};
