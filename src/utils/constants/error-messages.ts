export enum ERR_MESSAGE {
  INVALID_DATA = 'Переданы некорректные данные',
  SERVER_ERROR = 'На сервере произошла ошибка',
  RESOURCE_NOT_FOUND = 'Запрашиваемый ресурс не найден',
  ENTITY_NOT_FOUND = 'Запрашиваемая сущность не найдена',
  NOT_FOUND_HINT = 'Проверьте корректность введенных данных',
  NAME_CONFLICT = 'Попытка создать дубликат уникального поля',
  PROFILE_NAME_CONFLICT = 'Пользователь с таким email или именем уже существует',
  INVALID_AUTH = 'Неправильное имя пользователя или пароль',
  UNAUTHORIZED = 'Необходима авторизация',
  UNAUTHORIZED_ACTION = 'У вас недостаточно прав',
}