cd server 
npm install
npx prisma migrate dev --name init --preview-feature
npm start

cd client
npm install
npm start