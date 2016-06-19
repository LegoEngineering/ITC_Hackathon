
Template.main.helpers({
  "setMain":function(){
    Session.set("filter", null);
    Session.set("storeRate", "10");
  },
  "loggedIn":function(){
    console.log("hi");
    return Meteor.user();
  }
});

Template.main.events({
  "click #createUser":function(e){ //creates user. TODO: only have user created if doesnt already exist
    e.preventDefault();
    var username = document.getElementById("username").value;
    if (username != "") {
      Meteor.call("addUser", username, 0);
      Meteor.setTimeout(function(){Meteor.loginWithPassword(username, "test");}, 3000);
    }
  }

});

Template.rate.helpers({
  "selectedStore":function(){
    return Stores.findOne({_id: Session.get("storeRate")});
  }
});

Template.rate.events({
  "click #submitScore": function(){
    var store = Session.get("storeRate");
    var score = $("#rating").val();
    var comment = document.getElementById("addComment").value;
    if (score != null && store != null) {
      Meteor.call("addScore", store, score);
    }
      if (comment != ""){
        var userID = Meteor.userId();
      Meteor.call("addComment", store, comment, userID);
    }
  }
});

Template.listView.helpers({
  "store":function(){
    return Stores.find({category: Session.get("filter")});
  }
});

Template.listView.events({
  "change #filter":function(e){
    var filter = $(e.target).val();
    console.log(filter);
    Session.set("filter", filter);
  }
});

