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
		<% if (type === "link") { %> \
			<div class="link"> \
			<a class="text" href="<%= url %>"><%= name ? name : url %></a>	\
			</div> \
		<% } else if (type === "quote") { %>	\
			<div class="quote"><p class="text"><%= text %></p><p class="author">--<%= author %></p></div>	\
		<% } else if (type === "soundcloud") { %>	\
			<div class="soundcloud"> \
			<p class="text">not working yet</p>	\
			</div> \
		<% } %>	\
		<button class="delete">×</button>';

var dropletEditTemplate = '\
		<input class="text" type="text" placeholder="add something"> \
		<input class="url" type="text" placeholder="where is it from?"> \
		<button class="add">+</button>';



