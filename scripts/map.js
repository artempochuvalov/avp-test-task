ymaps.ready(init);

async function init() {
    const { LocoNumber, LocoType, points } = await getLocoData();

    const map = new ymaps.Map("map", {
        center: points[0].coords || [59.0759, 37.5359],
        zoom: 15,
        controls: []
    });

    const legend = new ymaps.control.Button({
        options: {
            layout: ymaps.templateLayoutFactory.createClass(`
                <div class="legend">
                    <h2 class="legend__title">Локомотив</h2>
                    <p class="legend__descr">Тип: <span>${LocoNumber}</span></p>
                    <p class="legend__descr">Тип: <span>${LocoType}</span></p>
                </div>
            `),
            selectOnClick: false,
            maxWidth: 300,
            maxHeight: 100,
        }
    });

    const placeMarks = points.map((point) => new ymaps.Placemark(point.coords, {
        balloonContent: `Температура: ${point.temperature}`,
    }, {
        visible: false,
        preset: 'islands#glyphCircleIcon',
        balloonCloseButton: false
    }
    ))
    const placemarksCollection = ymaps.geoQuery(placeMarks).addToMap(map);

    const polyline = new ymaps.Polyline(
        points.map((point) => point.coords), null, {
        strokeWidth: 3,
        strokeColor: '#0000FF',
    });
    
    polyline.events.add('mouseenter', (evt) => {
        placemarksCollection.each(point => {
            point.options.set({ visible: false, });
        });
        const closestPoint = placemarksCollection.getClosestTo(evt.get('coords'));
        closestPoint.options.set({
            visible: true,
        });
        closestPoint.balloon.open();
    });

    map.geoObjects.add(polyline);
    map.controls.add(legend);
}