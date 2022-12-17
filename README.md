# MeDo - Blockchain Freelance Platform
MeDo is a prototype of a freelancing platform which stores it's data on blockchain.

Application is currently running on Mumbai testnet.
Smart Contract deployed at address 0x3aD0caD9E7Fb1A7A46F6F0665bbC97BdfDdaD740.

## Introduction
The idea of MeDo is to ease the difficulties faced by freelancers nowadays such as unsurity about payments and high fees charged by middlemen. Blockchain can help by guaranteeing payments with help of smart contracts, providing security and an integrated payment system which can save time delays and fees in cases of international payments and its decentralized nature mean there is no middleman.

## Install
1. Run `npm install` at the root of your directory
2. Run `yarn` at the client directory to install the client dependencies

## Test
Run `npx hardhat test` at the smart_contract directory to run smart contract tests

## Deploy contract
Run `npx hardhat run scripts/deploy.js --network matic` at the smart_contract directory to deploy the smart contract

## Prepare the client
1. Replace the cotract address in the utils/constants.js with the new deployed one
2. Replace conractABI.json with the contract json from smart_contract/artifacts/contracts/{your_contract}/{your_contract}.json

## Run client
Run `yarn dev` at the client directory to run the client locally


