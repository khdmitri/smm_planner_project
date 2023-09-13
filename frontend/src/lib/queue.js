import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "application/json"
instance.defaults.headers.get["Content-Type"] = "application/json"

export default class QueueAPI {
    static async newTelegramPost(data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("telegram_queue", data, config)
    }

    static async getTelegramPosts(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`telegram_queue`, config)
    }

    static async deleteTelegramPost(post_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`telegram_queue/${post_id}`, config)
    }
}


