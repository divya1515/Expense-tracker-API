import app from './app.js';
import {sequelize} from './models/index.js';

const PORT=process.env.PORT||5000;

(async()=>{
    try{
        await sequelize.authenticate();
        console.log("PostgreSQL connected");

        // await sequelize.sync({force:true});//all the tables mention in model are created 
        await sequelize.sync();
        app.listen(PORT,()=>{
            console.log(`Server running on  http://localhost:${PORT}`);
        })


    }catch(err){
        console.error('Database connection failed')
        console.error(err)
    }
})();

