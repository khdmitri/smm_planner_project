import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "multipart/form-data"

export default class LoginAPI {
    static async loginAccessToken(data) {
        return await instance.post("login/access-token", data)
    }

    static async testToken(data) {
        const config = {
            headers: {
                "Authorization": `Bearer ${data}`,
            }
        }

        return await instance.post("login/test-token", data, config)
    }
}


