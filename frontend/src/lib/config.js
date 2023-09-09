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
}


