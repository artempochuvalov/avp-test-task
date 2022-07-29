async function getLocationData() {
    const response = await fetch('../json/location.json');
    const json = await response.json();
    return json;
}


async function getTemperaturesData() {
    const response = await fetch('../json/temperatures.json');
    const json = await response.json();
    return json;
}


async function getLocoData() {
    const [locations, temperatures] = await Promise.all([getLocationData(), getTemperaturesData()]);
    const {LocoType, LocoNumber} = locations;
    const points = fetchPoints(locations, temperatures);
    
    return {
        LocoType,
        LocoNumber,
        points
    }
}


function fetchPoints(locations, temperatures) {
    const points = locations.Latitude.map((lat, index) => {
        const coords = [lat, locations.Longitude[index]];
        const locationTime = new Date(locations.Timestamp[index]);
        
        // определяем разницы между времени для температур и времени, 
        // когда локомотив был в точке
        const timeDiffs = temperatures.Timestamp.map(
            (temperatureTime) => Math.abs(new Date(temperatureTime) - locationTime)
        )
        // определяем температуру по минимальной разнице во времени
        const temperature = temperatures.OutsideTemp[
            timeDiffs.findIndex((timeDiff) => timeDiff === Math.min(... timeDiffs))
        ];

        return {
            coords,
            locationTime,
            temperature
        }
    });

    return points;
}
