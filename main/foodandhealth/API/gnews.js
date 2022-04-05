const BASE_URL = "https://gnews.io/api/v4";
const key = "174a587f17d51b8b3cb68fb660be2a23";

const search = async (http,) => {
    const config = {
        method: "get",
        url : `${BASE_URL}/search?q="food AND healthy"&token=${key}`
    };
    return http(config).then((res) => res.data);
};