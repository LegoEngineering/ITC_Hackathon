
Template.main.helpers({
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

Template.rate.events({
  "click #submitRate": function(){
    var store = document.getElementById("store");
    var score = document.getElementById("rating");
    var comment = document.getElementById("addComment");
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
    return Stores.find();
  }
});

