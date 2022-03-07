# Getting it running

This project uses prisma which needs a few steps to get running. You will need docker desktop to use the mysql container.

First off ensure that packages are installed with `npm i`

Make sure that docker desktop is running and then run `docker compose up -d`

Next run `npx prisma generate` and `npx prisma db push`

From here it's good to go, you can finally run `npm run dev`.
