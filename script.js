let hotelsData = [];
fetch("Hotelss.json")
    .then(response => response.json())
    .then(data => {
        hotelsData = data.value;
        populateCitySearchOptions()
        populateHotelNameSearchOptions()
        populateCountrySearchOptions()
        displayAllHotels()
    })
    .catch(error => console.error("Error fetching hotels data:", error));
function createHotelCard(hotel, totalCost) {
    const hotelCard = document.createElement("div");
    hotelCard.classList.add("hotel-card");
    const hotelName = document.createElement("h3");
    hotelName.innerHTML = hotel.hotel_name;
    hotelCard.appendChild(hotelName);
    const address = document.createElement("p");
    address.innerHTML = "Address: " + hotel.addressline1;
    hotelCard.appendChild(address);
    const city = document.createElement("p");
    city.innerHTML = "City: " + hotel.city;
    hotelCard.appendChild(city);
    const state = document.createElement("p");
    state.innerHTML = "State: " + hotel.state;
    hotelCard.appendChild(state);
    const country = document.createElement("p");
    country.innerHTML = "Country: " + hotel.country;
    hotelCard.appendChild(country);
    const starRating = document.createElement("p");
    starRating.classList.add("star-rating");
    starRating.textContent = getStarRating(hotel.star_rating);
    hotelCard.appendChild(starRating);
    const photosContainer = document.createElement("div");
    photosContainer.classList.add("photos-container");
    const photos = [hotel.photo1, hotel.photo2, hotel.photo3, hotel.photo4, hotel.photo5];
    for (const photo of photos) {
        const img = document.createElement("img");
        img.src = photo;
        photosContainer.appendChild(img);
    }
    hotelCard.appendChild(photosContainer);
    const overview = document.createElement("p");
    overview.innerHTML = hotel.overview;
    hotelCard.appendChild(overview);
    const numberOfReviews = document.createElement("p");
    numberOfReviews.innerHTML = "Number of Reviews: " + hotel.number_of_reviews;
    hotelCard.appendChild(numberOfReviews);
    const ratingAverage = document.createElement("p");
    ratingAverage.innerHTML = "Price per night: " + hotel.rating_average * 10;
    hotelCard.appendChild(ratingAverage);
    const ratesCurrency = document.createElement("p");
    ratesCurrency.innerHTML = "Currency: " + hotel.rates_currency;
    hotelCard.appendChild(ratesCurrency);
    if (!isNaN(totalCost)) {
        const totalCostParagraph = document.createElement("p");
        totalCostParagraph.textContent = "Total Cost: $" + totalCost.toFixed(2);
        totalCostParagraph.classList.add("total-cost");
        hotelCard.appendChild(totalCostParagraph);
    } else {
        const totalCostParagraph = document.createElement("p");
        totalCostParagraph.textContent = "Please Enter The Arrival And Departure To Calculate The Cost";
        totalCostParagraph.classList.add("total-cost");
        hotelCard.appendChild(totalCostParagraph);
    }
    const locationContainer = document.createElement("div");
    locationContainer.classList.add("location");
    locationContainer.innerHTML = `Location: ${hotel.latitude}, ${hotel.longitude}`;
    hotelCard.appendChild(locationContainer);
    const addToCart = document.createElement("button")
    addToCart.setAttribute("class", "add-to-cart")
    addToCart.innerHTML = "ADD TO FAVOURITE"
    hotelCard.appendChild(addToCart);
    displayMap(locationContainer, hotel.latitude, hotel.longitude);
    return hotelCard;
}
function displayMap(locationContainer, latitude, longitude) {
    const map = new google.maps.Map(locationContainer, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
    });
    const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: "Hotel Location",
    });
}
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars == 0.5;
    if (5 - fullStars == 1 || 2 || 3 || 4 || 5) {
        var emptyStars = 5 - fullStars
    } else {
        emptyStars = 0
    }
    let stars = "";
    for (let i = 0; i < fullStars; i++) {
        stars += "★";
    }
    if (halfStar) {
        stars += "½";
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += "☆";
    }
    return stars;
}
function displayAllHotels() {
    const hotelCardsContainer = document.getElementById("hotel-cards-container");
    for (const hotel of hotelsData) {
        const hotelCard = createHotelCard(hotel);
        hotelCardsContainer.appendChild(hotelCard);
    }
}
function populateCitySearchOptions() {
    const datalist = document.getElementById("hotel-names");
    const citySet = new Set();
    hotelsData.forEach(hotel => {
        citySet.add(hotel.city);
    });
    citySet.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        datalist.appendChild(option);
    });
}
function populateHotelNameSearchOptions() {
    const datalist = document.getElementById("hotel-nameee");
    const nameSet = new Set();
    hotelsData.forEach(hotel => {
        nameSet.add(hotel.hotel_name);
    });
    nameSet.forEach(hotel_name => {
        const option = document.createElement("option");
        option.value = hotel_name;
        datalist.appendChild(option);
    });
}
function populateCountrySearchOptions() {
    const datalist = document.getElementById("country");
    const countrySet = new Set();
    hotelsData.forEach(hotel => {
        countrySet.add(hotel.country);
    });
    countrySet.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        datalist.appendChild(option);
    });
}
function calculateNights(arrivalDate, departureDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((arrivalDate - departureDate) / oneDay));
}
function filterRooms() {
    const selectedCity = document.getElementById("city-search").value.toLowerCase();
    const arrivalDate = new Date(document.getElementById("arrival-date").value);
    const departureDate = new Date(document.getElementById("departure-date").value);
    const numberOfAdults = parseInt(document.getElementById("adults").value);
    const numberOfChildren = parseInt(document.getElementById("children").value);
    const hotelCardsContainer = document.getElementById("hotel-cards-container");
    hotelCardsContainer.innerHTML = "";
    for (const hotel of hotelsData) {
        if (hotel.city.toLowerCase() === selectedCity) {
            const nights = calculateNights(arrivalDate, departureDate);
            const totalCost = nights * hotel.rating_average * (numberOfAdults + numberOfChildren) / 2;
            const hotelCard = createHotelCard(hotel, totalCost);
            hotelCardsContainer.appendChild(hotelCard);
        }
    }
}
function filterHotels() {
    const filterName = document.getElementById("hotelName").value.toLowerCase();
    const filterCity = document.getElementById("city-search").value.toLowerCase();
    const filterCountry = document.getElementById("filter-country").value.toLowerCase();
    const filterStarRating = document.getElementById("filter-star-rating").value;
    const filterNumReviews = document.getElementById("filter-num-reviews").value;
    const filterRatingAverage = document.getElementById("filter-rating-average").value;
    const hotelCardsContainer = document.getElementById("hotel-cards-container");
    hotelCardsContainer.innerHTML = "";
    for (const hotel of hotelsData) {
        const hotelName = hotel.hotel_name.toLowerCase();
        const hotelCity = hotel.city.toLowerCase();
        const hotelCountry = hotel.country.toLowerCase();
        const hotelStarRating = hotel.star_rating;
        const hotelNumReviews = hotel.number_of_reviews;
        const hotelRatingAverage = hotel.rating_average;
        const hotelRatesCurrency = hotel.rates_currency.toLowerCase();
        if ((filterName === "" || hotelName.includes(filterName)) &&
            (filterCity === "" || hotelCity.includes(filterCity)) &&
            (filterCountry === "" || hotelCountry.includes(filterCountry)) &&
            (filterStarRating === "" || hotelStarRating >= filterStarRating) &&
            (filterNumReviews === "" || hotelNumReviews >= filterNumReviews) &&
            (filterRatingAverage === "" || hotelRatingAverage >= filterRatingAverage)
        ) {
            const hotelCard = createHotelCard(hotel);
            hotelCardsContainer.appendChild(hotelCard);
        }
    }
}
document.getElementById("book-now-button").addEventListener("click", filterRooms);
document.getElementById("filter-button").addEventListener("click", filterHotels);
