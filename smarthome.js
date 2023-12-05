function Hub(name) {
    this.name = name;
    this.devices = [];

    this.addDevice = function (device) {
        this.devices.push(device);
    };

    this.removeDevice = function (device) {
        if (!device.getIsOn()) {
            var index = this.devices.indexOf(device);

            if (index !== -1) {
                this.devices.splice(index, 1);
                console.log("Девайс '" + device.name + "' було видалено з '" + this.name + "'.");
            } else {
                console.log("Девайсу '" + device.name + "' не було знайдено у '" + this.name + "'.");
            }
        } else {
            console.log("Неможливо видалити '" + device.name + "' з '" + this.name + "', поки девайс працює!");
        }
    };

    this.getDevices = function () {
        console.log("\nПідключені девайси до '" + this.name + "':");
        this.devices.map(function(device) {
            console.log(" - " + device.name);
        });
    };

    this.getDeviceByName = function (name) {
        for (var i = 0; i < this.devices.length; i++) {
            if (this.devices[i].name === name) {
                return this.devices[i];
            }
        }
        return null; // Повертаємо null, якщо девайс не знайдено
    };

    this.onAllDevices = function () {
        for (var i = 0; i < this.devices.length; i++) {
            this.devices[i].turnOn();
        }
    };

    this.offAllDevices = function () {
        for (var i = 0; i < this.devices.length; i++) {
                this.devices[i].turnOff();
        }
    };
}

// Базовий клас для всіх компонентів розумного будинку
function SmartDevice(name) {
    this.name = name;
    this.__isOn = false;  // Приватна властивість
}

// Геттер для приватної властивості isOn
SmartDevice.prototype.getIsOn = function () {
    return this.__isOn;
}

// Методи для включення та виключення девайсу
SmartDevice.prototype.turnOn = function () {
    if (!this.__isOn) {
        this.__isOn = true;
        console.log("'" + this.name + "' було включено");
    } else {
        console.log("'" + this.name + "' вже працює!");
    }
};

SmartDevice.prototype.turnOff = function () {
    if (this.__isOn) {
        this.__isOn = false;
        console.log("'" + this.name + "' було виключено");
    } else {
        console.log("'" + this.name + "' вже виключений!");
    }
};

// Компоненти розумного будинку, які успадковуються від SmartDevice


// Лампочка
function Lamp(name) {
    SmartDevice.call(this, name);
    this.__brightness = 0; // Приватна властивість
    this.__color = "white"; // Приватна властивість
}

Lamp.prototype = Object.create(SmartDevice.prototype);
Lamp.prototype.constructor = Lamp;

Lamp.prototype.turnOn = function () {
    if (!this.__isOn) {
        this.__isOn = true;
        this.__brightness = 50;
        console.log("'" + this.name + "' включено. Рівень свічіння: " + this.__brightness + ".");
    } else {
        console.log("'" + this.name + "' вже працює!");
    }
};

Lamp.prototype.turnOff = function () {
    if (this.__isOn) {
        this.__isOn = false;
        this.__brightness = 0;
        console.log("'" + this.name + "' виключено.");
    } else {
        console.log("'" + this.name + "' вже виключений!");
    }
};

Lamp.prototype.setTimer = function (time, callback) {
    if (this.__isOn) {
        var that = this;
        console.log("Було встановлено таймер роботи для '" + that.name + "' на " + time + " секунд.");
        setTimeout(function () {
            callback(null, "\nЛампочка '" + that.name + "' усіпшно пропрацювала " + time + " секунди і виключилася.");
            that.turnOff();
        }, time * 1000);
    } else {
        callback("Лампочка '" + this.name + "' не працює!");
    }
};

