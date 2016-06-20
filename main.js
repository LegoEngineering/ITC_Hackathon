Template.main.helpers({
  "setMain":function(){
    Session.set("filter", null);
    Session.set("storeRate", "10");
    Session.set("view", "Map");
  },
  "loggedIn":function(){
    return Meteor.user();
  },
  "showMap":function(){
    return Session.equals("view", "Map");
  },
  "showList":function(){
    return Session.equals("view", "List");
  },
  "showComments":function(){
    return Session.equals("view", "Comments");
  },
  "showShopping":function(){
    return Session.equals("view", "Shopping");
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

Template.mapView.onRendered(function initMap() {
  var myLatLng = {lat: 32.06868, lng: 34.76905};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: myLatLng
  });
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!',
    id: 1
  });
  marker.addListener("click", function(){
    console.log("hi");
  });

});
Template.mapView.events({
  "click #goToList": function(){
    Session.set("view", "List");
  },
  "click #goToShopping": function(){
    Session.set("view", "Shopping");
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

Template.shopView.events({
  "click #goToMap": function(){
    Session.set("view", "Map");
  },
  "click .makeList": function() {
    var boxes = document.getElementsByTagName('input');
    var selected = [];
    var bestStores = [];
    for (var counter = 0; counter < boxes.length; counter++) {
      if (boxes[counter].checked == true) {
        selected.push(boxes[counter].value);
      }
    }
    for (var i = 0; i < selected.length; i++) {
      bestStores.push(Stores.find({content: selected[i]}, {sort: {score: -1}, limit: 1}).title);
      alert(selected[i]);
      alert(bestStores[i]);
    }
    return bestStores;
    },
  "click .viewComments":function(){
    Session.set("storeRate", this._id);
    Session.set("view", "Comments");
  }
});

Template.shopView.helpers({
  "stores":function(){
    var boxes = document.getElementsByTagName('input');
    var selected = [];
    var bestStores = [];
    for (var counter = 0; counter < boxes.length; counter++) {
      if (boxes[counter].checked == true) {
        selected.push(boxes[counter].value);
      }
    }
    for (var i = 0; i < selected.length; i++) {
      bestStores.push(Stores.find({subcategory: selected[i]}, {sort: {score: -1}, limit: 1})).name;
    }
    return bestStores;
  }
})

Template.listView.helpers({
  "store":function(){
    return Stores.find({category: Session.get("filter")});
  }
});

Template.listView.events({
  "click #goToMap": function(){
    Session.set("view", "Map");
  },
  "change #filter":function(e){
    var filter = $(e.target).val();
    console.log(filter);
    Session.set("filter", filter);
  },
  "click .viewComments":function(){
    Session.set("storeRate", this._id);
    Session.set("view", "Comments");
  }
});

Template.commentView.helpers({
  "comments": function(){
    return Comments.find({storeID: Session.get("storeRate")});
  },
  "user":function(){
    return Meteor.users.findOne({_id: this.userID}).username;
  }
});

Template.commentView.events({
  "click #goToList": function(){
    Session.set("view", "List");
  }
});