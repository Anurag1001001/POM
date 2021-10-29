/*
 * Author: Anurag Tripathi
 * Description: this file contains all routes for dart api
 * Date: May 25, 2021
 */

const { createProxyMiddleware } = require('http-proxy-middleware');
const options = {
    target:  process.env.DART_BASEURL, // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    logLevel: 'debug',
    pathRewrite: (path, req) => { return path.replace('/v1', '') }
  };
const proxy = createProxyMiddleware(options)

const express = require("express");
const Router = express.Router();

const controller = require("./v0.controller");
const Verify = require("../../services/middleware/token").verify;

// ****************GET Request***************************
Router.get('/ws', proxy)
Router.get("/auth/apple_login", controller.appleMusicLogin);
Router.get("/auth/apple_login/token", controller.appleMusicAccessToken);

Router.get("/chat/history/:roomId", controller.getData);
Router.get("/chat/unread", controller.getData);
Router.get("/chat/rooms", controller.getData);
Router.get("/chat/rooms/:roomId", controller.getData);

Router.get("/connect/spotify", controller.getData);
Router.get("/connect/default", controller.getData);
Router.get("/connect", controller.getData);
Router.get("/connect/apple/developer_token", controller.getData);
Router.get("/connect/apple", controller.getData);

Router.get("/event", controller.getData);
Router.get("/event/me", controller.getData);

Router.get("/user/image/avatar/:uuid", controller.getData);

Router.get("/matches/likes", controller.getData);
Router.get("/matches/profile/:id", controller.getData);
Router.get("/matches/profile/:id/unmatch", controller.getData);

Router.get("/music_data/default_data", controller.getData);
Router.get("/music_data/genres_top", controller.getData);
Router.get("/music_data/top_tracks", controller.getData);
Router.get("/music_data/top_artists", controller.getData);
Router.get("/music_data/default_tracks", controller.getData);
Router.get("/music_data/default_playlists", controller.getData);
Router.get("/music_data/default_albums", controller.getData);
Router.get("/music_data/tracks", controller.getData);
Router.get("/music_data/artists", controller.getData);
Router.get("/music_data/albums", controller.getData);
Router.get("/music_data/playlists", controller.getData);
Router.get("/music_data/genres", controller.getData);
Router.get("/music_data/emotions", controller.getData);

Router.get("/preferences", controller.getData);
Router.get("/presents/last", controller.getData);

Router.get("/profile/", controller.getData);
Router.get("/profile/strength", controller.getData);

Router.get("/universities", controller.getData);
Router.get("/user", controller.getData);
Router.get("/user/place", controller.getData);

Router.get("/user/delete", controller.getData);
// ****************End GET Request****************************

// ############### POST Request ##############################

Router.post("/auth/login", controller.postData);
Router.post("/auth/facebook", controller.postData);
Router.post("/auth/apple", controller.postData);
Router.post("/auth/login_phone", controller.postData);
Router.post("/auth/login_phone/:code", controller.postData);
Router.post("/auth/sms", controller.postData);
Router.post("/auth/sms/:code", controller.postData);
Router.post("/auth/email", controller.postData);
Router.post("/auth/email/:code", controller.postData);
Router.post("/auth/register", controller.postData);
Router.post("/auth/login/admin", controller.postData);
Router.post("/auth/register/admin", controller.postData);
Router.post("/chat/image", proxy);
Router.post("/event", controller.postData);
Router.post("/user/image", proxy);

Router.post("/user/device_id", (req, res, next) => {
    res.status(200).send({});
});

Router.post("/matches/profile/:id/superlike", controller.postData);
Router.post("/music_data/album", controller.postData);
Router.post("/music_data/song", controller.postData);
Router.post("/music_data/artist", controller.postData);
Router.post("/music_data/genre", controller.postData);
Router.post("/preferences", controller.postData);
Router.post("/profile", controller.postData);
Router.post("/profile/pause", controller.postData);
Router.post("/profile/special_to_user", controller.postData);
Router.post("/profile/guilty_pleasure/visible", controller.postData);
Router.post("/reports/new", proxy);
Router.post("/reports/contact_form", controller.postData);

// ################ End POST Request ########################

// ****************DELETE Request***************************

Router.delete("/user/image/:uuid", proxy);

// ****************End DELETE Request***************************

// ################ PUT Request ################################

Router.put("/profile/create", controller.putData);

// ############### End PUT Request #############################


// ############## Custom code changes for algo #################
Router.get("/matches/profile/:id/like", Verify, controller.userLike)
Router.get("/matches/profile/:id/dislike",Verify, controller.userDisLike)
Router.get("/matches", Verify, controller.todayMatch)

module.exports = Router;
