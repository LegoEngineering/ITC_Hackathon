Meteor.methods({

    addScore: function(storeID, score){
      var store = Stores.findOne({_id: storeID});
        var newScore = (store.score + score)/(store.total+1);
        Stores.update(
            { _id: storeID },
            {
                $inc: { total: 1 },
                $set: {score: newScore}
            }
        )

    },

    addComment: function (storeID, comment, userID) {
        Meteor.serverMethods.insertDocument({
               comment: comment,
                storeID: storeID,
                userID: userID
            }, Comments
        );
    },

    addUser: function(username, location){
        var options = {
            username: username,
            password: "test",
            profile: {
               location:location
            }
        };
        Accounts.createUser(options);

    }
});