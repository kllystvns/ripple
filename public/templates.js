var userLoginTemplate = '\
		<li><p>Hello, there!</p></li> \
		<li><p class="message"><%= message %></p></li> \
		<li class="inp"><input type="text" id="username" placeholder="username"></li> \
		<li class="inp"><input type="password" id="password" placeholder="password"></li> \
		<li class="int"><div class="button login">SIGN IN</div></li> \
		<li class="int"><div class="button signup">SIGN UP</div></li> \
		<li class="int"><div class="button guest">TRY RIPPLE</div></li>';

var userNewTemplate = '\
		<li><p>Hello, there!</p></li> \
		<li><p class="message"><%= message %></p></li> \
		<li class="inp"><input type="text" id="username" placeholder="username"></li> \
		<li class="inp"><input type="text" id="email" placeholder="email"></li> \
		<li class="inp"><input type="password" id="password" placeholder="password"></li> \
		<li class="inp"><input type="password" id="password-confirm" placeholder="confirm password"></li> \
		<li class="int"><div class="button create">GET STARTED</div></li>';

var userEditTemplate = '\
		<li><p>Update your info</p></li> \
		<li><p class="message"><%= message %></p></li> \
		<li class="inp"><input type="text" id="username" placeholder="new username"></li> \
		<li class="inp"><input type="text" id="email" placeholder="new email"></li> \
		<li class="inp"><input type="password" id="password" placeholder="new password"></li> \
		<li class="inp"><input type="password" id="password-confirm" placeholder="confirm password"></li> \
		<li class="int"><div class="button update">SAVE</div></li>';

var userGuestTemplate = '\
		<li><p>Hello! You can save your info by signing up.</p></li> \
		<li><p class="message"><%= message %></p></li> \
		<li class="inp"><input type="text" id="username" placeholder="username"></li> \
		<li class="inp"><input type="text" id="email" placeholder="email"></li> \
		<li class="inp"><input type="password" id="password" placeholder="password"></li> \
		<li class="inp"><input type="password" id="password-confirm" placeholder="confirm password"></li> \
		<li class="int"><div class="button update">GET STARTED</div></li>';

var userShowTemplate = '\
		<% if (name) { %> \
			<li><p>Hello, <%= name %>!</p></li> \
		<% } else { %> \
			<li><p>Hello, there!</p></li> \
		<% } %> \
		<li><p id="username"><%= username %></p></li> \
		<li><p id="email"><%= email %></p></li> \
		<li class="int"><div class="button edit">EDIT</button></li> \
		<li class="int"><div class="button logout">LOG OUT</button></li>';






var dropletShowTemplate = '\
		<% if (data.type === "link") { %> \
			<div class="link"> \
			<a class="text" href="<%= data.url %>"><%= data.name ? data.name : data.url %></a>	\
			</div> \
		<% } else if (data.type === "quote") { %>	\
			<div class="quote"><p class="text"><%= data.text ? data.text : "" %></p><p class="author">--<%= data.author %></p></div>	\
		<% } else if (data.type === "soundcloud") { %>	\
			<div class="soundcloud"> \
			<p class="text">not working yet</p>	\
			</div> \
		<% } %>	\
		<button class="delete">×</button>';

var dropletEditTemplate = '\
		<% if (data.type === "quote") { %> \
			<input class="text" type="text" placeholder="record a thought"> \
			<input class="author" type="text" placeholder="who is it from?"> \
			<input type="hidden" name="type" class="type" value="quote"> \
		<% } else { %>	\
			<input class="name" type="text" placeholder="what have you found?"> \
			<input class="url" type="text" placeholder="where is it from? (url)"> \
			<input type="hidden" name="type" class="type" value="link"> \
		<% } %>	\
		<button class="add">+</button>';



