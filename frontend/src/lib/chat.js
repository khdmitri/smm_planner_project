import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.get["Content-Type"] = "application/json"
instance.defaults.headers.put["Content-Type"] = "application/json"

export default class ChatAPI {
    static async conversation(data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            }
        }
        console.log("Sending data=", data)
        return await instance.post("chat/conversation", data, config)
    }

    static async providers(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Accept": "application/json"
            }
        }
        return await instance.get("chat/providers", config)
    }

    static async generate_image(data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "multipart/form-data"
            }
        }
        console.log("Sending data=", data)
        return await instance.post("text2image/generate", data, config)
    }
}