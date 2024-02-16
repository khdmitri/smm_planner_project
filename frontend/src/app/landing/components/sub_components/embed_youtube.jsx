import React from "react";
import PropTypes from "prop-types";

const YoutubeEmbed = ({ embedId, width= 420 }) => (
  <div className="video-responsive">
    <iframe
      width={width}
      height={Math.round(width*9/16)}
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default YoutubeEmbed;