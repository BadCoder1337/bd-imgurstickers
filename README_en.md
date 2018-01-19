

Write to my Discord DM(FaZebook#3120) or [report a bug on GitHub](https://github.com/badcoder1337/bd-imgurstickers/issues)

[Russian Version](README.md)

# BetterDiscord Imgur Stickers Plugin

Extends BetterDiscord emote menu to add a tab with Imgur stickers (single images, galleries or albums).  
[![](https://i.imgur.com/l7V3UVe.png)](https://github.com/badcoder1337/bd-imgurstickers#Installation)
[![](https://i.imgur.com/Q9zcxSi.png)](https://github.com/badcoder1337/bd-imgurstickers#Installation)  
*※ idk, who uses light theme, but plugin support this*

## Installation

* Install ~~BetterDiscord~~ [Zere's fork](https://github.com/rauenzi/BetterDiscordApp/releases/).
IT IS IMPORTANT! Regular version buggy as f***. 
* Install the plugin
	* Open the folder at %AppData%\Roaming\BetterDiscord\plugins by navigating there via File Explorer of your choice
  * Drop the plugin [`imguremotes.plugin.js`](https://raw.githubusercontent.com/badcoder1337/bd-imgurstickers/master/dist/imguremotes.plugin.js) off there.
*  Restart Discord (Ctrl + R or a method of your choice).
	* Make sure the plugin is enabled
  * Open `User Settings` - `BetterDiscord` - `Plugins`, you should see plugin in the list, enable it by checking the box
* Open the Emote menu, you should see a **Imgur** tab in there 

## Adding stickers

### Adding stickers from Telegram...
 
1) Find the stickers what do you need. For example, [here](https://tlgrm.eu/stickers).
2) Add it to yourself.
3) Start dialogue with bot `@stickerset2packbot` with `/start` and `/newpack`.
4) Send to bot all necessary stickers. Finish dialogue with`/finish png 250`.
5) Download and unzip the archive. 
6) Open folder `<YourArchive>\<TelegramID>\img`.
7) Upload images to [Imgur](https://imgur.com/upload).
8) Copy post link. For example, `https://imgur.com/a/5WYxY`.

### ...to Discord

1) Open the tab by pressing the plus sign at the bottom.

  ![](https://i.imgur.com/dYnjres.png)

2) Paste post link, enter title. If title will be leave by default, pack title will be synced with **Imgur** post name.

  ![](https://i.imgur.com/CyYatPq.png)

3) Press `Add` button.

  ![](https://i.imgur.com/EJl34TQ.png)


## Removing or renaming stickers

* Move your cursor into the right part of the title, you'll see two icons there
* Click on the cross icon and confirm deletion.
* Click on the pen icon, edit the name, then either press `Enter` or click away.

![](https://i.imgur.com/QSTw9MC.png)

*※ In case of an emergency, you can edit the config at %appdata%\BetterDiscord\plugins\imguremotes.config.json manually, after making changes, please fully restart Discord by closing it and opening it again*

## Resizing the window

You can resize the **Imgur** tab using the following commands in console:

`imguremotes.menu.setWidth(<Width>)`

`imguremotes.menu.setHeight(<Height>)`

`imguremotes.menu.setSize(<Width>, <Height>)`

*※ for example `imguremotes.menu.setSize(494, 326)`*

For reset use`imguremotes.menu.setSize(0, 0)`

## CSS patches for theme compatibility

Copy and paste the CSS patch into`Settings` - `Custom CSS`

- Beard's Material Design ([theme](https://github.com/BeardDesign1/Material-design-theme), [patch](https://github.com/BadCoder1337/bd-imgurstickers/blob/master/css_patch/imguremotes.patch-beardsmaterialdesign.css))
- Full Dark ([theme](https://github.com/fluffingtons/fulldark), [patch](https://github.com/BadCoder1337/bd-imgurstickers/blob/master/css_patch/imguremotes.patch-fulldark.css))

##### Thanks to [awaken1ng](https://github.com/awaken1ng/bd-linestickers) for original plugin for LINE stickers
