const redisClient = require("../config/redis");
// objective is to give 60 requests, in 60 minutes
const apiLimiter = async(req, res, next)=>{
    try{
        const ip = req.ip;
        const redisKey = `Client IP : ${ip}`;
        const ipExists = await redisClient.get(redisKey);
        if(!ipExists)
        {
            const obj = {
                count : 1,
                timestamp :  Date.now(),
                coolDown :  Date.now() + 60 * 60 * 1000
            }
            await redisClient.set(redisKey, JSON.stringify(obj), {
                EX: 60 * 60 
                // 60 secs * 60 minutes
        });
        }
        else{
           const obj =  await redisClient.get(redisKey);
           const object = JSON.parse(obj);
           const {count, timestamp, coolDown} = object;
           const timeDiff =( Date.now() - timestamp) / 1000;
           if (count >= 60)
           {
            throw new Error (`Too many reqs cooldown in ${(coolDown - Date.now()) / 1000 * 60} minutes`)
           }
           else if(timeDiff < 2 )
           {
            throw new Error ("Too many request, try again after 2 secs!")
           }
           else
           {
            object.count++;
            object.timestamp = Date.now();
            await redisClient.set(redisKey, JSON.stringify(object), {
                EX : 60 * 60
            });
           }
        }
          next();
    }catch(err)
    {
        console.log('Redis error', err);
        res.send('Error',err);
    }
  
}
module.exports = apiLimiter;