Lamp.prototype.setBrightness = function (brightness) {
    if (this.__isOn) {
        if (brightness > 0 && brightness <= 100) {
            this.__brightness = brightness;
            console.log("Рівень свічіння для '" + this.name + "' встановлено на " + brightness + "%.");
        } else if (brightness === 0) {
            this.__brightness = brightness;
            console.log("Рівень свічіння для '  " + this.name + "' встановлено на " + brightness + "%.");
            this.turnOff();
        } else {
            console.log("Некоректний рівень свічіння. Введіть значення від 0 до 100.");
        }
    } else {
        console.log("Неможливо змінити рівень свічіння для '" + this.name + "': девайс виключений!");
    }
};

Lamp.prototype.setColor = function (color) {
    if (this.__isOn) {
        this.__color = color;
        console.log("Колір свічіння для " + this.name + " встановлено на '" + color + "'");
    } else {
        console.log("Неможливо змінити колір свічіння для '" + this.name + "': девайс виключений!");
    }
};


// Система безпеки
function SecuritySystem(name) {
    SmartDevice.call(this, name);
    this.__timerStart = null; // Приватна властивість
    this.__totalWorkTime = 0; // Приватна властивість
}

SecuritySystem.prototype = Object.create(SmartDevice.prototype);
SecuritySystem.prototype.constructor = SecuritySystem;

SecuritySystem.prototype.turnOn = function () {
    SmartDevice.prototype.turnOn.call(this);
    this.__timerStart = Date.now();
};

SecuritySystem.prototype.turnOff = function () {
    if (this.__timerStart && this.__isOn) {
        this.__isOn = false;
        this.__totalWorkTime = Date.now() - this.__timerStart;
        console.log("\n'" + this.name + "' було виключено. Загальний час роботи: " + (this.__totalWorkTime / 1000) + " секунд.\n");
        this.__timerStart = null;
    } else {
        console.log("'" + this.name + "' вже виключений!");
    }
};

SecuritySystem.prototype.getWorkStatus = function () {
    if (this.__timerStart) {
        var elapsedTime = Date.now() - this.__timerStart;
        console.log("\n'" + this.name + "' працює з моменту запуску: " + (elapsedTime / 1000) + " секунд.\n");
    } else {
        console.log("'" + this.name + "' не працює зараз.");
    }
};


// Електричний чайник
function ElectricKettle(name, maxWaterVolume) {
    SmartDevice.call(this, name);
    this.__maxWaterVolume = maxWaterVolume; // Приватна властивість
    this.__currentWaterVolume = 0; // Приватна властивість
}

ElectricKettle.prototype = Object.create(SmartDevice.prototype);
ElectricKettle.prototype.constructor = ElectricKettle;

ElectricKettle.prototype.turnOn = function () {
    if (!this.__isOn) {
        if (this.__currentWaterVolume >= Math.floor(this.__maxWaterVolume / 3)) {
            var that = this; // Змінна that, що є фактичним варіантом this для setTimeout
            this.__isOn = true;
            console.log("'" + this.name + "' починає кип'ятіння.");
            // Після 10 секунди зупиняємо кип'ятіння
            setTimeout (function () {
                that.turnOff();
            }, 10000);
        } else {
            console.log("Недостатньо води для кип'ятіння. Додайте води та спробуйте знову.");
        }
    } else {
        console.log("'" + this.name + "' вже працює!");
    }
};

ElectricKettle.prototype.turnOff = function () {
    if (this.__isOn) {
        this.__isOn = false;
        console.log("'" + this.name + "' закінчив кип'ятіння.");
    } else {
        console.log("'" + this.name + "' вже виключений!");
    }
};

ElectricKettle.prototype.setCurrentWaterVolume = function (volume) {
    if (!this.__isOn) {
        if (volume <= this.__maxWaterVolume && volume >= 0) {
            this.__currentWaterVolume = volume;
            console.log("У '" + this.name + "' було залито " + volume + " мл.");
        } else {
            console.log("'" + this.name + "' має максимальний об'єм води " + this.__maxWaterVolume + " мл!");
        }
    } else {
        console.log("Неможливо змінити рівень води, поки '" + this.name + "' працює!");
    }
};


