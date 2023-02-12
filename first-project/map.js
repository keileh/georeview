export default class interactiveMap {
    constructor(mapID, onClick) {
        this.mapID = mapID;
        this.onClick = onClick;
    }

    async init() {
        await this.injectYMapScript();
        await this.loadYMap();
        this.initMap();
    }
    
    injectYMapScript() {
        return new Promise((resolve) => {
            const myMap = document.createElement('script');
            myMap.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
            document.body.appendChild(myMap);
            myMap.addEventListener('load', resolve);
        })
    }

    loadYMap() {
        return new Promise((resolve) => ymaps.ready(resolve))
    }

    initMap() {
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false,
        });
        this.clusterer.events.add('click', e => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.map = new ymaps.Map(this.mapID, {
            center: [55.76, 37.64],
            zoom: 7
        });
        this.map.events.add('click', e => {this.onClick(e.get('coords'))});
        this.map.geoObjects.add(this.clusterer);
    }

    openBalloon(coords, content) {
        this.map.ballon.open(coords, content);
    }

    setBalloon(content) {
        this.map.balloon.setData(content);
    }

    closeBalloon() {
        this.map.balloon.close();
    }

    createPlacemark(coords) {
        const placemark = new ymaps.Placemark(coords);
        placemark.events.add('click', e => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.clusterer.add(placemark);
    }
}


// const init () => {
//     myMap = new ymaps.Map("map", {
//         center: [55.76, 37.64],
//         zoom: 7
//     });

//     myMap.events.add('click', e => {  
//         var balloon = new ymaps.Balloon(myMap);
    
//         myMap.balloon.open(e.get('coords'));
//     })
// }

// ymaps.ready(init);