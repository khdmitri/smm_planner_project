import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "application/json"
instance.defaults.headers.get["Content-Type"] = "application/json"
instance.defaults.headers.put["Content-Type"] = "application/json"

export default class ChatAPI {
    static async conversation(data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Accept": "text/event-stream"
            }
        }
        console.log("Sending data=", data)
        return await instance.post("conversation", data, config)
    }
}