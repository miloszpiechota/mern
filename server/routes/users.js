const router = require('express').Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const tokenVerification = require('../middleware/tokenVerification');


// trasa do rejestracji nowego użytkownika
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: 'User with given email already exists!' });

    //generowanie solonego hasła za pomoca bib. bcrypt
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //tworzenie nowego obiektu użytkownika wraz z hash password
    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Pobierz wszystkich użytkowników
router.get('/', async (req, res) => {
  try {
    //znajduje wszytskich użytkowników z wyjątkeim hasła 
    const users = await User.find().select('-password');
    res.send({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/details', tokenVerification, async (req, res) => {
  try {
    //ta linia znajduje uzytkownika w baxie na podstawie id ktory jest dostarczany przez token 
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send({ message: 'User not found' });
    //jezeli zostanie znaleziony to dane zostana zwrocone za pomoca JSON
    res.send({ data: user });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});




module.exports = router;
