# Discord_Bot_Management_Rest_Api

## Prerequisite

You'll need to gather two important datas before launching the API :
    - the *chat id* where you want you bot to be talking.
    - a token designating your bot. You can get that token on the bot management discord page.
  
Now that you have those 2 things, you need to create a file named token in the server file and add as many json files as you need.
*Take care*, those json files should be named _*token_discord_bot_<n>.json*_ (where n is the number of your bot for example 1 2 3...)
The json files should be as follows : 

    {"token":"<yourtoken>","salon_id":"<your chat id>"}


