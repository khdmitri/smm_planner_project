SELECT iq.post_id as post_id, iq.id as id, iq.text as text, iq.title as title, iq.link as link, iq.user_id as user_id,
       ic.chat_id as chat_id, ic.marker_token as marker_token
FROM instagramqueue as iq, instagramconfig as ic
WHERE iq.instagram_config_id = ic.id
  AND iq.is_posted IS FALSE
  AND iq.when <= NOW()