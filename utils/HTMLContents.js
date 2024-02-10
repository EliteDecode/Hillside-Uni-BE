const idCardContent = (singleStaff) => {
  const img =
    "https://www.shutterstock.com/image-photo/portrait-caucasian-woman-no-expression-600nw-1628810149.jpg";
  const leaf = "http://localhost:5000/hust/api/v1/uploads/IDcardUtils/leaf.png";
  const logo = "http://localhost:5000/hust/api/v1/uploads/IDcardUtils/logo.png";
  const faintLogo =
    "http://localhost:5000/hust/api/v1/uploads/IDcardUtils/faintLogo.png";
  const qrcode =
    "http://localhost:5000/hust/api/v1/uploads/IDcardUtils/qrcode.png";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ID Card</title>
        <style>
        .rotate {
          -webkit-transform: rotate(-270deg);
          -moz-transform: rotate(-270deg);
          -ms-transform: rotate(-270deg);
          -o-transform: rotate(-270deg);
          right: -83px;
          margin-top: -10px;
          position: absolute;
          text-align: center;
          top: 50%;
          width: 208px;
          color: #fff;
          font-weight: bold;
          z-index: 9999;
      }
      
      .idcard {
          border: 1px solid gray;
          width: 273px;
          height: 470px;
          position: relative;
      }
      
      .faintLogo {
          position: absolute;
          width: 273px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 470px;
      }
      
      .front {
          position: relative;
      }
      
      .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5% 3%;
          background-color: #5e0001;
      }
      
      .logo {
          width: 20%;
          background-color: #fff;
          padding: 1%;
          border-radius: 5px;
      }
      
      .logo img {
          margin-top: -2%;
      }
      
      .text {
          width: 75%;
          color: #f7f7f7;
      }
      
      .text h1 {
          font-size: 13px;
          font-weight: bold;
      }
      
      .text h6 {
          font-size: 11px;
          font-weight: 400;
          margin-top: -14%;
      }
      
      .middle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -15%;
      }
      
      .img {
          padding: 3%;
      }
      
      .img img {
          width: 110px;
          height: 120px;
          border: 2px solid #5e0001;
      }
      
      .staff {
          border: 1px solid #5e0002ae;
          padding: 2.5% 0%;
          background-color: #5e0002ae;
          width: 90px;
          display: grid;
          place-items: center;
      }
      
      .staff p {
          color: #fff;
          font-weight: bold;
      }
      
      .details {
          display: flex;
          justify-content: space-between;
          align-items: center;
      }
      
      .left-details {
          position: relative;
          background-color: #5e0001;
          height: 239px;
          width: 40px;
      }
      
      .left-details img {
          position: absolute;
          bottom: 0;
          right: 40px;
      }
      
      .right-details {
          padding: 3%;
          width: 80%;
          position: relative;
      }
      
      .names,
      .namess {
          margin-bottom: 7%;
      }
      
      .row-names {
          display: flex;
          margin-top: -14%;
          align-items: center;
      }
      
      .names h5,
      .namess h5 {
          font-size: 11px;
          font-weight: normal;
          color: #5e0001;
      }
      
      .names h6 {
          margin-top: -18%;
          font-size: 12px;
          font-weight: bold;
      }
      
      .namess h6 {
          margin-top: -7%;
          font-size: 12px;
          font-weight: bold;
      }
      
      .sign {
          position: absolute;
          bottom: -49px;
      }
      
      .sign h5 {
          font-size: 10px;
          color: #5e0001;
      }
      
      .surname {
          margin-right: 10%;
      }
  </style>
      </head>
      <body>
        <div class="idcard">
          <div class="faintLogo">
            <img src="${faintLogo}" alt="">
          </div>
          <div class="front">
            <div class="header">
              <div class="logo">
                <img src="${logo}" alt="">
              </div>
              <div class="text">
                <h1>HILLSIDE UNIVERSITY OF SCIENCE & TECHNOLOGY</h1>
                <h6>Oke-Mesi, Ekiti, Nigeria.</h6>
              </div>
            </div>
            <div class="middle">
              <div class="img">
                <img src="${img}" alt="" />
              </div>
              <div class="staff">
                <p>STAFF</p>
              </div>
            </div>
            <div class="details">
              <div class="right-details">
                <div class="row-names">
                  <div class="names surname">
                    <h5>SURNAME</h5>
                    <h6>${singleStaff?.lastname}</h6>
                  </div>
                  <div class="names">
                    <h5>OTHER NAMES</h5>
                    <h6>${singleStaff.firstname}</h6>
                  </div>
                </div>
                <div class="namess">
                  <h5>ID NUMBER</h5>
                  <h6>${singleStaff?.staffId}</h6>
                </div>
                <div class="namess">
                  <h5>ISSUED DATE</h5>
                  <h6>${singleStaff?.createdAt}</h6>
                </div>
                <div class="namess">
                  <h5>BLOOD GROUP</h5>
                  <h6>${singleStaff?.bloodGroup}</h6>
                </div>
                <div class="sign">
                  <h6>.......................</h6>
                  <h5>Staff Signature</h5>
                </div>
              </div>
              <div class="left-details">
                <span class="rotate">
                  ${singleStaff?.currentPosition.toUpperCase()}
                </span>
                <img src="${leaf}" alt="" />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = { idCardContent };
