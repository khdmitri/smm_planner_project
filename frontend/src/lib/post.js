import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.post["Content-Type"] = "multipart/form-data"
instance.defaults.headers.get["Content-Type"] = "application/json"
instance.defaults.headers.put["Content-Type"] = "application/json"

export default class PostAPI {
    static async newPost(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        console.log("Sending data=", form_data)
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

    static async getPosts(access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.get(`posts`, config)
    }

    static async updatePost(form_data, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.put("/posts", form_data, config)
    }

    static async deletePost(post_id, access_token) {
        const config = {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        }
        return await instance.delete(`/posts/${post_id}`, config)
    }
}


