SELECT tq.post_id as post_id, tq.id as id, tq.text as text, tq.title as title, tq.link as link, tq.user_id as user_id, tc.chat_id as chat_id
FROM telegramqueue as tq, telegramconfig as tc
WHERE tq.telegram_config_id = tc.id
  AND tq.is_posted IS FALSE
  AND tq.when <= NOW()