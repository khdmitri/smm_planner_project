import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "multipart/form-data"
instance.defaults.headers.get["Content-Type"] = "application/json"

export default class PostAPI {
    static async newPost(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.post("posts", form_data, config)
    }

    static async getPost(post_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`posts/${post_id}`, config)
    }
}


