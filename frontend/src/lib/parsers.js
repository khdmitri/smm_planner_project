

export const parse_video_url = (url) => {
    const is_youtube = /.*(youtu.be\/|youtube.com\/|youtube-nocookie\.com).*/
    const is_tiktok = /.*(tiktok.com).*/

    const res_youtube = url.match(is_youtube)
    const res_tiktok = url.match(is_tiktok)

    if (res_youtube) {
        const video_id = parse_youtube(url)
        if (video_id)
            return `https://youtube.com/embed/${video_id}?autoplay=0`
    } else if (res_tiktok) {
        const video_id = parse_tiktok(url)
        if (video_id)
            return `https://www.tiktok.com/embed/${video_id}`
    }
    return url
}

const parse_youtube = (url) => {
    const video_id_regexp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/
    const video_id = url.match(video_id_regexp)
    if (video_id && video_id.length >= 2)
        return video_id[1]
    return null
}

const parse_tiktok = (url) => {
    const video_id_regexp = /(@[a-zA-z\d]*|.*)(\/.*\/|trending.?shareId=)(\d*)/
    const video_id = url.match(video_id_regexp)
    if (video_id && video_id.length >= 4)
        return video_id[3]
    return null
}