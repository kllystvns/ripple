var userLoginTemplate = '\
		<p>Hello, user!</p> \
		<p class="message"><%= message %></p> \
		<input type="text" id="username" placeholder="username"> \
		<input type="password" id="password" placeholder="password"> \
		<button class="login">SIGN IN</button> \
		<button class="signup">SIGN UP</button>\
		<button class="guest">TRY RIPPLE</button>';

var userNewTemplate = '\
		<p>Hello, user!</p> \
		<p class="message"><%= message %></p> \
		<input type="text" id="username" placeholder="username"> \
		<input type="text" id="email" placeholder="email"> \
		<input type="password" id="password" placeholder="password"> \
		<input type="password" id="password-confirm" placeholder="confirm password"> \
		<button class="create">GET STARTED</button>';

var userEditTemplate = '\
		<p>Hello, user!</p> \
		<p class="message"><%= message %></p> \
		<input type="text" id="username" placeholder="new username"> \
		<input type="text" id="email" placeholder="new email"> \
		<input type="password" id="password" placeholder="new password"> \
		<input type="password" id="password-confirm" placeholder="confirm password"> \
		<button class="update">SAVE</button>';

var userGuestTemplate = '\
		<p>Hello! You can save your info by signing up.</p> \
		<p class="message"><%= message %></p> \
		<input type="text" id="username" placeholder="username"> \
		<input type="text" id="email" placeholder="email"> \
		<input type="password" id="password" placeholder="password"> \
		<input type="password" id="password-confirm" placeholder="confirm password"> \
		<button class="update">GET STARTED</button>';

var userShowTemplate = '\
		<% if (name) { %> \
			<p>Hello, <%= name %>!</p> \
		<% } else { %> \
			<p>Hello, user!</p> \
		<% } %> \
		<p id="username"><%= username %></p> \
		<p id="email"><%= email %></p> \
		<button class="edit">EDIT</button> \
		<button class="logout">LOG OUT</button>';






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
		<% if (data.category === "ponder") { %> \
			<input class="text" type="text" placeholder="record a thought"> \
			<input class="author" type="text" placeholder="who is it from?"> \
			<input type="hidden" name="type" class="type" value="quote"> \
		<% } else { %>	\
			<input class="name" type="text" placeholder="what have you found?"> \
			<input class="url" type="text" placeholder="where is it from?(url)"> \
			<input type="hidden" name="type" class="type" value="link"> \
		<% } %>	\
		<button class="add">+</button>';



