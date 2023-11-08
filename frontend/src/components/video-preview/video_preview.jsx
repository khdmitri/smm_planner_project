"use client"

import PropTypes from "prop-types";
import {parse_video_url} from "../../lib/parsers";

const VideoPreview = ({url}) => {
    const parsed_url = parse_video_url(url)

    return (
        <div
            className="video-responsive">
            < iframe
                width="420"
                height="280"
                // src={`https://www.youtube.com/embed/${embedId}`}
                src={parsed_url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Preview"
            />
        </div>
    )
};

VideoPreview.propTypes =
    {
        url: PropTypes.string.isRequired
    }
;

export default VideoPreview;