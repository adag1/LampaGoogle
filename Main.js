(function(plugin) {
    const COLLECTION_URL = 'https://www.google.com/collections/s/list/XusmdGiUZ_bHxS9vB1En-IgzwDQoJQ/dxI7ANbJwms';

    plugin.create = function() {
        // Добавляем вкладку "Коллекция Google"
        Lampa.Component.add('google_collection', {
            name: 'Коллекция Google',
            type: 'category',
            body: function(body, head) {
                head.empty().append('<div class="layer--title">Коллекция Google</div>');
                body.empty().append('<div class="layer--content"><div class="empty__text">Загрузка...</div></div>');

                // Загрузка данных
                plugin.loadCollection((items) => {
                    if (items.length) {
                        body.empty();
                        items.forEach((item) => {
                            let card = Lampa.Template.get('card', {
                                title: item.title,
                                poster: item.poster
                            });
                            card.on('hover:enter', () => {
                                Lampa.Player.play(item.url); // Запуск фильма
                            });
                            body.append(card);
                        });
                    } else {
                        body.find('.empty__text').text('Коллекция пуста.');
                    }
                });
            }
        });

        // Добавляем пункт в меню
        Lampa.Settings.add({
            title: 'Коллекция Google',
            icon: 'bookmarks',
            onSelect: () => {
                Lampa.Activity.push({
                    url: '',
                    component: 'google_collection',
                    type: 'category'
                });
            }
        });
    };

    // Функция для загрузки коллекции
    plugin.loadCollection = function(callback) {
        fetch(COLLECTION_URL)
            .then((response) => response.text())
            .then((html) => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                
                // Парсим фильмы (находим нужные элементы)
                let items = [];
                let movieElements = doc.querySelectorAll('.collection-item'); // Убедитесь в правильности класса
                movieElements.forEach((el) => {
                    let title = el.querySelector('.title').innerText;
                    let poster = el.querySelector('img').src;
                    let url = el.querySelector('a').href;
                    items.push({ title, poster, url });
                });

                callback(items);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке коллекции:', error);
                callback([]);
            });
    };

    plugin.start = function() {
        plugin.create();
    };

    plugin.stop = function() {};

    plugin.start();
})(this);
