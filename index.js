const express = require('express');
const axios = require('axios');

const cheerio = require("cheerio")

const app = express();

app.use(express.json());

async function getSiteData(){
    await axios("https://www.octaveclothing.com/men").then((response) => {
        const html_data = response.data;
        console.log(html_data);
        const $ = cheerio.load(html_data);
    })
}

getSiteData();

async function cryptopriceScraper() {
    const url = "https://www.octaveclothing.com/men";
    const result = [];
    await axios(url).then((response) => {
      const html_data = response.data;
      const $ = cheerio.load(html_data);
      
      const keys = ["Title","Description","Price"];
      const selectedElem = ".views-infinite-scroll-content-wrapper > .row > .col-6 > .product-7 > .product-body"
      
      $(selectedElem).each((parentIndex, parentElem) => {
        let keyIndex = 0;
        const data = {};
        if (parentIndex) {
          $(parentElem)
          .children()
          .each((childId, childElem) => {
            const value = $(childElem).text();
              if (value) {
                data[keys[keyIndex]] = value;
                keyIndex++;
              }
            });
          result.push(data);
        }
      });
    });
    return result;
  }
  
  app.get("/data-scrapper", async (req, res) => {
    try {
      const data = await cryptopriceScraper();
      return res.status(200).json({
        result: data,
      });
    } catch (err) {
      return res.status(500).json({
        err: err.toString(),
      });
    }
});

app.get('/', (req, res) => {
    res.status(200).send("Welcome");
})

app.listen(5000, () => {
    console.log("Server started at port 5000");
})