//META{"name":"imguremotes"}*//

var imguremotes = function () {};

imguremotes.prototype.load = function () {
    imguremotes.log('Loading');
};

imguremotes.prototype.start = function () {
    imguremotes.log('Initializing');
    BdApi.clearCSS('imguremotes');
    BdApi.injectCSS('imguremotes', imguremotes.getStylesheet())
    imguremotes.menu.init();
};


imguremotes.prototype.stop = function () {
    imguremotes.log('Stopping, reverting emote menu to default');
    imguremotes.menu.unload();
    BdApi.clearCSS('imguremotes');
};

imguremotes.prototype.unload = function () {
    imguremotes.log('Unloading');
};

imguremotes.prototype.onMessage = function () {
    //called when a message is received
};

imguremotes.prototype.onSwitch = function () {
    //called when a server or channel is switched
};

imguremotes.prototype.settings = function () {};
imguremotes.prototype.settings.toggleHide = function () {
    let checked = bdPluginStorage.get(imguremotes.storage.getName(), 'hideURLs')
    imguremotes.log(`Toggling hide, was ${checked}`)
    if (!checked) {
        bdPluginStorage.set(imguremotes.storage.getName(), 'hideURLs', true);
        $('#imgur-settings-hideurl').parent().find('.ui-switch').addClass('checked')
    } else {
        bdPluginStorage.set(imguremotes.storage.getName(), 'hideURLs', false);
        $('#imgur-settings-hideurl').parent().find('.ui-switch').removeClass('checked')
    }
};

imguremotes.prototype.getSettingsPanel = function () {
    let checked = ''
    if (bdPluginStorage.get(imguremotes.storage.getName(), 'hideURLs') == true) { checked = 'checked=""'; }

    let toggle = document.createElement('label');
    toggle.classList.add('ui-switch-wrapper', 'ui-flex-child');
    toggle.setAttribute('style', 'flex:0 0 auto;');

    let input = document.createElement('input');
    input.classList.add('ui-switch-checkbox');
    input.setAttribute('id', 'imgur-settings-hideurl');
    input.setAttribute('type', 'checkbox');
    if (bdPluginStorage.get(imguremotes.storage.getName(), 'hideURLs') == true) { input.setAttribute('checked', ''); }
    input.setAttribute('onclick', 'imguremotes.prototype.settings.toggleHide()')

    let div = document.createElement('div');
    div.classList.add('ui-switch');
    if (bdPluginStorage.get(imguremotes.storage.getName(), 'hideURLs'))
        div.classList.add('checked');

    toggle.appendChild(input);
    toggle.appendChild(div);

    return "<div style='display:flex;'><h3 style='color:#b0b6b9;'>Hide sticker URL on client side (others will still see it, switch text channel or server for the change to apply)</h3>" + toggle.outerHTML + "</div>";
};

imguremotes.prototype.getLocalizationStrings = function () {
  var locale = document.children[0].getAttribute('lang');
  var localization_strings = {
    'bda-qem-emojis': 'Emojis',
    'bda-qem-favourite': 'Favourite',
    'bda-qem-imgur': 'Imgur',
	'addform-title': 'Title',
    'addform-title-placeholder': 'Default',
    'addform-pack': 'Imgur post',
    //'addform-id': 'not used',
    'addform-add': 'Add',
    'delete-confirm': 'Are you sure you want to delete this pack?',
    'yes': 'Yes',
    'no': 'No'
  }
  if (locale === 'ru') {
    localization_strings['bda-qem-emojis'] = 'Стикеры',
    localization_strings['bda-qem-favourite'] = 'Избранное',
	localization_strings['bda-qem-imgur'] = 'Imgur',
	localization_strings['addform-title'] = 'Заголовок',
    localization_strings['addform-title-placeholder'] = 'По умолчанию',
    localization_strings['addform-pack'] = 'Пост Imgur',
    //localization_strings['addform-id'] = 'не используется',
    localization_strings['addform-add'] = '<b>+</b>',
    localization_strings['delete-confirm'] = 'Вы действительно хотите удалить этот пак?',
    localization_strings['yes'] = 'Да',
    localization_strings['no'] = 'Нет'
  }

  return localization_strings;
}

//logger function, outputs console message in '[imgur Stickers] <message>' format
imguremotes.log = (message) => console.log(`[${imguremotes.prototype.getName()}] ${message}`);
imguremotes.getBDRepo = () => {
    var script_url = $("script[src*='BetterDiscordApp']").attr('src').split('/')
    if (script_url[4] !== 'BetterDiscordApp')
        throw ReferenceError(`Error in getBDRepo(), expected 'BetterDiscordApp', found '${script_url[4]}'`)
    return script_url[3]
};

imguremotes.prototype.getName = () => "Imgur Stickers";
imguremotes.prototype.getDescription = () => "Extends emote menu to add imgur hosted stickers.";
// imguremotes.prototype.getVersion = () => "2.2.8";
imguremotes.prototype.getAuthor = () => "Awakening, remake for Imgur: BadCoder1337";


imguremotes.categories = function() {}

imguremotes.categories.buildContainer = function() {
    var container = '';
    var categories = '';


    var storage = imguremotes.storage.get();
    if (storage) {
        for (var pack = 0; pack < storage.length; ++pack) {
            categories += `<div class="item" data-id="${storage[pack]['id']}" onclick="$('#bda-qem-imgur-container .imgur-pack')[${pack}].scrollIntoView()" style='background-image: url("https://i.imgur.com/${(storage[pack]['images'][0])}")'></div>`;
        }
    }
    var localization_strings = imguremotes.prototype.getLocalizationStrings();
    //var numbersOnly = "return event.charCode >= 48 && event.charCode <= 57";
    container += `
<div class="add-form" style="opacity: 0; pointer-events: none;">
    <div class="labels">
        <label for="imgur-add-title">${localization_strings['addform-title']}</label>
        <label for="imgur-add-pack">${localization_strings['addform-pack']}</label>
        <!--<label for="imgur-add-id">${localization_strings['addform-id']}</label>-->
    </div>
    <div class="inputs">
        <input id="imgur-add-title" placeholder="${localization_strings['addform-title-placeholder']}">
        <input id="imgur-add-pack" placeholder="URL">
        <!--<input id="imgur-add-id" placeholder="${localization_strings['addform-id']}">-->
    </div>

    <button type="button" class="imgur-add-button ui-button filled brand small">
        <div class="ui-button-contents">${localization_strings['addform-add']}</div>
    </button>
</div>
<div class="categories-container">
    <div class="categories-wrapper">
        <div class="item add-pack-button">
            <svg class="add-pack" width="20" height="20" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
            </svg>
        </div>
        ${categories}
    </div>
</div>
`;
    return container;
};

