const express = require("express");
var http = require("http");
var fs = require("fs");
var path = require("path");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

routes.post("/", (req, res) => {
  var inputServiceEmail = "myhpicalender@myhpi-405813.iam.gserviceaccount.com"; //use your service account's email
  var inputScope = ["https://www.googleapis.com/auth/calendar.events"]; //use your scopes here
  var inputKeyFile = path.join(__dirname, "myhpi.pem"); //you'll need to download a P12 key and convert to pem using this website https://www.sslshopper.com/ssl-converter.html

  const GOOGLE_OAUTH2_URL = "https://oauth2.googleapis.com/token";

  const options = {
    // use the email address of the service account, as seen in the API console
    email: inputServiceEmail,
    // use the PEM file we generated from the downloaded key
    keyFile: inputKeyFile,
    // specify the scopes you which to access
    scopes: inputScope,
  };

  function getToken(options) {
    var iat = Math.floor(new Date().getTime() / 1000);
    var exp = iat + Math.floor((options.expiration || 60 * 60 * 1000) / 1000);

    var claims = {
      iss: options.email,
      scope: options.scopes.join(" "),
      aud: GOOGLE_OAUTH2_URL,
      exp: exp,
      iat: iat,
    };

    if (options.delegationEmail) {
      claims.sub = options.delegationEmail;
    }

    var JWT_header = new Buffer(
      JSON.stringify({ alg: "RS256", typ: "JWT" })
    ).toString("base64");
    var JWT_claimset = new Buffer(JSON.stringify(claims)).toString("base64");
    var unsignedJWT = [JWT_header, JWT_claimset].join(".");

    return unsignedJWT; //returns an unsigned JWT
  }

  //Generate an unsigned token
  var unsignedToken = getToken(options);

  //Generate a signed token
  function signToken(options, unsignedJWT) {
    var fs = require("fs");
    var crypto = require("crypto");

    var key = fs.readFileSync(options.keyFile);

    var JWT_signature = crypto
      .createSign("RSA-SHA256")
      .update(unsignedJWT)
      .sign(key, "base64");
    var signedJWT = [unsignedJWT, JWT_signature].join(".");
    return signedJWT;
  }

  var signedToken = signToken(options, unsignedToken);

  res.json(signedToken);
});

module.exports = routes;
