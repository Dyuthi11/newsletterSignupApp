const mailchimp = require("@mailchimp/mailchimp_marketing");    //Requiring mailchimp's module
const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));  //The public folder which holds the static files, ie, imgs and css


app.get("/", function (req, res) {  //Sending the signup.html file to the browser as soon as a request is made on localhost:3000
    res.sendFile(__dirname + "/signup.html");
});


mailchimp.setConfig({   //Setting up MailChimp

    apiKey: "fc24d113feab9d2626b516bc1ea5c140-us17",
    server: "us17"
});


app.post("/", function (req,res) {  //POST request handling
    
    const firstName = req.body.fName;
    const secondName = req.body.lName;
    const email = req.body.emailID;

    const listId = "1ab6ba0280";    //My listID
    
    const subscribingUser = {   //Creating an object with the users data
        firstName: firstName,
        lastName: secondName,
        email: email
    };

    async function run() {      //Uploading the data to the server
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        res.sendFile(__dirname + "/success.html");
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${
                response.id
            }.`
        );  //If all goes well logging the contact's id
    }
    //Running the function and catching the errors (if any)
    // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});


app.listen(process.env.PORT || 3000,function () {
    console.log("Server is running at port 3000");
});


// fc24d113feab9d2626b516bc1ea5c140-us17

// 1ab6ba0280