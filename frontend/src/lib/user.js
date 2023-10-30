import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "application/json"

export default class UserAPI {

    static async createNewUser(form) {
        return await instance.post('/users', form)
    }

    static async getStatistic(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get('/users/statistic', config)
    }
}