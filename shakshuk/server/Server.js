Meteor.methods({

    addScore: function(storeID, score){
      var store = Stores.findOne({_id: storeID});
        var a;
        if (store.total == 0){
         a =  parseInt(score);
        }
        else {
            a = (parseInt(store.score)*parseInt(store.total)) + parseInt(score);
        }
        console.log(a);
        var b = store.total+1;
        var newScore = a/b;
        console.log(newScore);
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
