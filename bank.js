const readline = require('readline');

class BankApp {
    constructor() {
        this.users = [
            { login: 'admin', name: 'Админ Админыч', pin: '0000', balance: 5000 },
            { login: 'user1', name: 'Иван Иваныч', pin: '1234', balance: 2000 },
            { login: 'user2', name: 'Виктор Викторыч', pin: '4321', balance: 1500000 }
        ];
        this.currentUser = null;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // Основное меню
    start() {
        console.log('\n=== БАНКОВСКОЕ ПРИЛОЖЕНИЕ ===');
        console.log('1 - Войти в банкомат');
        console.log('2 - Войти в банк');
        console.log('0 - Выход');
        
        this.rl.question('Выберите действие: ', (choice) => {
            switch(choice) {
                case '1':
                    this.atmLogin();
                    break;
                case '2':
                    this.bankMenu();
                    break;
                case '0':
                    console.log('До свидания!');
                    this.rl.close();
                    break;
                default:
                    console.log('Неверный выбор');
                    this.start();
            }
        });
    }

    // Логин в банкомат
    atmLogin() {
        console.log('\n=== ВХОД В БАНКОМАТ ===');
        this.rl.question('Логин: ', (login) => {
            this.rl.question('Пин-код (4 цифры): ', (pin) => {
                const user = this.users.find(u => u.login === login && u.pin === pin);
                if (user) {
                    this.currentUser = user;
                    this.atmMenu();
                } else {
                    console.log('Неверный логин или пин-код!');
                    this.start();
                }
            });
        });
    }

    // Меню банкомата
    atmMenu() {
        console.log(`\n=== БАНКОМАТ === (${this.currentUser.name})`);
        console.log('1 - Проверить баланс');
        console.log('2 - Снять деньги');
        console.log('0 - Вернуться в начало');
        
        this.rl.question('Выберите действие: ', (choice) => {
            switch(choice) {
                case '1':
                    this.checkBalance();
                    break;
                case '2':
                    this.withdrawMoney();
                    break;
                case '0':
                    this.currentUser = null;
                    this.start();
                    break;
                default:
                    console.log('Неверный выбор');
                    this.atmMenu();
            }
        });
    }

    // Меню банка
    bankMenu() {
        console.log('\n=== БАНК ===');
        console.log('1 - Добавить пользователя');
        console.log('2 - Авторизоваться');
        console.log('0 - Вернуться в начало');
        
        this.rl.question('Выберите действие: ', (choice) => {
            switch(choice) {
                case '1':
                    this.addUser();
                    break;
                case '2':
                    this.bankLogin();
                    break;
                case '0':
                    this.start();
                    break;
                default:
                    console.log('Неверный выбор');
                    this.bankMenu();
            }
        });
    }

    // Логин в банк
    bankLogin() {
        console.log('\n=== АВТОРИЗАЦИЯ В БАНКЕ ===');
        this.rl.question('Логин: ', (login) => {
            this.rl.question('Пин-код (4 цифры): ', (pin) => {
                const user = this.users.find(u => u.login === login && u.pin === pin);
                if (user) {
                    this.currentUser = user;
                    this.bankUserMenu();
                } else {
                    console.log('Неверный логин или пин-код!');
                    this.bankMenu();
                }
            });
        });
    }

    // Меню пользователя в банке
    bankUserMenu() {
        console.log(`\n=== ЛИЧНЫЙ КАБИНЕТ === (${this.currentUser.name})`);
        console.log('1 - Проверить баланс');
        console.log('2 - Добавить деньги');
        console.log('3 - Снять деньги');
        console.log('0 - Вернуться в начало');
        
        this.rl.question('Выберите действие: ', (choice) => {
            switch(choice) {
                case '1':
                    this.checkBalance();
                    break;
                case '2':
                    this.depositMoney();
                    break;
                case '3':
                    this.withdrawMoney();
                    break;
                case '0':
                    this.currentUser = null;
                    this.start();
                    break;
                default:
                    console.log('Неверный выбор');
                    this.bankUserMenu();
            }
        });
    }

    // Проверить баланс
    checkBalance() {
        console.log(`\nВаш баланс: ${this.currentUser.balance} руб.`);
        if (this.currentUser) {
            this.currentUser.login ? this.bankUserMenu() : this.atmMenu();
        }
    }

    // Снять деньги
    withdrawMoney() {
        this.rl.question('\nВведите сумму для снятия: ', (amount) => {
            const sum = parseInt(amount);
            if (isNaN(sum) || sum <= 0) {
                console.log('Неверная сумма!');
            } else if (sum > this.currentUser.balance) {
                console.log('Недостаточно средств!');
            } else {
                this.currentUser.balance -= sum;
                console.log(`Снято ${sum} руб. Новый баланс: ${this.currentUser.balance} руб.`);
            }
            
            if (this.currentUser) {
                this.currentUser.login ? this.bankUserMenu() : this.atmMenu();
            }
        });
    }

    // Добавить деньги (только в банке)
    depositMoney() {
        this.rl.question('\nВведите сумму для пополнения: ', (amount) => {
            const sum = parseInt(amount);
            if (isNaN(sum) || sum <= 0) {
                console.log('Неверная сумма!');
            } else {
                this.currentUser.balance += sum;
                console.log(`Добавлено ${sum} руб. Новый баланс: ${this.currentUser.balance} руб.`);
            }
            this.bankUserMenu();
        });
    }

    // Добавить пользователя
    addUser() {
        console.log('\n=== ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ ===');
        this.rl.question('Логин: ', (login) => {
            if (this.users.find(u => u.login === login)) {
                console.log('Пользователь с таким логином уже существует!');
                this.bankMenu();
                return;
            }
            
            this.rl.question('Имя пользователя: ', (name) => {
                this.rl.question('Пин-код (4 цифры): ', (pin) => {
                    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
                        console.log('Пин-код должен состоять из 4 цифр!');
                        this.bankMenu();
                        return;
                    }
                    
                    this.users.push({
                        login: login,
                        name: name,
                        pin: pin,
                        balance: 0
                    });
                    
                    console.log('Пользователь успешно добавлен!');
                    this.bankMenu();
                });
            });
        });
    }
}

// Запуск приложения
const app = new BankApp();
app.start();