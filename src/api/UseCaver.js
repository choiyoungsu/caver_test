import Caver from 'caver-js';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import KIP17ABI from '../abi/KIP17TokenABI';
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, CHAIN_ID, RUDOLPH_CONTRACT_ADDRESS, NOKYONG_CONTRACT_ADDRESS } from '../constants';

const option = {
    headers: [
        {
            name: "Authorization",
            value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
        },
        { name: "x-chain-id", value: CHAIN_ID }
    ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))
const RudolphContract = new caver.contract(KIP17ABI, RUDOLPH_CONTRACT_ADDRESS);
const NokyongContract = new caver.contract(KIP17ABI, NOKYONG_CONTRACT_ADDRESS);

export const fetchRudolph = async (address) => {

    // fetch Balance
    const balance = await RudolphContract.methods.balanceOf(address).call();
    console.log(`[${address}] has ${balance} NFTs`);

    // fetch Token Ids
    const tokenIds = [];
    for (let i = 0; i < balance; i++) {
        const id = await RudolphContract.methods.tokenOfOwnerByIndex(address, i).call();
        tokenIds.push(id);
    }
    // fetch Token URIs
    const tokenURIs = [];
    for (let i = 0; i < balance; i++) {
        const uri = await RudolphContract.methods.tokenURI(tokenIds[i]).call();
        const uri_json = "https://ipfs.io/ipfs/" + uri.slice(7);
        tokenURIs.push(uri_json);
    }
    // console.log(`${tokenURIs}`);
    // console.log(`${tokenURIs[0]}`);
    // console.log(`${tokenURIs[1]}`);

    const tokenImageUris = [];
    const imageurl = null;

    // const tokenImageUriCall = async() => {
    //     try{
    //         const response = await axios.get(tokenURIs[0]);
    //         const imageurl = JSON.parse(JSON.stringify(response)).image;
    //         console.log(imageurl);
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }
    // console.log("asa");

    for (let i = 0; i < balance; i++) {
        const getjson= await axios.get(tokenURIs[i]).then(response => {
            return response.data
        });
        console.log(getjson);
        const imageurl = JSON.parse(JSON.stringify(getjson)).image;
        const tokenimageurl = "https://ipfs.io/ipfs/" + imageurl.slice(7);
        tokenImageUris.push(tokenimageurl);
        
    }

    const nfts = [];
    for (let i = 0; i < balance; i++) {
        nfts.push({ uri: tokenURIs[i], id: tokenIds[i], imageurl: tokenImageUris[i] });
    }
    console.log(nfts);
    return nfts;
};