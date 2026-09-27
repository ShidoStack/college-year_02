const fs = require("fs");
const path = require("path");

const visitsFile = path.join(__dirname, "..", "visits.json");

function visitCounter(req, res, next) {
    try {
        const data = fs.readFileSync(visitsFile, "utf8");

        const visits = JSON.parse(data);

        visits.totalVisits += 1;

        if (visits.routes[req.path]) {
            visits.routes[req.path] += 1;
        } else {
            visits.routes[req.path] = 1;
        }

        fs.writeFileSync(
            visitsFile,
            JSON.stringify(visits, null, 2)
        );

        next();

    } catch (error) {
        console.error("Error updating visit count:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update visit count"
        });
    }
}

module.exports = visitCounter;