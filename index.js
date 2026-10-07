const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");

const Restaurant = require("./models/restaurant.models");

app.use(express.json());

initializeDatabase();

async function createRestaurant(newRestaurant) {
    try {
        const restaurant = new Restaurant(newRestaurant);
        const saveRestaurant = await restaurant.save();
        return saveRestaurant;
    } catch (error) {
        throw error;
    }
};

app.post("/restaurants", async(req, res) => {
    try {
        
        const savedRestaurant = await createRestaurant(req.body);
        res.status(201).json({message: "Restaurant added successfully.", restaurant: savedRestaurant})
    } catch (error) {
          console.log(error);
        res.status(500).json({error: "Failed to add restaurant", message: error.message})
    }
});


//to get all restaurants from the database.
async function getAllRestaurant() {
    try {
        const allRestaurants = await Restaurant.find();
        return allRestaurants;
    } catch (error) {
        throw error
    }
}

//1. Create an API with route "/restaurants" to read all restaurants from the Database. Test your API with Postman.
app.get("/restaurants", async (req, res) => {
    try {
        const restaurants = await getAllRestaurant();
        if(restaurants.length != 0) {
            res.json(restaurants);
        } else {
            res.status(404).json({ message: "No restaurants found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
});


async function readRestaurantByName(restaurantName) {
    try {
        const restaurant = await Restaurant.findOne({name: restaurantName});
        return restaurant;
    } catch (error) {
        throw error
    }
}

// 2. Create an API with route "/restaurants/:restaurantName" to read a restaurant by its name. Test your API with Postman.
app.get("/restaurants/:restaurantName", async (req, res) => {
    try {
    const restaurants = await readRestaurantByName(req.params.restaurantName);

    if(restaurants) {
        res.json(restaurants);
    } else {
        res.status(404).json({ message: "Restaurant not found" });
    }
} catch (error) {
    res.status(500).json({ message: "Error fetching restaurant", error });
}
});


async function findRestaurantByPhone(number) {
    try {
        const restaurantByPhone = await Restaurant.findOne({phoneNumber: number})
        return restaurantByPhone;
    } catch (error) {
        console.log("Error finding restaurant", error)
    }
}

// 3. Create an API with route "/restaurants/directory/:phoneNumber" to read a restaurant by phone number. Test your API with Postman.
app.get("/restaurants/directory/:phoneNumber", async (req, res) => {
    try {
        const restaurant = await findRestaurantByPhone(req.params.phoneNumber);

        if(restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: "Restaurant not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurant", error });
    }
});


async function readRestaurantByCuisine(cuisine) {
    try {
        const restaurantByCuisine = await Restaurant.find({cuisine: cuisine})
        return restaurantByCuisine;
    } catch (error) {
        throw error
    }
}

// 4. Create an API with route "/restaurants/cuisine/:cuisineName" to read all restaurants by cuisine. Test your API with Postman.
app.get("/restaurants/cuisine/:cuisineName", async (req, res) => {
    try {
        const restaurants = await readRestaurantByCuisine(req.params.cuisineName);  
        if(restaurants.length != 0) {
            res.json(restaurants);
        } else {
            res.status(404).json({ message: "No restaurants found for this cuisine" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
});

// 5. Create an API with route "/restaurants/location/:restaurantLocation" to read all restaurants by location. Test your API with Postman.
async function readRestaurantByLocation(location) {
    try {
        const restaurantByLocation = await Restaurant.find({location: location})
        return restaurantByLocation;
    } catch (error) {
        throw error
    }
}

// 5. Create an API with route "/restaurants/location/:restaurantLocation" to read all restaurants by location. Test your API with Postman.
app.get("/restaurants/location/:restaurantLocation", async (req, res) => {
    try {
        const restaurants = await readRestaurantByLocation(req.params.restaurantLocation);
        if(restaurants.length != 0) {
            res.json(restaurants);
        } else {
            res.status(404).json({ message: "No restaurants found for this location" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error });
    }
});

// 1. Create an API with route "/restaurants/:restaurantId" to delete a restaurant data by their ID in the Database. Test your API with Postman.
async function deleteRestaurant(restaurantId) {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);
        return deletedRestaurant;
    } catch (error) {
        console.log(error);
    }
}

app.delete("/restaurants/:restaurantId", async(req, res) => {
    try {
        const deletedRestaurant = await deleteRestaurant(req.params.restaurantId);

        if(deletedRestaurant) {
            res.status(200).json({message: "Restaurant deleted successfully."})
        }
        
    } catch (error) {
        res.status(500).json({error: "Failed to delete Restaurants"})
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});