imguremotes.categories.init = function () {
    imguremotes.editbar.init();
    $('#bda-qem-imgur-container .categories-container .categories-wrapper').bind('mousewheel', function(event) {
	if ((event.originalEvent.wheelDelta || event.originalEvent.detail) > 0)
            this.scrollLeft -= 25;
        else
            this.scrollLeft += 25;
	return false;
    });
    $('#bda-qem-imgur-container .categories-container .add-pack').off('click');
    $('#bda-qem-imgur-container .categories-container .add-pack').on('click', (event) => {
        var state = $('#bda-qem-imgur-container .add-form').css('opacity');
        if (state == '1') {
            $('#bda-qem-imgur-container .categories-container .add-pack').addClass('icon-plus');
            $('#bda-qem-imgur-container .categories-container .add-pack').removeClass('icon-minus');
            $('#bda-qem-imgur-container .add-form').css('opacity', '0');
            $('#bda-qem-imgur-container .add-form').css('pointer-events', 'none');
        }
        else if (state == '0') {
            $('#bda-qem-imgur-container .categories-container .add-pack').addClass('icon-minus');
            $('#bda-qem-imgur-container .categories-container .add-pack').removeClass('icon-plus');
            $('#bda-qem-imgur-container .add-form').css('opacity', '1');
            $('#bda-qem-imgur-container .add-form').css('pointer-events', 'unset');
        }
    });

    var state = {
        'id': false,
        'length': true,
        'title': false
    };

    function validate() {
        /* function clearAndSet(target, state) {
            $(target).removeClass('valid');
            $(target).removeClass('invalid');
            $(target).addClass(state);
        }
        if (state['id'] && state['length'] && state['title']) {
            clearAndSet($('#bda-qem-imgur-container .imgur-add-button'), 'valid');
            return true;
        } else {
            clearAndSet($('#bda-qem-imgur-container .imgur-add-button'), 'invalid');
            return false;
        } */
		return true;
    }

    $(`#imgur-add-title`).off();
    $(`#imgur-add-pack`).off();
    $(`#imgur-add-id`).off();

    $(`#imgur-add-title`).keyup((event) => {
        if ($(event.target).val()) state['title'] = true;
        else state['title'] = false;
        validate();
    });
    $(`#imgur-add-pack`).keyup((event) => {
        if (Number($(event.target).val())) state['length'] = true;
        else state['length'] = false;
        validate();
    });
    $(`#imgur-add-id`).keyup((event) => {
        if (Number($(event.target).val().trim())) state['id'] = true;
        else state['id'] = false;
        validate();
    });

    $('#bda-qem-imgur-container .imgur-add-button').off('click');
    $('#bda-qem-imgur-container .imgur-add-button').mouseenter((event) => {
        validate();
    });
    $('#bda-qem-imgur-container .imgur-add-button').on('click', (event) => {
        if (validate()) {
            var title = $('#imgur-add-title').val().trim();
            var img_link = $('#imgur-add-pack').val().trim();
			var opt = {
				method: 'GET',
				headers: new Headers({'Authorization': 'Client-ID 249cabd734502ac'})
			};
			if (img_link.indexOf('/a/')) {
				imguremotes.log('Reqest album');
				fetch('https://api.imgur.com/3/album/'+img_link.slice(img_link.lastIndexOf("\/")+1), opt)
					.then(function (res) {
						res.json()
							.then(function (data) {
								if (data.success == true) {
									var images = []
									if (!title) {title = data.data.title};
									//imguremotes.log('Length: '+data.data.images.length);
									for (var i = 0; i < data.data.images.length; i++) {
										let link = data.data.images[i].link;
										images.push(link.slice(link.lastIndexOf('\/')+1));
										//imguremotes.log("A Img: "+link.slice(link.lastIndexOf('\/')+1));
									}
									imguremotes.appendPack(data.data.id, title, images);
									//imguremotes.log("A Images: "+images.join(', '));
								}                                                                                       
							})                                                                                          
					});                                                                                                 
			} else if (img_link.indexOf('/gallery/')) {                                                               
				imguremotes.log('Reqest gallery');
				fetch('https://api.imgur.com/3/gallery/'+img_link.slice(img_link.lastIndexOf("\/")+1), opt)
					.then(function (res) {
						res.json()
							.then(function (data) {
								if (data.success == true) {
									var images = []
									if (!title) {title = data.data.title};
									for (var i = 0; i < data.data.images.length; i++) {
										let link = data.data.images[i].link;
										images.push(link.slice(link.lastIndexOf('\/')+1));
										imguremotes.log("G Img: "+link.slice(link.lastIndexOf('\/')+1));
									}
									imguremotes.appendPack(data.data.id, title, images);
									//imguremotes.log("G Images: "+images.join(', '));
								}
							})
					});								
			} else {
				imguremotes.log('Reqest image');
				fetch('https://api.imgur.com/3/image/'+img_link.slice(img_link.lastIndexOf("\/")+1), opt)
					.then(function (res) {
						res.json()
							.then(function (data) {
								if (data.success == true) {
									var images = []
									if (!title) {title = data.data.title};
									let link = data.data.link;
									images.push(link.slice(link.lastIndexOf('\/')+1));
									imguremotes.appendPack(data.data.id, title, images);
									//imguremotes.log("N Images: "+images.join(', '));
								}
							})
					});
			}
			
            //var id = $('#imgur-add-id').val().trim();
            
            $('#imgur-add-title').val('');
            $('#imgur-add-pack').val('');
            //$('#imgur-add-id').val('');
        }
    });
};

imguremotes.menu = function () {}

