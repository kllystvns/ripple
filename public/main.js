// 'var user' (User model) has been declared in EJS
var userView = new UserView({model: user});


var ponder = new Vessel({items: user.attributes.ponder.items, category: 'ponder'});
var see = new Vessel({items: user.attributes.see.items, category: 'see'});
var hear = new Vessel({items: user.attributes.hear.items, category: 'hear'});
var learn = new Vessel({items: user.attributes.learn.items, category: 'learn'});
var read = new Vessel({items: user.attributes.read.items, category: 'read'});

user.vessels = new VesselCollection(ponder, see, hear, learn, read);

var ponderView = new PonderView({model: ponder});
var seeView = new SeeView({model: see});
var hearView = new HearView({model: hear});
var learnView = new LearnView({model: learn});
var readView = new ReadView({model: read});

