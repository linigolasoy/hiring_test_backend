const Save = require('../models/save');

// Response standard message
function responseMessage( status, message, data )
{
    return { 
        status: status,
        message: message,
        data: data
    };
}

// Save game, added standard message
exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
       
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 

        res.status(201).json( responseMessage(true, 'Game data saved successfully', undefined) );
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json( responseMessage(false, 'Error saving game data', error) );
    }
};


// Query games played by user, maximum 100, order by descending game date
exports.listGameData = async (req, res) => {
    try
    {
        const reqUserID = req.params['id'];
        console.log('User id to fetch:', reqUserID); 

        var oResult = await Save.
            find(
                {
                    userID : reqUserID
                }
            ).
            limit(100).
            sort({ gameDate: -1 }).
            select({ userID : 1, difficulty: 1, failed: 1, completed: 1, gameDate: 1, timeTaken: 1 }).
            exec();

            res.status(200).json( responseMessage(true, 'Success', oResult) );
    }
    catch (error) 
    {
        console.error('Error retreiving game data:', error);
        res.status(500).json( responseMessage(false, 'Error retreiving game data', error) );
    }

};