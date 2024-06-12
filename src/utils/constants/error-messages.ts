export enum ERR_MESSAGE {
  INVALID_DATA = 'Переданы некорректные данные',
  SERVER_ERROR = 'На сервере произошла ошибка',
  RESOURCE_NOT_FOUND = 'Запрашиваемый ресурс не найден',
  NAME_CONFLICT = 'Попытка создать дубликат уникального поля',
  PROFILE_NAME_CONFLICT = 'Пользователь с таким email или именем уже существует',
  INVALID_AUTH = 'Неправильное имя пользователя или пароль',
  UNAUTHORIZED = 'Необходима авторизация',
  STATUS_FORBIDDEN = 'У вас недостаточно прав',
}