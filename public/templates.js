var itemShowTemplate = '\
	<% if (type === "link") { %> \
		<a class="text" href="<%= url %>"><%= name ? name : url %></a>	\
	<% } else if (type === "quote") { %>	\
		<p class="text"><%= text %></p><p class="author"><%= author %></p>	\
	<% } else if (type === "soundcloud") { %>	\
		<p class="text">not working yet</p>	\
	<% } %>	\
	<button class="delete">X</button>';

var itemEditTemplate = '\
	<input class="text" type="text" placeholder="add something"> \
	<button class="add">+</button>';