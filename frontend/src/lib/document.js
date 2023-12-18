import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.get["Content-Type"] = "application/pdf"

export default class DocumentAPI {
    static async privacy() {
        return await instance.get("document/privacy")
    }

    static async terms_of_conditions() {
        return await instance.get("document/terms_of_conditions")
    }
}