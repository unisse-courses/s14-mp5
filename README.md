# Vanguard

Vanguard is a weapon and armor manufacturing company that sells quality equipments to other Hunters and also serves as an avenue for them to trade their items.

# Team Members
* Chua, Kerby
* Oliquino, Alfred

# Usage
Visitors may opt to access the web application in two ways: local or through the deployed URL

## Heroku deployment
To access the web application, you may visit [Vanguard](https://ccapdev-vanguard.herokuapp.com/) here

## Local instance
#### Step 0: Pre-requisites
Install [Node.js](https://nodejs.org/en/)

Clone the repository and navigate to it
- Method 1: GitHub CLI
`gh repo clone unisse-courses/s14-mp5`
- Method 2: HTTPS
`git clone https://github.com/unisse-courses/s14-mp5.git`
- Method 3: GitHub Desktop

Create a `.env` file with the following content:
```
PORT=3000
MONGODB_URL="mongodb+srv://admin:1234@vanguarddb.gnxke.mongodb.net/vanguard?retryWrites=true&w=majority"
SESSION_SECRET=somegibberishsecret
```

Uncomment lines 1 and 2 of `config.js` by removing the `/`
```
const dotenv = require('dotenv');
dotenv.config();
```

#### Step 1: Install web application dependencies
For Windows users: open command prompt on the application directory and run `npm install`

#### Step 2: Start an instance of the web application
On the same terminal, run `node index.js`

### And you're done!
Access the web application via [localhost:3000](localhost:3000)
