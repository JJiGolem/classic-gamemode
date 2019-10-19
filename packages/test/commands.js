module.exports = {
    /// Тестовая команда
    "/cmdName": {
        access: 3,  /// Уровень админки
        description: "Описание",  /// Описание команды
        args: "[сообщение]",  /// Аргументы
        /// Функция, которая привязана к команде
        handler: (player, args) => {
            console.log(args);
        }
    },
}