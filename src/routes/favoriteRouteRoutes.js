const express = require('express');
const router = express.Router();
const favoriteRouteController = require('../controllers/favoriteRouteController');
const favoriteRouteValidation = require('../validations/favoriteRouteValidation');
const auth = require('../middlewares/auth');

router.post(
    '/add',
    auth,
    favoriteRouteValidation.routeIdBodyRule,
    favoriteRouteController.addFavorite
);

router.post(
    '/remove',
    auth,
    favoriteRouteValidation.routeIdBodyRule,
    favoriteRouteController.removeFavorite
);

router.post(
    '/listFavorites',
    auth,
    favoriteRouteValidation.listFavoriteRules,
    favoriteRouteController.listFavorites
);

module.exports = router;
