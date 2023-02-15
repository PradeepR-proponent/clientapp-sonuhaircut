import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import configResponse from '../config/constant';

async function getCategory() {
    try{
        const token = SecureStore.isAvailableAsync('userToken') ? await SecureStore.getItemAsync('userToken') : null;
        return await axios.get(`${configResponse.baseURL}/auth/getCategory?type=service`, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
        }});
    }catch (error) {
        return error.response
    }
}

async function getService(data){
    try{
        const token = SecureStore.isAvailableAsync('userToken') ? await SecureStore.getItemAsync('userToken') : null;
        return await axios.get(`${configResponse.baseURL}/auth/getServiceById?id=${data}`, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
        }});
    }catch(error){
        return error.response
    }
}

export {getCategory, getService};