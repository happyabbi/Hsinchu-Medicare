const getGoogleMapImage = (lat, lon, zoom = 16, size = '453x300') => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${zoom}&size=${size}&language=zh-tw&markers=${lat},${lon}`
}

module.exports = { getGoogleMapImage };