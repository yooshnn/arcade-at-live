-- Migration number: 0002 	 2026-03-07T07:40:24.603Z

INSERT OR IGNORE INTO games (id, name, alias, slug) VALUES
  (1, 'CHUNITHM', '츄니즘', 'chunithm'),
  (2, 'SOUND VOLTEX', 'SDVX', 'sdvx'),
  (3, 'beatmania IIDX', 'IIDX', 'iidx'),
  (4, 'maimai でらっくす', '마이마이', 'maimai'),
  (5, 'jubeat', '유비트', 'jubeat'),
  (6, 'GITADORA', '기타도라', 'gitadora'),
  (7, 'DanceDanceRevolution', 'DDR', 'ddr'),
  (8, 'NOSTALGIA', '노스텔지어', 'nos'),
  (9, 'EZ2AC', 'EZ2AC', 'ez2ac'),
  (10, '太鼓の達人', '태고의 달인', 'taiko'),
  (11, 'pop''n music', '팝픈뮤직', 'popn'),
  (12, 'DANCERUSH STARDOM', '댄스러시', 'drs');

INSERT OR IGNORE INTO arcades (id, name, slug, is_closed) VALUES
  (1, '싸이뮤직게임월드', 'cygameworld', 0),
  (2, '더벙커게임존', 'thebunker', 0);

INSERT OR IGNORE INTO channels (arcade_id, youtube_channel_id) VALUES
  (1, 'UCG-csD9dY7pLkaJ7PsTOWOQ'),
  (2, 'UCLvuGQuvGYnYB6qvI7OpDKA');

INSERT OR IGNORE INTO stream_rules (arcade_id, game_id, keyword, machine_label, priority) VALUES
  (1, 1, '[CHUNITHM] [No.1]', '1', 0),
  (1, 1, '[CHUNITHM] [No.4]', '4', 0),
  (1, 2, '[SDVX] [VM - No.1]', '1', 0),
  (1, 2, '[SDVX] [VM - No.2]', '2', 0),
  (1, 2, '[SDVX] [VM - No.3]', '3', 0),
  (1, 2, '[SDVX] [VM - No.4]', '4', 0),
  (1, 2, '[SDVX] [VM - No.7]', '7', 0),
  (1, 2, '[SDVX] [VM - No.8]', '8', 0),
  (1, 2, '[SDVX] [VM - No.9]', '9', 0),
  (1, 2, '[SDVX] [VM - No.10]', '10', 0),
  (1, 3, '[IIDX] [LM - No.1]', 'LM 1', 0),
  (1, 3, '[IIDX] [LM - No.2]', 'LM 2', 0),
  (1, 3, '[IIDX] [SM]', '1', 0),
  (1, 4, '[maimai DX] [No.1]', '1', 0),
  (1, 4, '[maimai DX] [No.3]', '3', 0),
  (1, 4, '[maimai DX] [No.4]', '4', 0),
  (1, 4, '[maimai DX] [No.6]', '6', 0),
  (1, 4, '[maimai DX] [No.7]', '7', 0),
  (1, 4, '[maimai DX] [No.8]', '8', 0),
  (1, 5, '[jubeat]', '1', 0),
  (1, 6, '[GITADORA GF ARENA]', '기타', 0),
  (1, 6, '[GITADORA DM ARENA]', '도라', 0),
  (1, 7, '[DDR]', NULL, 0),
  (1, 8, '[NOS]', NULL, 0),
  (1, 9, '[EZ2AC]', NULL, 0),
  (1, 10, '[Taiko]', NULL, 0),
  (1, 11, '[pop''n PPM] [No.1]', '1', 0),
  (1, 11, '[pop''n PPM] [No.2]', '2', 0),
  (1, 11, '[pop''n PPM] [No.3]', '3', 0),
  (1, 11, '[pop''n PPM] [No.4]', '4', 0),

  (2, 1, '츄니즘', '1', 0),
  (2, 2, '사운드볼텍스 발키리 1번', 'VM 1', 0),
  (2, 2, '사운드볼텍스 발키리 2번', 'VM 2', 0),
  (2, 2, '사운드볼텍스 발키리 3번', 'VM 3', 0),
  (2, 2, '사운드볼텍스', '1', 10),
  (2, 3, '비트매니아 라이트닝', 'LM', 0),
  (2, 3, '비트매니아', '1', 10),
  (2, 4, '마이마이 디럭스 2번', '2', 0),
  (2, 4, '마이마이 디럭스', '1', 10),
  (2, 5, '유비트', NULL, 0),
  (2, 6, '기타도라 세션', '세션', 0),
  (2, 7, 'DDR', NULL, 0),
  (2, 8, '노스텔지어', NULL, 0),
  (2, 9, 'EZ2FN', NULL, 0),
  (2, 10, '태고의달인', NULL, 0),
  (2, 11, '신 팝픈뮤직 팝군모델', 'PM', 0),
  (2, 11, '팝픈뮤직', '1', 10),
  (2, 12, '댄스러쉬', NULL, 0);