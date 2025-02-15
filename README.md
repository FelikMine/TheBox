# tradesysdev
## Простая инструкция по запуску react-app

1. Переходим в папку \frontend\
2. Переходим в папку \react-app\
3. Открываем терминал
4. Запускаем команду _npm start_
5. Далее сайт доступен на localhost (по адресу http://localhost:3000)

## Инструкция по работе с Docker

1. Запускаем Docker Desktop
2. Переходим в папку с проектом
3. Вводим _docker build -t project-repository ._ в консоли/терминале
4. Вводим _docker run -dp 8000:3000 --name frontend project-repository_
5. Для остановки используем _docker stop frontend_
6. Для перезапуска можно ввести _docker restart frontend_
