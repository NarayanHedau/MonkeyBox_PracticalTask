const { google } = require('googleapis');
const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
require("../model/user.model")
const UserSchema = mongoose.model("UserSchema")
const oauth2Client = require("../helper/oauth2client")


  router.get("/auth/google", async(req, res)=>{
    try {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive'],
          });
          console.log(">>>>>>>>>>>>>>authURL", authUrl);
          res.redirect(authUrl);
    } catch (error) {
        console.log(error);
    }
  })

  router.get("/auth/google/callback", async(req, res)=>{
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        const accessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;
        const user = new UserSchema({ accessToken, refreshToken }).save();
        res.send({status: "SUCCESS", code: 200, message:'Authentication successful. Tokens saved.'});

    } catch (error) {
        console.error('Error exchanging authorization code:', error);
        res.status(500).send('Error occurred during authentication.');
    }
  })

  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });

  router.get('/files', async (req, res) => {
    try {
      const response = await drive.files.list({
        fields: 'files(id, name, mimeType, size, webViewLink)',
      });
      const files = response.data.files;
      const processedFiles = files.map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        webViewLink: file.webViewLink,
      }));
  
      res.json(processedFiles);
    } catch (error) {
      console.error('Error retrieving file data:', error);
      res.status(500).send('Error occurred while retrieving file data.');
    }
  });


  router.get('/files/:id', async (req, res) => {
    const fileId = req.params.id;
    try {
      const response = await drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, webViewLink',
      });
      const file = response.data;
      const processedFile = {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        webViewLink: file.webViewLink,
      };
  
      res.json(processedFile);
    } catch (error) {
      console.error('Error retrieving file data:', error);
      res.status(500).send('Error occurred while retrieving file data.');
    }
  });

  router.post('/revoke-access', async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await UserSchema.findOne({_id:userId});
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      const { accessToken } = user;
      await UserSchema.findByIdAndDelete({_id:userId});
      res.send('Access revoked');
    } catch (error) {
      console.error('Error revoking access:', error);
      res.status(500).send('Error occurred while revoking access.');
    }
  });


module.exports= router;