imguremotes.menu.init = function () {
    quickEmoteMenu.lsContainer = this.buildContainer();
    
    // band aid fix for compatibility with Zerebos fork
    if (imguremotes.getBDRepo() === 'rauenzi') {
        // overriding
        // adding imgur tab into the callback function
        QuickEmoteMenu.prototype.obsCallback = function(elem) {
            var e = $(elem);
            // Emotes - Show Discord emoji menu
            if (!settingsCookie["bda-es-9"])
                e.addClass("bda-qme-hidden");
            else
                e.removeClass("bda-qme-hidden");

            // rebuild container if the language was changed
            var localization_strings = imguremotes.prototype.getLocalizationStrings();
            if (this.locale === undefined) {
                this.locale = document.children[0].getAttribute('lang');
            } else if (this.locale !== document.children[0].getAttribute('lang')) {
                imguremotes.log('Language changed, rebuilding container to reflect changes')
                this.locale = document.children[0].getAttribute('lang');
                this.lsContainer = imguremotes.menu.buildContainer();
            }

            // avoid unnecessary whitespace
            var qmeHeader = `<div id="bda-qem">`
            qmeHeader += `<button class="active" id="bda-qem-twitch" onclick='quickEmoteMenu.switchHandler(this); return false;'>Twitch</button>`
            qmeHeader += `<button id="bda-qem-favourite" onclick='quickEmoteMenu.switchHandler(this); return false;'>${localization_strings['bda-qem-favourite']}</button>`
            qmeHeader += `<button id="bda-qem-emojis" onclick='quickEmoteMenu.switchHandler(this); return false;'>${localization_strings['bda-qem-emojis']}</button>`
            qmeHeader += `<button id="bda-qem-imgur" onclick="quickEmoteMenu.switchHandler(this); return false;">${localization_strings['bda-qem-imgur']}</button>`
            qmeHeader += `<div>`
            e.prepend(qmeHeader);

            // Emotes - Show Twitch/Favourite
            if (settingsCookie["bda-es-0"]) {
                e.append(this.teContainer);
                e.append(this.faContainer);
                e.removeClass("bda-qme-te-hidden");
            } else {
                e.addClass("bda-qme-te-hidden");
            }

            e.append(this.lsContainer);

            // if twitch/favourite tab and discord emoji tab disabled
            if ((!settingsCookie["bda-es-0"]) && (!settingsCookie["bda-es-9"]))
                this.lastTab = "bda-qem-imgur";

            // if twitch/favourite tab is disabled and the last open tab was one of them
            if (((this.lastTab == 'bda-qem-emojis') || (this.lastTab == 'bda-qem-favourite')) && (!settingsCookie["bda-es-0"]))
                this.lastTab = "bda-qem-emojis";

            // if discord emoji tab is disabled and it was the last open tab
            if ((this.latTab == 'bda-qem-emojis') && (!settingsCookie["bda-es-9"]))
                this.lastTab = "bda-qem-favourite";

            if (this.lastTab === undefined)
                // if twitch tab is disabled, default to discord emoji tab
                if (!settingsCookie["bda-es-0"])
                    this.lastTab = 'bda-qem-emojis';
                else
                    this.lastTab = "bda-qem-favourite";

            this.switchQem(this.lastTab);
        };
        // initializing stuff,
        // making the tab openable, copying sticker URL into text area on click, initializing on-hover preview
        QuickEmoteMenu.prototype.switchQem = function(id) {
            var twitch = $("#bda-qem-twitch");
            var fav = $("#bda-qem-favourite");
            var emojis = $("#bda-qem-emojis");
            var imgur = $("#bda-qem-imgur");
            twitch.removeClass("active");
            fav.removeClass("active");
            emojis.removeClass("active");
            imgur.removeClass("active");
            $(".emoji-picker, .emojiPicker-3g68GS").hide();
            $("#bda-qem-favourite-container").hide();
            $("#bda-qem-twitch-container").hide();
            $("#bda-qem-imgur-container").hide();
            switch (id) {
            case "bda-qem-twitch":
                twitch.addClass("active");
                $("#bda-qem-twitch-container").show();
                break;
            case "bda-qem-favourite":
                fav.addClass("active");
                $("#bda-qem-favourite-container").show();
                break;
            case "bda-qem-emojis":
                emojis.addClass("active");
                $(".emoji-picker, .emojiPicker-3g68GS").show();
                    $(".emoji-picker .search-bar-inner input, .emojiPicker-3g68GS .search-bar-inner input").focus();
                break
            case "bda-qem-imgur":
                imgur.addClass("active");
                $("#bda-qem-imgur-container").show();
                break
            }
            this.lastTab = id;
            var emoteIcon = $(".emote-icon");
            emoteIcon.off();
            emoteIcon.on("click", function() {
                // find out what tab we're dealing with
                if ($(this).parent().parent().attr("class") === 'imgur-pack-stickers') {
                    // if dealing with imgur stickers tab, grab src
                    var emote = $(this).attr("src") // + '\n';
                } else {
                    // otherwise grab title attribute
                    var emote = $(this).attr("title");
                }
                var ta = utils.getTextArea();
                utils.insertText(ta[0], ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote)
                // force the textarea to resize if needed
                ta[0].dispatchEvent(new Event('input', { bubbles: true }));
                
            });
            imguremotes.preview.init();
            imguremotes.categories.init();
            imguremotes.confirm.init();
            imguremotes.menu.resize();
        };
    } else {
        // overriding
        // adding imgur tab into the callback function
        QuickEmoteMenu.prototype.obsCallback = function(e) {
            // Emotes - Show Discord emoji menu
            if (!settingsCookie["bda-es-9"])
                e.addClass("bda-qme-hidden");
             else
                e.removeClass("bda-qme-hidden");
    
            var self = this;
    
            // rebuild container if the language was changed
            var localization_strings = imguremotes.prototype.getLocalizationStrings();
            if (this.locale === undefined) {
                this.locale = document.children[0].getAttribute('lang');
            } else if (this.locale !== document.children[0].getAttribute('lang')) {
                imguremotes.log('Language changed, rebuilding container to reflect changes')
                this.locale = document.children[0].getAttribute('lang');
                this.lsContainer = imguremotes.menu.buildContainer();
            }
    
            // avoid unnecessary whitespace
            var qmeHeader = `<div id="bda-qem">`
            qmeHeader += `<button class="active" id="bda-qem-twitch" onclick='quickEmoteMenu.switchHandler(this); return false;'>Twitch</button>`
            qmeHeader += `<button id="bda-qem-favourite" onclick='quickEmoteMenu.switchHandler(this); return false;'>${localization_strings['bda-qem-favourite']}</button>`
            qmeHeader += `<button id="bda-qem-emojis" onclick='quickEmoteMenu.switchHandler(this); return false;'>${localization_strings['bda-qem-emojis']}</button>`
            qmeHeader += `<button id="bda-qem-imgur" onclick="quickEmoteMenu.switchHandler(this); return false;">${localization_strings['bda-qem-imgur']}</button>`
            qmeHeader += `<div>`
            e.prepend(qmeHeader);
    
            // Emotes - Show Twitch/Favourite
            if (settingsCookie["bda-es-0"]) {
                e.append(this.teContainer);
                e.append(this.faContainer);
                e.removeClass("bda-qme-te-hidden");
            } else {
                e.addClass("bda-qme-te-hidden");
            }
    
            e.append(this.lsContainer);
    
            // if twitch/favourite tab and discord emoji tab disabled
            if ((!settingsCookie["bda-es-0"]) && (!settingsCookie["bda-es-9"]))
                this.lastTab = "bda-qem-imgur";
    
            // if twitch/favourite tab is disabled and the last open tab was one of them
            if (((this.lastTab == 'bda-qem-emojis') || (this.lastTab == 'bda-qem-favourite')) && (!settingsCookie["bda-es-0"]))
                this.lastTab = "bda-qem-emojis";
    
            // if discord emoji tab is disabled and it was the last open tab
            if ((this.latTab == 'bda-qem-emojis') && (!settingsCookie["bda-es-9"]))
                this.lastTab = "bda-qem-favourite";
    
            if (this.lastTab === undefined)
                // if twitch tab is disabled, default to discord emoji tab
                if (!settingsCookie["bda-es-0"])
                    this.lastTab = 'bda-qem-emojis';
                else
                    this.lastTab = "bda-qem-favourite";
    
            this.switchQem(this.lastTab);
        };    
        // initializing stuff,
        // making the tab openable, copying sticker URL into text area on click, initializing on-hover preview
        QuickEmoteMenu.prototype.switchQem = function(id) {
            var twitch = $("#bda-qem-twitch");
            var fav = $("#bda-qem-favourite");
            var emojis = $("#bda-qem-emojis");
            var imgur = $("#bda-qem-imgur");
            twitch.removeClass("active");
            fav.removeClass("active");
            emojis.removeClass("active");
            imgur.removeClass("active");
            $(".emoji-picker").hide();
            $("#bda-qem-favourite-container").hide();
            $("#bda-qem-twitch-container").hide();
            $("#bda-qem-imgur-container").hide();
            switch (id) {
            case "bda-qem-twitch":
                twitch.addClass("active");
                $("#bda-qem-twitch-container").show();
                break;
            case "bda-qem-favourite":
                fav.addClass("active");
                $("#bda-qem-favourite-container").show();
                break;
            case "bda-qem-emojis":
                emojis.addClass("active");
                $(".emoji-picker").show();
                break
            case "bda-qem-imgur":
                imgur.addClass("active");
                $("#bda-qem-imgur-container").show();
            }
            this.lastTab = id;
            var emoteIcon = $(".emote-icon");
            emoteIcon.off();
            emoteIcon.on("click", function() {
                // find out what tab we're dealing with
                if ($(this).parent().parent().attr("class") === 'imgur-pack-stickers') {
                    // if dealing with imgur stickers tab, grab src
                    var emote = $(this).attr("src") // + '\n';
                } else {
                    // otherwise grab title attribute
                    var emote = $(this).attr("title");
                }
                var ta = $(".chat form textarea");
                var text = ta.val().slice(-1) == " " ? emote : " " + emote
                ta.focus();
                document.execCommand("insertText", false, text);
                // force the textarea to resize if needed
                ta[0].dispatchEvent(new Event('input', { bubbles: true }));
                
            });
            imguremotes.preview.init();
            imguremotes.categories.init();
            imguremotes.confirm.init();
            imguremotes.menu.resize();
        };
    }

    
};

