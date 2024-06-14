import rateLimit from 'express-rate-limit';

// или можно поставить throttler
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // с одного IP можно совершить максимум 100 запросов
  // тут могут быть доп. настройки
});

export default limiter;
