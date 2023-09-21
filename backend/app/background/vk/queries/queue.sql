SELECT vq.post_id as post_id, vq.id as id, vq.text as text, vq.title as title, vq.user_id as user_id,
       vc.chat_id as chat_id, vc.access_token
FROM vkqueue as vq, vkconfig as vc
WHERE vq.vk_config_id = vc.id
  AND vq.is_posted IS FALSE
  AND vq.when <= NOW()