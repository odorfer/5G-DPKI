# 5G DPKI
This repository contains a proof of concept for a Decentralized Public Key Infrastructure for the 5G Core.

## Instructions

Requirements:
Please follow the instructions on this website: https://docs.docker.com/compose/install/ in order to install the Docker Engine and Docker Compose.

Please follow the steps below to start the proof of concept:

1. Start the Hyperledger Indy ledger:

Execute the following command in your terminal:
./hyperledger_indy/von-network/manage start --logs

Wait till Hyperledger Indy is ready. Note: This may take a few minutes. Please wait until the log says: "... Finished resync"

If you want to start with a clean slate after experimenting you can use the following command to do so (deletes DIDs from ledger):

./hyperledger_indy/von-network/manage down


2. Register DIDs for the following network functions: AMF, UDM, NRF:

Execute the following command in your terminal:
curl -X POST http://localhost:9000/register -d '{"role":"ENDORSER","alias":"amf","seed":"amf00000000000000000000000000000"}' &&
curl -X POST http://localhost:9000/register -d '{"role":"ENDORSER","alias":"udm","seed":"udm00000000000000000000000000000"}' &&
curl -X POST http://localhost:9000/register -d '{"role":"ENDORSER","alias":"nrf","seed":"nrf00000000000000000000000000000"}'

Alternatively, you can register the DIDs manually on the Hyperledger Indy ledger via the web interface, which is available at http://localhost:9000.

Note: If you'd like to use different seed values and therefore different DIDs, you have to change the configuration in the controller files and the response of the NRF. After that you need to rebuild the images via the command: docker-compose build

3. Start the Docker containers of the network function services, as well as their controllers and agents.

Execute the following command in your terminal to build the Dockerfiles:
docker-compose build

Execute the following command in your terminal to start the containers and the network:
docker-compose up

Execute the following command in your terminal to stop and remove all the containers:
docker-compose down

4. Wait for the AMF to start the 5G SBA example scenario

The AMF will automatically after 10 seconds initiate a request to the UDM.

Das Szenario war erfolgreich sofern im Terminal Fenster von Docker Compose unter den Logs der AMF die folgende Nachricht erscheint:

Response from UDM: {
  correlation_id: 'dd1e91a9-0954-475c-a264-776b9fd37967',
  body: { smsSubscribed: true, sharedSmsSubsDataId: '12345-A' }
}
