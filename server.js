import app from './app.js';
import {sequelize} from './models/index.js';

const PORT=process.env.PORT||5000;

(async()=>{
    try{
        await sequelize.authenticate();
        console.log("PostgreSQL connected");

        // await sequelize.sync({force:true});//all the tables mention in model are created 
        await sequelize.sync();
        //0.0.0.0 means it will accept request from all interfaces not only localhost ...as in docker then if localhost then it will not listen outside docker if mentioned localhost then it will not listen outside docker if mentioned 0.0.0.0 then it will listen outside docker
        app.listen(PORT,'0.0.0.0',()=>{ 
            console.log(`Server running on  http://0.0.0.0:${PORT}`);
        })


    }catch(err){
        console.error('Database connection failed')
        console.error(err)
    }
})();

