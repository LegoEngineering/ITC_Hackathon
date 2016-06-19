Meteor.serverMethods = {
    insertDocument: function(document, collection) {
        var check = 0;
        while(1){ //if deleted, will continue from end
            var fetch = collection.find({},{fields:{idNum:1},sort:{idNum:-1},limit:1}).fetch();
            document.idNum = fetch[0] != null ? fetch[0].idNum + 1 : 10;
            document._id = document.idNum.toString();
            try{
                collection.insert(document);}
            catch(err) {
                if (collection.findOne({_id: document._id}) !== undefined) {
                    check++;
                    if (check < 50) {
                        continue; //Already exists, needs to run again to increment correctly
                    } else {
                        console.log("unexpected error - insert document - endless while");
                        break;
                    }
                } else {
                    console.log("unexpected error - insert document");
                }
            }
            return document._id;
        }
    }
};
