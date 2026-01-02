const redis = require("redis");

const submissionsProblemLimiter = async (req, res, next) => {
    const user = req.user;
    const redisKey = `submissionsProblem:${user._id}`;

    try {
        const exists = await redisClient.exists(redisKey);

        if (exists) {
            return res.status(200).json({
                message: "Rate limit exceeded. Try again after 10 seconds."
            });
        }

        // set key with expiry of 10 seconds if not exists
        await redisClient.set(redisKey, "cooldown_active", {
            EX: 10,
            NX: true
        });

        next();
    }
    catch (err) {
        return res.status(500).send("Server Error: " + err.message);
    }
}

module.exports = submissionsProblemLimiter;
