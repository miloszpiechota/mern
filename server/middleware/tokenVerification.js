const jwt = require("jsonwebtoken");
//weryfikacja i tworzenie tokenu

  //tokenVerification przyjmuje trzy argumenty: 
  // - obiekt zadania
  // - obiekt odpowiedzi
  // - next funkcja ktora przechodzi do kolejnego middleweare jesli nie ma innego
function tokenVerification(req, res, next) {
  // Pobranie tokenu z nagłówka zadania
  let token = req.headers["x-access-token"];
  
//jesli nie istnieje
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Weryfikacja poprawności tokenu
  //funkcja przyjmuje
  // - sam token
  // - tajny klucz do podpisywania tokentów w zmiennej srodowiskowej
  // - funkcja zwrotna po weryfikacji tokenu
  //
  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodedUser) => {
    if (err) {
      console.log("Unauthorized!");
      return res.status(401).send({ message: "Unauthorized!" });
    }
    
    console.log("Token poprawny, użytkownik: " + decodedUser._id);
    req.user = decodedUser;
    next();
  });
}

module.exports = tokenVerification;

