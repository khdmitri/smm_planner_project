import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "application/json"

export default class UserAPI {

    static async createNewUser(form) {
        console.log("Axios headers=", instance.defaults.headers)
        console.log("Form=", form)

        try {
            return await instance.post('/users', form)
        } catch (error) {
            console.log("ERROR (CreateNewUser):", error)
            return error
        }
    }
}