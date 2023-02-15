import axios from "axios";
import configResponse from "../config/constant";
import * as SecureStore from 'expo-secure-store';

async function signUpRequest (data){
    try{
        return await axios.post(`${configResponse.baseURL}/auth/register`, data, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }});
    }catch(error){
        return error.response
    }
}

async function loginUpRequest (data) {
    try{
        return await axios.post(`${configResponse.baseURL}/auth/login`, data, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }});
    }catch (error) {
        return error.response
    }
}

async function loginOtpVerificationRequest (data,token) {
    try{
        return await axios.get(`${configResponse.baseURL}/auth/login-otp-verification?${data}`, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
        }});
    }catch (error) {
        return error.response
    }
}

async function ForgotPasswordRequest (data) {
    try{
        return await axios.get(`${configResponse.baseURL}/auth/forgotPassword?${data}`)
    }catch( error ){
        return error.response
    }
}

async function NewPasswordRequest (data) {
    try{
        const token = SecureStore.isAvailableAsync('token') ? await SecureStore.getItemAsync('token') : null;
        return await axios.post(`${configResponse.baseURL}/auth/newPassword`, data, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
        }});
    }catch (error) {
        return error.response
    }
}

async function VerifyAccountRequest (data) {
    try{
        return await axios.get(`${configResponse.baseURL}/auth/verifyAccount?${data}`)
    }catch( error ){
        return error.response
    }
}

async function UpdatePasswordRequest (data) {
    try{
        const token = SecureStore.isAvailableAsync('userToken') ? await SecureStore.getItemAsync('userToken') : null;
        return await axios.post(`${configResponse.baseURL}/auth/updatePassword`, data, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
        }});
    }catch (error) {
        return error.response
    }
}

async function userLogout(){
    try{
        const token = SecureStore.isAvailableAsync('userToken') ? await SecureStore.getItemAsync('userToken') : null;
        return await axios.get(`${configResponse.baseURL}/auth/logout`, {headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
        }});
    }catch (error) {
        return error.response
    }
}

export {signUpRequest, loginUpRequest, ForgotPasswordRequest, NewPasswordRequest, VerifyAccountRequest, UpdatePasswordRequest, userLogout, loginOtpVerificationRequest};
