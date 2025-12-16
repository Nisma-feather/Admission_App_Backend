const Location = require("../models/Location");

const getSearchLocation = async (req, res) => {
  try {
    const { search } = req.query;

    const resultLocation = await Location.find({
      city: { $regex:   `^${search}`, $options: "i" },
    }).select("city district ");

    const formattedResult = resultLocation
      .map((loc) => {
        // district case
        if (loc.city === loc.district) {
          return {
            type: "district",
            label: loc.district,
            id:loc._id
          };
        }

        // city case
        if (loc.city && loc.city.toLowerCase().includes(search.toLowerCase())) {
          return {
            type: "city",
            label: `${loc.city}, ${loc.district}`,
            id: loc._id,
          };
        }

        return null; // important
      })
      .filter(Boolean); // removes null values

    return res.status(200).json({ result: formattedResult });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "can't able to get the location",
    });
  }
};


module.exports= {getSearchLocation}