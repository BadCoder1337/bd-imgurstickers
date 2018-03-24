

_Лучший [сервер](https://discord.gg/5hW8UP5) за последнюю тысячу лет._  
Пишите в Discord DM(FaZebook#1488)  или [репортите баг на GitHub](https://github.com/badcoder1337/bd-imgurstickers/issues)

[English Version](README_en.md)

# BetterDiscord Imgur Stickers Plugin

Расширяет меню эмодзи BetterDiscord, добавляя возможность встраивания стикеров из Imgur (одиночные изображения, галереи и альбомы).  
[![](https://i.imgur.com/l7V3UVe.png)](https://github.com/badcoder1337/bd-imgurstickers#Установка)
[![](https://i.imgur.com/Q9zcxSi.png)](https://github.com/badcoder1337/bd-imgurstickers#Установка)  
*※ не знаю, кто использует светлую тему, но поддержка есть*

## Установка

* Установите ~~BetterDiscord~~ [Zere's fork](https://github.com/rauenzi/BetterDiscordApp/releases/).
ЭТО ВАЖНО! Обычная версия глючит на каждом шагу и иногда банально не запускает стикер-меню. 
* Установите плагин
	* Откройте папку `C:\Users\<user>\AppData\Roaming\BetterDiscord\plugins` в проводнике или через кнопку **Open Plugin Folder** в разделе настроек плагинов BetterDiscord.
  * Сохраните файл [`imguremotes.plugin.js`](https://raw.githubusercontent.com/badcoder1337/bd-imgurstickers/master/dist/imguremotes.plugin.js) в этой папке.
*  Перезапустите Discord (*Ctrl + R или иначе*).
* Включите плагин
  * Откройте `Настройки`  - `Plugins` и убедитесь, что плагин определился и включен. 
* Откройте меню плагинов и вы увидите вкладку **Imgur**.

## Добавление стикеров

### Добавление стикеров из Telegram...
 
1) Найдите нужные вам стикеры. Например, [здесь](https://tlgrm.ru/stickers).
2) Добавьте их к себе.
3) Начните диалог с ботом `@stickerset2packbot`, написав сначала `/start`, а потом `/newpack`.
4) Перешлите ему все необходимые стикеры и завершите диалог командой `/finish png 250`.
5) Скачайте и разархивируйте полученный архив. 
6) Откройте папку `<ВашАрхив>\<IDТелеги>\img`.
7) Загрузите картинки на [Imgur](https://imgur.com/upload).
8) Скопируйте ссылку на пост. Например, `https://imgur.com/a/PjtQR`.

### Добавление стикеров из ВКонтакте...

1) Найдите нужные вам стикеры. Например, [здесь](http://vkclub.su/ru/stickers/).
2) Скачайте их к себе.
3) Загрузите картинки на [Imgur](https://imgur.com/upload).
4) Скопируйте ссылку на пост. Например, `https://imgur.com/a/PjtQR`.

### ...в Дискорд

1) Нажмите на **+** во вкладке **Imgur** стикер-меню

  ![](https://i.imgur.com/dYnjres.png)

2) Вставьте скопированную ранее ссылку в нижнее поле. Введите в верхнее поле название набора стикеров. Если оставить пустым, то имя набора будет синхронизировано с названием поста на **Imgur**

  ![](https://i.imgur.com/WudYrqA.png)

3) Нажмите на другой **+**

  ![](https://i.imgur.com/x09f9NV.png)


## Удаление или переименовывание

* Наведите мышку справа от заголовка
* Нажмите на крестик для удаления и подтвердите.
* Нажмите на карандаш для редактирования названия набора.

![](https://i.imgur.com/QSTw9MC.png)

*※ Если что-то пошло не так вы можете открыть файл настроек `%appdata%\BetterDiscord\plugins\imguremotes.config.json`  и вручную его отредактировать. После изменений перезапустите Discord закрыв и открыв его снова.*

## Изменение размеров меню

Вы можете перемасштабировать меню стикеров следующими командами в консоли `Ctrl + Shift + I` (например, для мониторов с большим разрешением):

`imguremotes.menu.setWidth(<Ширина>)`

`imguremotes.menu.setHeight(<Высота>)`

`imguremotes.menu.setSize(<Ширина>, <Высота>)`

*※ например, меню шириной в 6 стикеров `imguremotes.menu.setSize(494, 326)`*

Для сброса к настройкам по умолчанию вы можете использовать команду

`imguremotes.menu.setSize(0, 0)`

## CSS патчи для совместимостью со стороними темами

Скопируйте и вставьте код патча в раздел `Настройки` - `Custom CSS`

- Beard's Material Design ([тема](https://github.com/BeardDesign1/Material-design-theme), [патч](https://github.com/BadCoder1337/bd-imgurstickers/blob/master/css_patch/imguremotes.patch-beardsmaterialdesign.css))
- Full Dark ([тема](https://github.com/fluffingtons/fulldark), [патч](https://github.com/BadCoder1337/bd-imgurstickers/blob/master/css_patch/imguremotes.patch-fulldark.css))

##### Спасибо [awaken1ng](https://github.com/awaken1ng/bd-linestickers) за оригинальный плагин для стикеров LINE 
