require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");


const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json)
app.use(cors({origin: true, credentials: true}))

const stripe = require("stripe")(process.env.API_KEY)

app.post("/checkout", async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: req.body.items.map((item) => ({
                price_data: {
                    currency: "usd", 
                    product_data: {
                        name: item.name, 
                        images: [item.product]
                    }, 
                    unit_amount: item.price * 100,
                }, 
                quanitity: item.quanitity,
            })), 
            mode:"payment",
            success_url: "http://localhost:4242/success.html", 
            cancel_url: "http://localhost:4242/cancel.html", 
        })
        res.status(200).json
    } catch (err) {
        next(err);
    }
});

app.listen(4242, () => console.log('app is running on 4242'))