imguremotes.menu.buildContainer = function () {
    imguremotes.log('Start building');
	var stickers = '';
    var storage = imguremotes.storage.get();

    for (var pack = 0; pack < storage.length; ++pack) {
        stickers += imguremotes.pack.wrapPack(storage[pack]['id']);
    }

    // var container = `${imguremotes.getStylesheet()}
    var container = `
<div id="bda-qem-imgur-container">
    <div class="scroller-wrap fade">
        ${imguremotes.confirm.buildContainer()}
        <div class="scroller">
            <div class="emote-menu-inner">
                ${stickers}
            </div>
        </div>
    </div>
    ${imguremotes.preview.buildContainer()}
    ${imguremotes.categories.buildContainer()}
</div>`;
    return container;
};

imguremotes.menu.rebuild = function () {
    imguremotes.log('Rebuilding container');
    quickEmoteMenu.lsContainer = this.buildContainer();
};

imguremotes.menu.unload = function () {
    // reverting the overriden functions
    if (imguremotes.getBDRepo() === 'rauenzi') {  // band aid fix for compatibility with Zerebos fork
        QuickEmoteMenu.prototype.obsCallback = function (elem) {
            var e = $(elem);
            if(!settingsCookie["bda-es-9"]) {
                e.addClass("bda-qme-hidden");
            } else {
                e.removeClass("bda-qme-hidden");
            }
        
            if(!settingsCookie["bda-es-0"]) return;
        
            e.prepend(this.qmeHeader);
            e.append(this.teContainer);
            e.append(this.faContainer);
        
            if(this.lastTab == undefined) {
                this.lastTab = "bda-qem-favourite";
            } 
            this.switchQem(this.lastTab);
        };
        QuickEmoteMenu.prototype.switchQem = function (id) {
            var twitch = $("#bda-qem-twitch");
            var fav = $("#bda-qem-favourite");
            var emojis = $("#bda-qem-emojis");
            twitch.removeClass("active");
            fav.removeClass("active");
            emojis.removeClass("active");
        
            $(".emoji-picker, .emojiPicker-3g68GS").hide();
            $("#bda-qem-favourite-container").hide();
            $("#bda-qem-twitch-container").hide();
        
            switch(id) {
                case "bda-qem-twitch":
                    twitch.addClass("active");
                    $("#bda-qem-twitch-container").show();
                break;
                case "bda-qem-favourite":
                    fav.addClass("active");
                    $("#bda-qem-favourite-container").show();
                break;
                case "bda-qem-emojis":
                    emojis.addClass("active");
                    $(".emoji-picker, .emojiPicker-3g68GS").show();
                    $(".emoji-picker .search-bar-inner input, .emojiPicker-3g68GS .search-bar-inner input").focus();
                break;
            }
            this.lastTab = id;
        
            var emoteIcon = $(".emote-icon");
            emoteIcon.off();
            emoteIcon.on("click", function () {
                var emote = $(this).attr("title");
                var ta = utils.getTextArea();
                utils.insertText(ta[0], ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
            });
        };
    } else {
        QuickEmoteMenu.prototype.obsCallback = function(e) {
            if (!settingsCookie["bda-es-9"]) {
                e.addClass("bda-qme-hidden");
            } else {
                e.removeClass("bda-qme-hidden");
            }
            if (!settingsCookie["bda-es-0"])
                return;
            var self = this;
            e.prepend(this.qmeHeader);
            e.append(this.teContainer);
            e.append(this.faContainer);
            if (this.lastTab == undefined) {
                this.lastTab = "bda-qem-favourite";
            }
            this.switchQem(this.lastTab);
        };

        QuickEmoteMenu.prototype.switchQem = function(id) {
            var twitch = $("#bda-qem-twitch");
            var fav = $("#bda-qem-favourite");
            var emojis = $("#bda-qem-emojis");
            twitch.removeClass("active");
            fav.removeClass("active");
            emojis.removeClass("active");
            $(".emoji-picker").hide();
            $("#bda-qem-favourite-container").hide();
            $("#bda-qem-twitch-container").hide();
            switch (id) {
            case "bda-qem-twitch":
                twitch.addClass("active");
                $("#bda-qem-twitch-container").show();
                break;
            case "bda-qem-favourite":
                fav.addClass("active");
                $("#bda-qem-favourite-container").show();
                break;
            case "bda-qem-emojis":
                emojis.addClass("active");
                $(".emoji-picker").show();
                break;
            }
            this.lastTab = id;
            var emoteIcon = $(".emote-icon");
            emoteIcon.off();
            emoteIcon.on("click", function() {
                var emote = $(this).attr("title");
                var ta = $(".channel-text-area-default textarea");
                ta.val(ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
            });
        }
    }
    
    

    // setting the last opened tab to emoji tab
    quickEmoteMenu.lastTab = "bda-qem-emojis"
};


imguremotes.menu.setWidth = function(width) {
    if (width < 344) { width = 344; imguremotes.log("Can't set width less than 344px"); }
    bdPluginStorage.set('imguremotes', 'width', width);
    imguremotes.menu.resize();
};

imguremotes.menu.setHeight = function(height) {
    if (height < 326) { height = 326; imguremotes.log("Can't set height less than 326px"); }
    bdPluginStorage.set('imguremotes', 'height', height);
    imguremotes.menu.resize();
};

imguremotes.menu.setSize = function(width, height) {
    imguremotes.menu.setWidth(width);
    imguremotes.menu.setHeight(height);
};

imguremotes.menu.getWidth = function(width) { return bdPluginStorage.get('imguremotes', 'width'); };
imguremotes.menu.getHeight = function(height) { return bdPluginStorage.get('imguremotes', 'height'); };
imguremotes.menu.getSize = function(width, height) {
    return {
        width: imguremotes.menu.getWidth(width),
        height: imguremotes.menu.getHeight(height)
    };
};

imguremotes.menu.resize = function() {
    if (!imguremotes.menu.open()) return;
    var width = bdPluginStorage.get('imguremotes', 'width');
    var height = bdPluginStorage.get('imguremotes', 'height');
    if (width === null) { imguremotes.menu.setWidth(0); return; }
    if (height === null) { imguremotes.menu.setHeight(0); return; }

    $('#bda-qem-imgur-container').css('width', width);
    $('#bda-qem-imgur-container').css('height', height);

    var qem_height = 30;
    if ((!settingsCookie["bda-es-0"]) && (!settingsCookie["bda-es-9"]))
        qem_height = 0;

    BdApi.clearCSS('imguremotes-offset');
    BdApi.injectCSS('imguremotes-offset', `:root {--bd-les-offset: ${qem_height}px; --bd-les-border-offset:1px; --bd-les-height: ${height}px; --bd-les-width: ${width}px;}`)
    // $('#bda-qem-imgur-container .preview-wrapper').css('height', height + qem_height);
    // $('#bda-qem-imgur-container .preview-wrapper').css('transform', `translateX(-258px) translateY(-${height + qem_height + 1}px) translateZ(0px)`);

    // $('#bda-qem-imgur-container .categories-container').css('width', width - 15);
    // $('#bda-qem-imgur-container .add-form').css('width', width - 45);
    // $('#imgur-add-title').css('width', width - 220);
    // $('#imgur-add-pack').css('width', width - 220);
    // $('#imgur-add-id').css('width', width - 219);
};

// remove sticker pack from current container
imguremotes.menu.removePack = function(id) {
    $(`#bda-qem-imgur-container .imgur-pack[data-id="${id}"]`).remove();
    $(`#bda-qem-imgur-container .categories-container .item[data-id="${id}"]`).remove();
};

imguremotes.menu.appendPack = function(id) {
    if (!imguremotes.menu.open()) return;
    imguremotes.log('Appending a pack to the current container');
    // append the pack to the current container
    var pack = imguremotes.pack.wrapPack(id);
    $('#bda-qem-imgur-container .emote-menu-inner').append(pack);

    // append the pack to navigation bar below
    var pack = imguremotes.storage.getPack(id);
    //var id = pack['id'];
    var position = $('#bda-qem-imgur-container .categories-wrapper .item').length - 1;
    var category = `<div class="item" data-id="${id}" onclick="$('#bda-qem-imgur-container .imgur-pack')[${position}].scrollIntoView()" style='background-image: url("https://i.imgur.com/${id}")'></div>`;
    $('#bda-qem-imgur-container .categories-wrapper').append(category);

    // enable preview on the added pack
    // make stickers copy url on a click
    $(`#bda-qem-imgur-container .imgur-pack[data-id="${id}"] img`)
        .mouseenter(function(e) { imguremotes.preview.show(e.target.src); })
        .mouseleave(function(e) { imguremotes.preview.hide(); })
        .on("click", function() {
            // find out what tab we're dealing with
            if ($(this).parent().parent().attr("class") === 'imgur-pack-stickers') {
                // if dealing with imgur stickers tab, grab src
                var emote = $(this).attr("src");
            } else {
                // otherwise grab title attribute
                var emote = $(this).attr("title");
            }
            var ta = $(".chat form textarea");
            var text = ta.val().slice(-1) == " " ? emote : " " + emote
            ta.focus();
            document.execCommand("insertText", false, text);
        });

    // enable deletion
    $(`#bda-qem-imgur-container .imgur-pack[data-id="${id}"] .icon-plus-cross`).on('click', (event) => {
        var id = $(event.target.parentNode.parentNode.parentNode).attr('data-id');
        $('#bda-qem-imgur-container .confirm .yes').attr(
            'onclick',
            `imguremotes.storage.deletePack(\'${id}\'); alert(); imguremotes.menu.removePack(\'${id}\'); imguremotes.confirm.hide();`);
        imguremotes.confirm.show();
    });

    // enable editing
    $(`#bda-qem-imgur-container .imgur-pack[data-id="${id}"] .icon-edit`).on('click', (event) => {
        var pack = $(event.target.parentNode.parentNode.parentNode);
        if (pack.find('.imgur-pack-header input').length === 0) {
            var bar = $(event.target.parentNode.parentNode);
            var header = pack.find('.imgur-pack-header');
            var value = pack.find('.imgur-pack-header').text();
            header.html(`<input class="imgur-edit-input" value="${value}"></input>`);
            bar.addClass('visible')

            function save(event) {
                var value = $(event.target).val();
                var id = $(event.target.parentNode.parentNode).attr('data-id');
                imguremotes.storage.renamePack(id, value);
                $(event.target.parentNode).html(value);
            }

            header.find('input')
                .on('blur', (event) => {
                    save(event);
                    bar.removeClass('visible');
                })
                .on('keydown', (event) => {
                    if ((event.key === 'Escape') || (event.key ==='Enter')) {
                        event.stopPropagation();
                        event.preventDefault();
                        //save(event);
                        event.target.blur();
                    }
                })
                .focus();
        }
    });
};

imguremotes.menu.open = function() {
    // Check if the imgur tab is currently open and visible
    let container = document.getElementById('bda-qem-imgur-container')
    if (container) {
        let display = container.style.display;
        if (display !== 'none') return true;
    }
    return false
};



imguremotes.prototype.observer = function (mutation) {
    var status = bdPluginStorage.get(imguremotes.storage.getName(), 'hideURLs');
    if (status === null) {
        status = false;
    }
    if (status === true) {
            for (var i = 0; i < mutation.addedNodes.length; ++i) {
            var next = mutation.addedNodes.item(i);
            if (next) {
                var nodes = this.observer.getNodes(next);
                for (var node in nodes) {
                    if (nodes.hasOwnProperty(node)) {
                        var element = nodes[node].parentElement;
                        if (element) {
                            // skip code blocks
                            if (element.tagName !== 'CODE') {
                                if (element.classList.contains('edited')) { 
                                    // if message with a sticker was edited, apply the sticker url hide
                                    this.observer.inject(element); 
                                } else {
                                    // apply the sticker url hide
                                    this.observer.inject(nodes[node]); 
                                }
                                }
                                // if message is being edited, unhide the text
                                if (element.tagName == "TEXTAREA" && element.style.display == "none") {
                                    element.style.display = "";
                            }
                        }
                    }
                }
            }
        }
    }
};

imguremotes.prototype.observer.status = function () {}

imguremotes.prototype.observer.status.set = function(value) {
    if (value === true) {
        bdPluginStorage.set(imguremotes.storage.getName(), 'hideURLs', true)
        this.current = true;
    } else if (value === false) {
        bdPluginStorage.set(imguremotes.storage.getName(), 'hideURLs', false)
        this.current = false;
    } else {
        imguremotes.log('Unknown value passed while setting observer status')
    }
}

imguremotes.prototype.observer.getNodes = function (node) {
    var next;
    var nodes = [];
    var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    while (next = treeWalker.nextNode()) {
        nodes.push(next);
    }
    return nodes;
};
//скрытие ссылки
imguremotes.prototype.observer.inject = function (node) {
    if ((node.textContent.match(/i.imgur.com/g)||[]).length < 1) return
    $(node).parent()[0].style.display = "none";
};

imguremotes.pack = function () {}

imguremotes.pack.getPack = function (id, title, images) {
	imguremotes.log('Get Pack');
    var pack = {
		id: id,
        title: title,
		images: images
    };
    return pack;
};

imguremotes.pack.appendPack = function (id, title, images) {
	imguremotes.log("Appending images: "+images.join(', '));
    var log = imguremotes.log;
    var storage = imguremotes.storage;
    var pack = imguremotes.pack;

    // parsing arguments
    /* if (typeof title     === 'undefined') { throw 'ParsingError: Title is not defined'; }
    if (typeof stickerid === 'undefined') { throw 'ParsingError: Sticker ID is not a defined'; } */
    //if (typeof length    === 'undefined') { length = 1; log(`Length is not explicitly defined, defaulting to ${length}`); }

    /* if (typeof title !== 'string') { throw 'ParsingError: Title is not a string'; }
    if (Number.isInteger(stickerid) === false) {
        if (typeof stickerid === 'string') {
            stickerid = parseInt(stickerid, 10);
            if (isNaN(stickerid)) {
                throw 'ParsingError: First sticker ID is not a number';
            } else {
                log(`First sticker ID passed as a string, parsed as integer ${stickerid}`);
            }
        } else {
            throw 'ParsingError: First sticker ID is not a number nor string';
        }
    }
    if (Number.isInteger(length) === false) {
        if (length === null) {
            length = 40;
            log(`Null length passed, defaulting to ${length}`);
        } else if (typeof length === 'string') {
            length = parseInt(length, 10);
            if (isNaN(length)) {
                throw 'ParsingError: Length is not a number';
            } else {
                log(`Length passed as a string, parsed as integer ${length}`);
            }
        } else {
            throw 'ParsingError: Length is not a number nor string';
        }
    } */

    var stickerpack = pack.getPack(id, title, images);
    if (imguremotes.storage.getPack(id) === null) {
        storage.pushPack(stickerpack);
        imguremotes.menu.rebuild();
        imguremotes.menu.appendPack(id);
    } else {
        log('Pack already exists in storage');
    }
    return true;
};

// alias
imguremotes.appendPack = function (id, title, images) {
    this.pack.appendPack(id, title, images);
};

imguremotes.pack.wrapPack = function (stickerid) {
	imguremotes.log('Wrapping');
    var pack = imguremotes.storage.getPack(stickerid);
	//imguremotes.log(pack);
    if (pack === null) { return ''; }
    var stickers = '';
    for (var i = 0; i < pack.images.length; ++i) {
        stickers += `<div class="emote-container"><img class="emote-icon" src="https://i.imgur.com/`;
		stickers += pack.images[i];
		stickers += `"></div>`;
		//imguremotes.log(i);
	}
    var container = `
<div class="imgur-pack" data-id="${pack.id}">
    <div class="imgur-editbar">
        <span class="item">
            <span class="icon-plus-cross icon-plus"></span>
        </span>
        <span class="item">
            <span class="icon-edit"></span>
        </span>

        <span class="item" style="display: none; text-align: center; width: 30px; vertical-align: middle; imgur-height: 23.5px; color: #d1d1d1;">
            <span class="icon-edit-len">LEN</span>
        </span>
    </div>
    <div class="imgur-pack-header">${pack['title']}</div>
    <div class="imgur-pack-stickers">
        ${stickers}
    </div>
</div>`;
    return container;
};

// bar with buttons to remove pack, edit title and length
// embeded into each pack, code above ^
imguremotes.editbar = function() {}

imguremotes.editbar.init = function () {
    $('#bda-qem-imgur-container .imgur-editbar .icon-edit').off('click');
    $('#bda-qem-imgur-container .imgur-editbar .icon-edit').on('click', (event) => {
        var pack = $(event.target.parentNode.parentNode.parentNode);
        if (pack.find('.imgur-pack-header input').length === 0) {
            var bar = $(event.target.parentNode.parentNode);
            var header = pack.find('.imgur-pack-header');
            var value = pack.find('.imgur-pack-header').text();
            header.html(`<input class="imgur-edit-input" value="${value}"></input>`);
            bar.addClass('visible')

            function save(event) {
                var value = $(event.target).val();
                var id = $(event.target.parentNode.parentNode).attr('data-id');
                imguremotes.storage.renamePack(id, value);
                $(event.target.parentNode).html(value);
            }

            header.find('input')
                .on('blur', (event) => {
                    save(event);
                    bar.removeClass('visible')
                })
                .on('keydown', (event) => {
                    if ((event.key === 'Escape') || (event.key ==='Enter')) {
                        event.stopPropagation();
                        event.preventDefault();
                        //save(event);
                        event.target.blur();
                    }
                })
                .focus();
        }
    });
};

// used to confirm delete action
imguremotes.confirm = function () {}

imguremotes.confirm.buildContainer = function () {
  var localization_strings = imguremotes.prototype.getLocalizationStrings();
  var container = '';
  container += `
<div class="confirm" style="opacity: 0; pointer-events: none;">
    <div class="box">
        <h3 class="value"></h3>
        <h3 style="padding: 10px;">${localization_strings['delete-confirm']}</h3>
        <div>
            <span class="yes">${localization_strings['yes']}</span>
            <span class="no" onclick="imguremotes.confirm.hide();">${localization_strings['no']}</span>
        </div>
    </div>
</div>`;
  return container;
};

imguremotes.confirm.show = function() {
    //$('#bda-qem-imgur-container .confirm').show();
    $('#bda-qem-imgur-container .confirm').css('opacity', '1');
    $('#bda-qem-imgur-container .confirm').css('pointer-events', 'unset');
};

imguremotes.confirm.hide = function() {
    //$('#bda-qem-imgur-container .confirm').hide();
    $('#bda-qem-imgur-container .confirm').css('opacity', '0');
    $('#bda-qem-imgur-container .confirm').css('pointer-events', 'none');
    $('#bda-qem-imgur-container .confirm .yes').attr('onclick', '');
};

imguremotes.confirm.init = function () {
    $('#bda-qem-imgur-container .imgur-editbar .icon-plus-cross').on('click', (event) => {
        var id = $(event.target.parentNode.parentNode.parentNode).attr('data-id');
        $('#bda-qem-imgur-container .confirm .yes').attr(
            'onclick',
            `imguremotes.storage.deletePack(\'${id}\'); imguremotes.menu.removePack(\'${id}\'); imguremotes.confirm.hide();`);
        imguremotes.confirm.show();
    });
};

imguremotes.preview = function() {}

imguremotes.preview.buildContainer = function() {
    var container = '';
    container += `
<div class="preview-container">
    <div class="preview-wrapper" style="visibility: hidden; opacity: 0; background-size: 50%;"></div>
</div>`;
    return container;
}

imguremotes.preview.init = function() {
    $('#bda-qem-imgur-container .emote-menu-inner img')
        .mouseenter(function(e) { imguremotes.preview.show(e.target.src); })
        .mouseleave(function(e) { imguremotes.preview.hide(); });
};

imguremotes.preview.show = function(url) {
    var preview = $('#bda-qem-imgur-container .preview-container .preview-wrapper');
    preview.css('visibility', 'visible');
    preview.css('opacity', '1');
    // preview.css('background', `url("${url}") rgb(53, 53, 53) no-repeat center`);
    preview.css('background-image', `url("${url}")`);
};

imguremotes.preview.hide = function() {
    var preview = $('#bda-qem-imgur-container .preview-container .preview-wrapper');
    preview.css('visibility', 'hidden');
    preview.css('opacity', '0');
};


imguremotes.storage = function () {}

imguremotes.storage.getName = function () { return 'imguremotes' }

imguremotes.storage.get = function () {
    var storage = bdPluginStorage.get(this.getName(), 'stickers');
    if (typeof storage === 'undefined' || storage === null) {
        // if storage is not declared, declare it
        bdPluginStorage.set(this.getName(), 'stickers', []);
        storage = [];
    }
    return storage;
};

imguremotes.storage.set = function(value) {
    bdPluginStorage.set(this.getName(), 'stickers', value);
};

imguremotes.storage.wipe = function () {
    bdPluginStorage.set(this.getName(), 'stickers', []);
    return null
};

imguremotes.storage.pushPack = function (pack) {
    var log = imguremotes.log;
    if (this.getPack(pack['id']) === null) {
        var storage = this.get();
        storage.push(pack);
        this.set(storage);
        log(`Successfully added pack '${pack['title']}' to the storage`);
        return true;
    } else {
        log('Pack is already in storage, aborting');
    }
};

imguremotes.storage.getPack = function(id) {
    var storage = this.get();
    for (var i = 0; i < storage.length; i++) {
	if (storage[i]['id'] == id) {
            return storage[i];
        }
    }
    return null;
};

/*
imguremotes.storage.getPackID = function(id) {
    // look up the pack by one of its sticker IDs or its name
    var log = imguremotes.log;
    var mode;
    
    if (typeof id === 'number') {
        if (Number.isInteger(id) === false) {
            throw 'ParsingError: ID cannot be float';
        } else {
            mode = 'integer';
        }
    } 
    if (typeof id === 'string') {
        mode = 'string';
    }
    
    var storage = this.get();
    if (mode === 'integer') {
        for (var index = 0; index < storage.length; index++) {
            for (var sticker = 0; sticker < storage[index].stickers.length; sticker++) {
                if (storage[index]['stickers'][sticker] === id) {
                    return storage[index];
                }
            }
        }
    }
    if (mode === 'string') {
        for (var index = 0; index < storage.length; index++) {
            if (storage[index]['title'] === id) {
                return storage[index];
            }
        }
    }
    
    return null;
};
*/

imguremotes.storage.deletePack = function(id) {
    var storage = this.get();
    var log = imguremotes.log;
    var pack = id;
    var wasFound = false;
    
    for (var i = 0; i < storage.length; i++) {
	if (storage[i]['id'] == id) {
            wasFound = true;
            pack = `${id} - ${storage[i]['title']}`;
            storage.splice(i, 1);
            this.set(storage);
            imguremotes.menu.rebuild();
            break;
        }
    }
    
    
    if (wasFound) {
        log(`Successfully deleted pack ${pack}`);
        return true;
    } else {
        log(`Pack ${pack} was not found in storage during deletion`);
        return false;
    }
};

imguremotes.storage.swapPack = function(from, to) {
    var storage = this.get();
    var log = imguremotes.log;
    var temp = storage[from];
    
    storage[from] = storage[to];
    storage[to] = temp;
    this.set(storage);
    log(`Successfully swapped packs '${storage[to]['title']}' and '${storage[from]['title']}'`);
    return true;
};

imguremotes.storage.renamePack = function(id, newtitle) {    
    if (this.getPack(id) === null) {
        log(`getPack() returned null, pack ${id} was not found in storage`);
        return;
    } else {
        var storage = imguremotes.storage.get();
        for (var pack = 0; pack < storage.length; ++pack) {
            if (storage[pack]['id'] == id) {
                storage[pack]['title'] = newtitle;
                this.set(storage);
                imguremotes.menu.rebuild();
                break;
            }
        }
    }
}
imguremotes.getStylesheet = function () { 
var stylesheet = `#bda-qem-imgur-container .icon-plus {
  width: 22px;
  height: 22px;
  background-image: url(/assets/99d227db4a23596956637210e624d79b.png);
  background-position: -220px -484px;
  background-size: 924px 682px;
  filter: grayscale(100%);
  margin: 11px 0 0 0; }

#bda-qem-imgur-container .icon-plus-cross {
  display: inherit;
  margin: 0;
  transform: rotate(45deg);
  filter: invert(100%) grayscale(100%); }

#bda-qem-imgur-container .icon-minus {
  width: 22px;
  height: 22px;
  background-image: url(/assets/99d227db4a23596956637210e624d79b.png);
  background-position: -242px -484px;
  background-size: 924px 682px;
  filter: grayscale(100%);
  margin: 11px 0 0 0; }

#bda-qem-imgur-container .icon-edit {
  display: inherit;
  width: inherit;
  height: inherit;
  background-image: url(/assets/99d227db4a23596956637210e624d79b.png);
  background-position: -528px -374px;
  background-size: 924px 682px;
  filter: grayscale(100%);
  transform: rotate(90deg) scale(0.8); }

#bda-qem-imgur-container .icon-triangle {
  width: 22px;
  height: 22px;
  background-image: url(/assets/99d227db4a23596956637210e624d79b.png);
  background-position: -858px -484px;
  background-size: 924px 682px;
  filter: hue-rotate(130deg);
  float: right;
  margin-right: 5px; }

#bda-qem-imgur-container .add-form {
  position: absolute;
  display: flex;
  bottom: 48px;
  width: calc(var(--bd-les-width) - 45px);
  transition: opacity .1s ease-in-out .05s;
  background: inherit;
  padding: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-transform: uppercase; }
  #bda-qem-imgur-container .add-form .labels, #bda-qem-imgur-container .add-form .inputs {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    font-size: 12px;
    imgur-height: 17px; }
    #bda-qem-imgur-container .add-form .labels input::-webkit-input-placeholder, #bda-qem-imgur-container .add-form .inputs input::-webkit-input-placeholder {
      color: rgba(152, 170, 182, 0.5); }
    #bda-qem-imgur-container .add-form .labels input, #bda-qem-imgur-container .add-form .inputs input {
      border-bottom: solid 1px; }
    #bda-qem-imgur-container .add-form .labels #imgur-add-title,
    #bda-qem-imgur-container .add-form .labels #imgur-add-pack,
    #bda-qem-imgur-container .add-form .labels #imgur-add-id, #bda-qem-imgur-container .add-form .inputs #imgur-add-title,
    #bda-qem-imgur-container .add-form .inputs #imgur-add-pack,
    #bda-qem-imgur-container .add-form .inputs #imgur-add-id {
      width: 100%;
      height: 16px; }
  #bda-qem-imgur-container .add-form .inputs {
    flex-grow: 1; }
  #bda-qem-imgur-container .add-form .imgur-add-button {
    top: 1px;
    width: 35px;
    height: auto;
    padding: 0px;
    border-radius: 3px;
    background-color: #98aab6; }
  #bda-qem-imgur-container .add-form .imgur-add-button.invalid:hover {
    background-color: #ad0000 !important; }
  #bda-qem-imgur-container .add-form .imgur-add-button.valid:hover {
    background-color: #15ad00 !important; }

.popout.bda-qme-te-hidden #bda-qem-twitch, .popout.bda-qme-te-hidden #bda-qem-favourite {
  display: none; }

.popout.bda-qme-hidden.bda-qme-te-hidden #bda-qem {
  display: none; }

.popout.bda-qme-hidden.bda-qme-te-hidden #bda-qem-imgur-container {
  border-radius: 5px; }

#bda-qem button {
  box-shadow: #EFEFEF 1px 0 0 0; }

#bda-qem-twitch,
#bda-qem-favourite {
  border-radius: unset; }

#bda-qem-imgur {
  border-radius: 5px 0 0 0; }

.bda-dark .emoji-picker {
  border-color: #2b2b2b; }
  .bda-dark .emoji-picker .search-bar {
    border-radius: 0 4px 4px 0px; }

.bda-dark #bda-qem {
  border-bottom: 1px solid #2b2b2b !important; }
  .bda-dark #bda-qem button {
    box-shadow: #2b2b2b 1px 0 0 0; }

.bda-dark #bda-qem-imgur-container {
  background-color: #353535;
  border-color: #2b2b2b; }
  .bda-dark #bda-qem-imgur-container .scroller::-webkit-scrollbar,
  .bda-dark #bda-qem-imgur-container .scroller::-webkit-scrollbar-track,
  .bda-dark #bda-qem-imgur-container .scroller::-webkit-scrollbar-track-piece {
    background-color: #303030 !important;
    border-color: #303030 !important; }
  .bda-dark #bda-qem-imgur-container .scroller::-webkit-scrollbar-thumb {
    border-color: #202020 !important;
    background-color: #202020 !important; }
  .bda-dark #bda-qem-imgur-container .preview-container .preview-wrapper {
    background-color: #353535;
    border-color: #2b2b2b; }
  .bda-dark #bda-qem-imgur-container .confirm {
    background-color: rgba(35, 35, 35, 0.8); }
  .bda-dark #bda-qem-imgur-container .add-pack {
    opacity: 1; }

.popout.bda-qme-hidden.bda-qme-te-hidden #bda-qem-imgur-container {
  border-top-width: 1px; }

#bda-qem-imgur-container {
  border-radius: 0 0 5px 5px;
  font-weight: 800;
  color: #98aab6;
  background-color: #fff;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-color: rgba(191, 191, 191, 0.2); }
  #bda-qem-imgur-container .scroller-wrap {
    height: 100%; }
  #bda-qem-imgur-container .emote-menu-inner {
    padding: 5px 15px 48px 15px; }
  #bda-qem-imgur-container .imgur-pack-header {
    display: flex;
    color: #98aab6;
    height: 12px;
    font-size: 12px;
    padding: 12px 0 12px 0;
    text-transform: uppercase; }
  #bda-qem-imgur-container .emote-container {
    width: 71px;
    height: 71px; }
  #bda-qem-imgur-container .preview-container .preview-wrapper {
    position: absolute;
    width: 256px;
    height: calc(var(--bd-les-height) + var(--bd-les-offset));
    background-color: #fff;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(191, 191, 191, 0.2);
    border-radius: 5px;
    box-shadow: -10px 0px 80px 0px rgba(0, 0, 0, 0.2);
    transform: translateX(-258px) translateY(calc(0px - var(--bd-les-height) - var(--bd-les-offset) - var(--bd-les-border-offset))) translateZ(0px);
    transition: all .15s ease-in-out .15s; }
  #bda-qem-imgur-container .categories-container {
    position: absolute;
    width: calc(var(--bd-les-width) - 15px);
    bottom: 1px;
    overflow: hidden;
    z-index: 1;
    margin-top: -44px;
    background-color: inherit;
    border-top: 1px solid rgba(0, 0, 0, 0.1); }
    #bda-qem-imgur-container .categories-container .categories-wrapper {
      clear: right;
      overflow: hidden;
      white-space: nowrap; }
      #bda-qem-imgur-container .categories-container .categories-wrapper .item:first-of-type {
        margin-left: 15px;
        margin-right: 0px; }
      #bda-qem-imgur-container .categories-container .categories-wrapper .item:nth-child(2) {
        margin-left: 0px; }
      #bda-qem-imgur-container .categories-container .categories-wrapper .item:hover {
        filter: grayscale(0%); }
      #bda-qem-imgur-container .categories-container .categories-wrapper .item {
        display: inline-block;
        box-sizing: border-box;
        cursor: pointer;
        width: 28px;
        height: 44px;
        margin-right: 4px;
        margin-left: 2.5px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 32px 32px;
        border-bottom: 3px solid transparent;
        filter: grayscale(100%);
        transition: filter .1s ease-in-out; }
  #bda-qem-imgur-container .visible {
    opacity: 1 !important; }
  #bda-qem-imgur-container .imgur-pack input {
    width: 100%; }
  #bda-qem-imgur-container .imgur-pack .imgur-editbar:hover {
    opacity: 1; }
  #bda-qem-imgur-container .imgur-pack .imgur-editbar {
    float: right;
    display: flex;
    padding-top: 7px;
    opacity: 0;
    transition: opacity .1s ease-in-out; }
    #bda-qem-imgur-container .imgur-pack .imgur-editbar .item {
      display: inline-block;
      width: 22px;
      height: 22px;
      opacity: 0.5;
      transition: opacity .1s ease-in-out .05s; }
    #bda-qem-imgur-container .imgur-pack .imgur-editbar .item:hover {
      opacity: 1; }
  #bda-qem-imgur-container input:focus {
    box-shadow: 0px 2px 0px 0px;
    outimgur: none; }
  #bda-qem-imgur-container input {
    color: #98aab6;
    background-color: inherit;
    border: none;
    margin: 0;
    height: 12px;
    padding: 0px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase; }
  #bda-qem-imgur-container .box {
    width: 100%;
    color: #98aab6;
    text-align: center;
    transform: translateY(250%); }
  #bda-qem-imgur-container .confirm {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    transition: opacity .1s ease-in-out .05s;
    z-index: 10; }
    #bda-qem-imgur-container .confirm .yes, #bda-qem-imgur-container .confirm .no {
      padding: 10px;
      text-transform: uppercase;
      cursor: pointer;
      color: rgba(152, 170, 182, 0.8);
      transition: color .1s ease-in-out .05s; }
    #bda-qem-imgur-container .confirm .yes:hover {
      color: #ad0000; }
    #bda-qem-imgur-container .confirm .no:hover {
      color: #98aab6; }
  #bda-qem-imgur-container .categories-container .categories-wrapper .item.add-pack-button {
    filter: unset; }
  #bda-qem-imgur-container .add-pack-button {
    position: relative;
    width: 20px;
    height: 20px;
    margin-right: 5px; }
  #bda-qem-imgur-container .add-pack-button > svg {
    position: absolute;
    top: 13px; }
  #bda-qem-imgur-container .add-pack-button > svg > path {
    opacity: 0.5;
    fill: #8c8c8c; }
  #bda-qem-imgur-container .add-pack-button > svg > path:hover {
    opacity: 1; }
` 
return "<style>" + stylesheet + "</style>"; 
};
imguremotes.prototype.getVersion = () => "2.2.8";