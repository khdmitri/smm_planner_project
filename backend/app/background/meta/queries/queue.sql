SELECT fq.post_id as post_id, fq.id as id, fq.text as text, fq.title as title, fq.user_id as user_id,
       fc.chat_id as chat_id, fc.marker_token
FROM facebookqueue as fq, facebookconfig as fc
WHERE fq.facebook_config_id = fc.id
  AND fq.is_posted IS FALSE
  AND fq.when <= NOW()