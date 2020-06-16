# property-registration
###  Implementation of Property-Registration Network using Hyperledger Fabric.

## Built With
  *   JavaScript, Node.js, Shell Scripting
  *   Framework:- Hyperledger Fabric

###  Follow below Steps to Start the Network:-
  ##### 1)  Go inside "network" directory and run below command to stop the network and any containers that may be running in                       background:-
                ./fabricNetwork.sh down
  ##### 2)  Go inside "network" directory and then run below command to start the network:-
                ./fabricNetwork.sh up
  ##### 3)  After starting the network, install & instantiate the chaincode on this network using below command:-
                ./fabricNetwork.sh install

###  Below are some important commands :-
##### 1). Command to generate the crypto-materials:
            ./fabricNetwork.sh generate

##### 2). Command to start the network
            ./fabricNetwork.sh up

##### 3). Command to kill the network
            ./fabricNetwork.sh down

##### 4). Command to install and instantiate the chaincode on the network
            ./fabricNetwork.sh install
