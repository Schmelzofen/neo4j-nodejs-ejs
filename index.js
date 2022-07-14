const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// neo4j-driver
const neo4j = require("neo4j-driver");
// construct a driver
// one driver is enough for one db application
const driver = neo4j.driver(
    "neo4j://localhost",
    neo4j.auth.basic("admin", "12345")
)
// start a session to gain access to the db
const session = driver.session({ defaultAccessMode: neo4j.session.READ })
// when you're done, close the driver
// await driver.close()

// the function speaks for itself
const getNodesByCypher = async function (cypher) {
    return session.run(cypher)
}

// "result" comes from getNodes (promise)
// console.log(result.records[0]._fields)

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("pages/index")
})

app.get("/search", (req, res) => {
    res.render("pages/search")
})

app.get("/database", (req, res) => {
    res.render("pages/database")
})



// routes for raw db data
// - movies
app.get("/data/movies", (req, res) => {
    getNodesByCypher("Match(n:Movie) return n")
        .then((result) => {
            res.json(result.records)
        })
})
// - actors
app.get("/data/actors", (req, res) => {
    getNodesByCypher("Match(n:Person) return n")
        .then((result) => {
            res.json(result.records)
        })
})

// route for accepting the querry for the search
app.post("/data/querry", (req, res) => {
    console.log(req.body)
    if (req.body.property == "Person") {
        getNodesByCypher(`MATCH (n:Person) WHERE n.name CONTAINS "${req.body.query}" RETURN n`)
            .then((result) => {
                console.log(result.records)
            })
    } else {
        getNodesByCypher(`MATCH (n:Movie) WHERE n.title CONTAINS "${req.body.query}" RETURN n`)
            .then((result) => {
                console.log(result.records)
            })
    }
})



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})