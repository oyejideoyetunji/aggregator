## Requirements
nvm 
node.js
postgresql@16 & psql

## Set up
- Create ~/.gatorconfig.json file (a .gatorconfig.json file in your home dir)
- In the ~/.gatorconfig.json file, add {"db_url":"postgres://postgres:@localhost:5432/gator?sslmode=disable","current_user_name":""}
- start your postgress server via psql
- register user with "pnpm run start register <username>", registered user is auto logged in.
- test the following commands
    - "pnpm run start addfeed <feed_url>"
    - "pnpm run start feeds"
    - "pnpm run start agg"
    - "pnpm run start following"
    - "pnpm run start browse"
