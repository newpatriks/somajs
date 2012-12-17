;(function(sniply, undefined) {

	// package
	sniply.views = sniply.views || {};

	// utils
	function target(event) {
		return event.currentTarget ? event.currentTarget : event.srcElement;
	}

	// templates

	function Header(template, scope, dispatcher, userModel, api) {

		var list = ['list', 'manage'];
		var current = 'list';

		dispatcher.addEventListener('render-nav', function() {
			render();
		});

		scope.isSignedIn = function() {
			return userModel.isSignedIn();
		}
		scope.logout = function() {
			userModel.logout();
			template.render();
		}
		scope.select = function(event, id) {
			current = id;
			for (var i = 0, l = list.length; i < l; i++) {
				$('.' + list[i])[ list[i] === current ? 'removeClass' : 'addClass' ]('hidden');
				$('.nav-' + list[i])[ list[i] === current ? 'addClass' : 'removeClass' ]('hidden');
			}
		}
		scope.getCurrent = function() {
			console.log('get current user');
			api.getCurrentUser(function(data) {
				console.log(data);
			}, function(err) {
				console.log('Error getting the current user', err);
			});
		}
		scope.signin = function() {
			// stay in the same function to avoid popup blocker
			userModel.signin();
		}

		function render() {
			scope.user = userModel.getUser();
			template.render();
		}

		render();

	}

	function List(template, scope, dispatcher, snippetModel) {

		var inputValue = '';
		var snippetFiltered = [];

		scope.snippets = scope.snippetsFiltered = snippetModel.get();

		template.render();

		dispatcher.addEventListener('render-list', function() {
			scope.snippets = snippetModel.get();
			template.render();
		});

		scope.search = function(event) {
			inputValue = target(event).value;
			template.render();
		}

		scope.del = function(event, snippet) {
			snippetModel.del(snippet);
		}

		scope.snippetsFiltered = function() {
			//if (inputValue === '') return snippetFiltered;
			return scope.snippets.filter(function(snippet) {
				return snippet.text.indexOf(inputValue) !== -1;
			});
		}
	}

	function Manage(template, scope, dispatcher, snippetModel) {

		var textarea = $('textarea', template.element);

		scope.add = function() {
			var value = textarea.val().trim();
			if (value === '') return;
			snippetModel.add(textarea.val());
			textarea.val('');
		}
	}

	// exports
	sniply.views.Header = Header;
	sniply.views.List = List;
	sniply.views.Manage = Manage;

})(sniply = window.sniply || {});