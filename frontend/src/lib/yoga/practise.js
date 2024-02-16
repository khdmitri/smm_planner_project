import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_YOGA_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.get["Content-Type"] = "application/json"

export default class PractiseAPI {
    static async get_practises() {
        return await instance.get("practises")
    }
}