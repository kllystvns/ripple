var userNewTemplate = '\
	<p>Hello, user!</p> \
	<p class="message"><%= message %></p> \
	<input type="text" id="username" placeholder="username"> \
	<input type="text" id="email" placeholder="email"> \
	<input type="password" id="password" placeholder="password"> \
	<input type="password" id="password-confirm" placeholder="confirm password"> \
	<button class="create">GET STARTED</button>';

var userLoginTemplate = '\
	<p>Hello, user! again</p> \
	<p class="message"><%= message %></p> \
	<input type="text" id="username" placeholder="username"> \
	<input type="password" id="password" placeholder="password"> \
	<button class="login">SIGN IN</button> \
	<button class="signup">SIGN UP</button>';

var userShowTemplate = '\
	<p>Hello, user!</p> \
	<p id="username"><%= username %></p> \
	<p id="email"><%= email %></p> \
	<button class="logout">LOG OUT</button>';




var dropletShowTemplate = '\
	<% if (type === "link") { %> \
		<a class="text" href="<%= url %>"><%= name ? name : url %></a>	\
	<% } else if (type === "quote") { %>	\
		<p class="text"><%= text %></p><p class="author"><%= author %></p>	\
	<% } else if (type === "soundcloud") { %>	\
		<p class="text">not working yet</p>	\
	<% } %>	\
	<button class="delete">X</button>';

var dropletEditTemplate = '\
	<input class="text" type="text" placeholder="add something"> \
	<input class="url" type="text" placeholder="where is it from?"> \
	<button class="add">+</button>';