// Телевізор
function TV(name) {
    SmartDevice.call(this, name);
    this.__isAppOpen = false; // Приватна властивість
    this.__currentApp = null; // Приватна властивість
}

TV.prototype = Object.create(SmartDevice.prototype);
TV.prototype.constructor = TV;

TV.prototype.openApp = function (appName) {
    if (this.__isOn) {
        if (!this.__isAppOpen) {
            this.__isAppOpen = true;
            this.__currentApp = appName;
            console.log("На '" + this.name + "' відкрито додаток: " + appName + ".");
        } else {
            console.log("Не можливо відкрити " + appName + " на '" + this.name + "'. Додаток " + this.__currentApp + " вже запущено.");
        }
    } else {
        console.log("Для запску додатку, спершу включіть '" + this.name + "'!");
    }
};

TV.prototype.closeApp = function () {
    if (this.__isOn) {
        if (this.__isAppOpen) {
            console.log("На '" + this.name + "' закрито додаток: " + this.__currentApp + ".");
            this.__isAppOpen = false;
            this.__currentApp = null;
        } else {
            console.log("Немає відкритих додатків на '" + this.name + ".");
        }
    } else {
        console.log("Неможливо закрити додаток на '" + this.name + "', пристрій виключений!");
    }
};

// Приклад використання

var sh = new Hub("Google Nest Hub");

var lamp1 = new Lamp("Philips Smart LED");
var lamp2 = new Lamp("Mi Smart RGB");

var security = new SecuritySystem("Ajax Security System");

var eKettle1 = new ElectricKettle("Xiaomi Mi Smart Kettle Pro", 1500);
var eKettle2 = new ElectricKettle("Tefal Digital", 1700);

var tv1 = new TV("Samsung SmartTV 98\"");
var tv2 = new TV("Samsung SmartTV 50\"");

sh.addDevice(lamp1);
sh.addDevice(lamp2);
sh.addDevice(security);
sh.addDevice(eKettle1);
sh.addDevice(eKettle2);
sh.addDevice(tv1);
sh.addDevice(tv2);

sh.getDevices();

console.log();
sh.onAllDevices();

console.log();
sh.offAllDevices();

console.log();
sh.getDeviceByName("Mi Smart RGB").setColor("blue");
sh.getDeviceByName("Mi Smart RGB").turnOn();
sh.getDeviceByName("Mi Smart RGB").setTimer(4, function (error, data) {
    if (error) {
        console.log(error);
    } else {
        console.log(data);
    }
});
sh.getDeviceByName("Mi Smart RGB").setColor("blue");
sh.getDeviceByName("Mi Smart RGB").setBrightness(100);
// sh.getDeviceByName("Mi Smart RGB").setBrightness(0);

console.log();
sh.getDeviceByName("Ajax Security System").turnOn();
setTimeout(function () {
    sh.getDeviceByName("Ajax Security System").getWorkStatus();
}, 5000);
setTimeout(function () {
    sh.getDeviceByName("Ajax Security System").turnOff();
}, 12000);

console.log();
sh.getDeviceByName("Tefal Digital").setCurrentWaterVolume(700);
sh.getDeviceByName("Tefal Digital").turnOn();

console.log();
sh.getDeviceByName("Samsung SmartTV 98\"").openApp("Netflix");
sh.getDeviceByName("Samsung SmartTV 98\"").closeApp();
sh.getDeviceByName("Samsung SmartTV 98\"").turnOn();
sh.getDeviceByName("Samsung SmartTV 98\"").closeApp();
sh.getDeviceByName("Samsung SmartTV 98\"").openApp("SweetTV");
sh.getDeviceByName("Samsung SmartTV 98\"").closeApp();
sh.getDeviceByName("Samsung SmartTV 98\"").turnOff();

console.log();
sh.removeDevice(lamp2);

sh.getDevices();