(function() {
	'use strict';

	var app = {
		isLoading:true,
		visibleCards: {},
		selectedMovies: [],
		spinner: document.querySelector('.loader'),
		cardTemplate: document.querySelector('.movie-card-template'),
		container: document.querySelector('.wrapper'),
    	addDialog: document.querySelector('.dialog-container'),
	};

	document.getElementById('btn-refresh').addEventListener('click', function() {
		//Refresh the current movie list
		app.getMovieList();
	});

	document.getElementById('btn-add').addEventListener('click', function() {
		//Open the new movie dialog
		app.toggleAddDialog(true);
	});

	document.getElementById('btn-add-movie').addEventListener('click', function(){
		console.log("Something");
		if (document.querySelector("#movie-search-id").textContent != ""){
			var id = document.querySelector("#movie-search-id").textContent;
			var title = document.querySelector("#movie-search-title").textContent;
			var poster = document.querySelector("#movie-search-poster").src;
			var plot = document.querySelector("#movie-search-plot").textContent;
			app.addToMovieList(id, title, poster, plot);
			if (!app.selectedMovies) {
				app.selectedMovies = [];
			}
			app.getMovie(title);
			app.selectedMovies.push({id: id, title: title, poster: poster, plot: plot});
			app.saveSelectedMovies();
			app.toggleAddDialog(false);
		}

	});

	document.getElementById('btn-add-cancel').addEventListener('click', function(){
		app.toggleAddDialog(false);
	});

	document.getElementById('btn-search').addEventListener('click', function() {
		var title = document.querySelector("#search").value;
		app.searchForMovie(title);
	})



	//Toggles the add movie dialog
	app.toggleAddDialog = function(visible) {
		if (visible) {
			app.addDialog.classList.remove('hide-element');	
			app.addDialog.classList.add('show-element');
		} else {
			app.addDialog.classList.add('hide-element');
			app.addDialog.classList.remove('show-element');
		}
	};

	//Search for a movie
	app.searchForMovie = function(title) {
		var url = "http://www.omdbapi.com/?apikey=b18781c4&t="+encodeURIComponent(title)
		console.log(url);
		// Fetch the movie data
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					var response = JSON.parse(request.response);
					var results = response;
					var searchList = document.querySelector("#search-results");
					var moviePoster = document.querySelector('#movie-search-poster');
					moviePoster.src = results.Poster;
					moviePoster.classList.remove('hide-element');
					var movieTitle = document.querySelector('#movie-search-title');
					movieTitle.textContent = results.Title;
					movieTitle.classList.remove('hide-element');
					var movieID = document.querySelector('#movie-search-id');
					movieID.textContent = results.imdbID;
					var moviePlot = document.querySelector('#movie-search-plot');
					moviePlot.textContent = results.Plot;
				}
			} else {
				// Return the initial movie list since no data is available.
        		app.updateMovieList(initialMovieList);
			}
		};
		request.open('GET', url);
    	request.send();
	}

	// Add your movie to the movie list
	app.addToMovieList = function(id, title, poster, summary) {
		console.log(id);
		var url = "http://localhost/moviemango/updateMovieList.php?imdbID="+id+"&title="+title+"&poster="+poster+"&summary="+summary;
		console.log(url);
		// Add the movie
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					var response = JSON.parse(request.response);
					var results = response;
					for (var i = data.length - 1; i >= 0; i--) {
						var dataLastUpdated = new Date(data[i].Released);
						var id = data[i].imdbID;
						var title = data[i].title;
						var poster = data[i].poster;
						var plot = data[i].summary;

						var card = app.visibleCards[data[i].id];
						if (!card) {
							card = app.cardTemplate.cloneNode(true);
							card.classList.remove('cardTemplate');
							card.querySelector('.movie-title').textContent = data[i].Title;
							card.removeAttribute('hidden');
							app.container.appendChild(card);
							app.visibleCards[data[i].imdbID] = card;
						}

						card.querySelector("#movie-title").textContent = title;
						card.querySelector("#movie-poster").src = poster;
						card.querySelector("#movie-description").textContent = plot;
					}
					app.toggleAddDialog(false);
				}
			} else {
				// Return the initial movie list since no data is available.
        		console.log("Error");
			}
		};
    	request.send();
	}

	//Updates the current movie card with the latest movie info. The movie is
	//created if it does not exist already
	app.updateMovieList = function(data) {
		for (var i = data.length - 1; i >= 0; i--) {
			console.log(data[i].imdbID+"?|"+JSON.stringify(app.selectedMovies).includes(id));
			if (JSON.stringify(app.selectedMovies).indexOf(data[i].title)){
				var dataLastUpdated = new Date(data[i].Released);
				var id = data[i].imdbID;
				var title = data[i].title;
				var poster = data[i].poster;
				var plot = data[i].summary;

				var card = app.visibleCards[data[i].id];
				if (!card) {
					card = app.cardTemplate.cloneNode(true);
					card.classList.remove('cardTemplate');
					card.querySelector('.movie-title').textContent = data[i].Title;
					card.removeAttribute('hidden');
					app.container.appendChild(card);
					app.visibleCards[data[i].imdbID] = card;
				}

				card.querySelector("#movie-title").textContent = title;
				card.querySelector("#movie-poster").src = poster;
				card.querySelector("#movie-description").textContent = plot;
			}
		}
	}

	//Get the movie deta
	app.getMovie = function(id) {
		console.log("Caked");
		var url = "http://www.omdbapi.com/?apikey=b18781c4&i="+id;
		console.log(url);
		// Fetch the movie data
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					var response = JSON.parse(request.response);
					var results = response;
					var dataLastUpdated = new Date(results.Released);
					var id = results.imdbID;
					var title = results.Title;
					var poster = results.Poster;
					var plot = results.Plot;

					var card = app.visibleCards[results.id];
					if (!card) {
						card = app.cardTemplate.cloneNode(true);
						card.classList.remove('cardTemplate');
						card.querySelector('.movie-title').textContent = results.Title;
						card.removeAttribute('hidden');
						app.container.appendChild(card);
						app.visibleCards[results.imdbID] = card;
					}

					card.querySelector("#movie-title").textContent = title;
					card.querySelector("#movie-poster").src = poster;
					card.querySelector("#movie-description").textContent = plot;
				
				}
			} else {
				// Return the initial movie list since no data is available.
        		app.updateMovieList(initialMovieList);
			}
		};
		request.open('GET', url);
    	request.send();
	}

	/* Get the list of movies and update the list with the list.
	* getMovieList() first checks if the list is in the cache. If so, then
	* it gets the data and populates the list with the cached data. Then, 
	* getMovieList() goes to the network for fresh data. If the network request
	* goes through, then the list gets updated the second time */
	app.getMovieList = function(movies) {
		var url = "http://localhost/moviemango/movielist.php";
		/* Check if the service worker has already cached list. If the service
		* worker has cached data, display it while the app gets the new data. */
		if ('caches' in window) {
			caches.match(url).then(function(response) {
				if (response) {
					response.json().then(function updateFromCache(json){
						console.log("Cathed");
						var results = json.query.results;
						results.movies = movies;
						app.updateMovieList(results);
					});
				}
			});
		}
		// Fetch the latest data
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					var response = JSON.parse(request.response);
					var results = response;
					console.log(results.movies);
					// results.movies = movies;
					app.updateMovieList(results.movies);
				}
			} else {
				// Return the initial weather forecast since no data is available.
        		app.updateMovieList(initialMovieList);
			}
		};
		request.open('GET', url);
    	request.send();
	};

	// Iterate all of the cards and attempt to get the latest movie data
	app.updateMovies = function() {
		var id = Object.keys(app.visibleCards);
		keys.forEach(function(key) {
			app.getMovie(key);
		});
	};

	// Save list of movies to localStorage.
	app.saveSelectedMovies = function() {
		console.log("Called");
		var selectedMovies = JSON.stringify(app.selectedMovies);
		localStorage.selectedMovies = selectedMovies;
	};

	var initialMovieList = {
		Title:"Batman: The Killing Joke",Year:"2016",Rated:"R",Released:"25 Jul 2016",Runtime:"76 min",Genre:"Animation, Action, Crime",Director:"Sam Liu",Writer:"Brian Azzarello, Brian Bolland (based on the graphic novel illustrated by), Bob Kane (Batman created by), Bill Finger (Batman created by)",Actors:"Kevin Conroy, Mark Hamill, Tara Strong, Ray Wise",Plot:"As Batman hunts for the escaped Joker, the Clown Prince of Crime attacks the Gordon family to prove a diabolical point mirroring his own fall into madness.",Language:"English",Country:"USA",Awards:"1 win & 2 nominations.",Poster:"https://images-na.ssl-images-amazon.com/images/M/MV5BMTdjZTliODYtNWExMi00NjQ1LWIzN2MtN2Q5NTg5NTk3NzliL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",Ratings:[{Source:"Internet Movie Database",Value:"6.5/10"},{Source:"Rotten Tomatoes",Value:"45%"}],Metascore:"N/A",imdbRating:"6.5",imdbVotes:"36,529",imdbID:"tt4853102",Type:"movie",DVD:"02 Aug 2016",BoxOffice:"$442,331",Production:"The Answer Studio",Website:"N/A",Response:"True"
	}

	// TODO add startup code here
	app.selectedMovies = localStorage.selectedMovies;
	if (app.selectedMovies) {
		app.selectedMovies = JSON.parse(app.selectedMovies);
		app.selectedMovies.forEach(function(movie) {
			app.getMovie(movie.id);
		});
	} else {
		/* The user is using the app for the first time, or the user has not
		* saved any cities, so show the user some fake data. A real app in this
		* scenario could guess the user's location via IP lookup and then inject
		* that data into the page.
		*/
		app.updateMovieList(initialMovieList);
		app.selectedMovies = [
		{id: initialMovieList.imdbID, title: initialMovieList.Title,
		 poster: initialMovieList.Poster, plot: initialMovieList.Plot}
		];
		app.saveSelectedMovies();
	}

	//Add the service worker
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('./service-worker.js')
			.then(function() { console.log('Service Worker Registered'); });
	}
})();