FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# copy all the content
COPY . .

# Expose the backend port
EXPOSE 8000

# As soon as container start run this command
CMD ["npm","start"] 
# run the start script present in package.json