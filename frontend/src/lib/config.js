import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "application/json"
instance.defaults.headers.put["Content-Type"] = "application/json"
instance.defaults.headers.get["Content-Type"] = "application/json"
instance.defaults.headers.delete["Content-Type"] = "application/json"

export default class ConfigAPI {
    // TELEGRAM

    static async newTelegramConfig(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("/telegram_config", form_data, config)
    }

    static async getTelegramConfigList(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get("/telegram_config", config)
    }

    static async getTelegramConfig(config_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`/telegram_config/${config_id}`, config)
    }

    static async updateTelegramConfig(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.put("/telegram_config", form_data, config)
    }

    static async deleteTelegramConfig(config_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`/telegram_config/${config_id}`, config)
    }

    // FACEBOOK

    static async newFacebookConfig(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("/facebook_config", form_data, config)
    }

    static async getFacebookConfigList(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get("/facebook_config", config)
    }

    static async getFacebookConfig(config_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`/facebook_config/${config_id}`, config)
    }

    static async updateFacebookConfig(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.put("/facebook_config", form_data, config)
    }

    static async deleteFacebookConfig(config_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`/facebook_config/${config_id}`, config)
    }

    // Instagram
    static async newInstagramConfig(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("/instagram_config", form_data, config)
    }

    static async getInstagramConfigList(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get("/instagram_config", config)
    }

    static async getInstagramConfig(config_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`/instagram_config/${config_id}`, config)
    }

    static async updateInstagramConfig(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.put("/instagram_config", form_data, config)
    }

    static async deleteInstagramConfig(config_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`/instagram_config/${config_id}`, config)
    }

    // VK

    static async newVkConfig(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("/vk_config", form_data, config)
    }

    static async getVkConfigList(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get("/vk_config", config)
    }

    static async getVkConfig(config_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`/vk_config/${config_id}`, config)
    }

    static async updateVkConfig(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.put("/vk_config", form_data, config)
    }

    static async deleteVkConfig(config_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`/vk_config/${config_id}`, config)
    }
}


