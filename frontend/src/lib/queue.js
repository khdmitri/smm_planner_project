import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "application/json"
instance.defaults.headers.get["Content-Type"] = "application/json"

export default class QueueAPI {

    // TELEGRAM

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

    // FACEBOOK

    static async newFacebookPost(data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("facebook_queue", data, config)
    }

    static async getFacebookPosts(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`facebook_queue`, config)
    }

    static async deleteFacebookPost(post_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`facebook_queue/${post_id}`, config)
    }

    // INSTAGRAM

    static async newInstagramPost(data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("instagram_queue", data, config)
    }

    static async getInstagramPosts(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`instagram_queue`, config)
    }

    static async deleteInstagramPost(post_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`instagram_queue/${post_id}`, config)
    }

    // VK

    static async newVkPost(data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("vk_queue", data, config)
    }

    static async getVkPosts(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`vk_queue`, config)
    }

    static async deleteVkPost(post_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`vk_queue/${post_id}`, config)
    }
}
