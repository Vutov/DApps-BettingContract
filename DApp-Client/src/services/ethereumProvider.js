import observer from './observer'
import { get } from './requester'
import * as $ from "jquery";
import { ISelectable } from '../components/common/common.models';


const metaMaskError = "Please install MetaMask.";
const accountError = "Please unlock your MetaMask account.";
const error = "Smart contract call failed. ";

function exec(address, funcName, params, callback) {
    if (typeof web3 === 'undefined') {
        observer.showError(metaMaskError);
        return;
    }

    if(web3.eth.accounts.length == 0) {
        observer.showError(accountError);
        return;
    }

    params = params || [];

    getAbi().then((abi) => {
        let contract = web3.eth.contract(abi).at(address);
        contract[funcName](...params, function (err, result) {
            if (err) {
                var myRegexp = /(.+)\s*at.+/g;
                var match = myRegexp.exec(err.message);
                let message = match[1] || err.message;
                observer.showError(error + message);
                return;
            }

            callback(result);
        });
    });
}

function transaction(address, funcName, value, params, callback) {
    if (typeof web3 === 'undefined') {
        observer.showError(metaMaskError);
        return;
    }
    
    if(web3.eth.accounts.length == 0) {
        observer.showError(accountError);
        return;
    }

    params = params || [];

    getAbi().then((abi) => {
        let contract = web3.eth.contract(abi).at(address);
        let customerAddress = web3.eth.accounts[0];
        contract[funcName](...params, {from: customerAddress, value: value}, function(err, result){
            if (err) {
                var myRegexp = /(.+)\s*at.+/g;
                var match = myRegexp.exec(err.message);
                let message = match[1] || err.message;
                observer.showError(error + message);
                return;
            }

            callback(result, customerAddress);
        });
    });
}

function getAddress() {
    if (typeof web3 === 'undefined') {
        observer.showError(metaMaskError);
        return;
    }

    if(web3.eth.accounts.length == 0) {
        observer.showError(accountError);
        return;
    }

    return web3.eth.accounts[0];
}

async function getAbi() {
    let abi = sessionStorage.getItem("abi");
    if (!abi) {
        await get('event', 'abi')
            .then(data => {
                abi = data;
                sessionStorage.setItem("abi", data);
            });
    }

    return JSON.parse(abi);
}

function getWei(amount, type) {
    return web3.toWei(amount, type);
}

function getFromWei(amount, type) {
    return web3.fromWei(amount, type);
}

function getMoneyTypes() {
    return [
        "ether",
        "wei",
        "gwei",
        "kwei",
        "babbage",
        "femtoether",
        "mwei",
        "lovelace",
        "picoether",
        "shannon",
        "nanoether",
        "nano",
        "szabo",
        "microether",
        "micro",
        "finney",
        "milliether",
        "milli",
        "kether",
        "grand",
        "mether",
        "gether",
        "tether"
    ]
}

export { exec, transaction, getMoneyTypes, getWei, getFromWei, getAddress };