document.addEventListener('DOMContentLoaded', function() {
    const matchesContainer = document.getElementById('matches-container');
    const leagueName = document.title; 
    const showWatchedButton = document.getElementById('toggle-favorites-btn');

    let favorites = new Set(JSON.parse(localStorage.getItem('favorites')) || []);
    let showingFavorites = false;

    console.log('Document title:', leagueName); 

    const leagueIdMap = {
        'Premier League Anglia': '39',
        'Bundesliga Niemcy': '78',
        'La Liga Hiszpania': '140',
        'Serie A Włochy': '135',
        'Ligue 1 Francja': '61',
        'Serie B Włochy': '94',
        'Ligue 2 Francja': '79',
        'La Liga 2 Hiszpania': '141',
        'Championship Anglia': '40',
        'Bundesliga 2 Niemcy': '79'
    };

    console.log('League ID map:', leagueIdMap);

    function fetchMatchesData(leagueId) {
        const apiKey = '3fec4dd49e484f687636801e51502f7a';
        fetch(`https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=2024`, {
            "method": "GET",
            "headers": {
                "x-apisports-key": apiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data);
            if (data && data.response) {
                displayMatchesData(data.response);
            } else {
                matchesContainer.innerHTML = '<p>Nie znaleziono meczów dla tej ligi.</p>';
            }
        })
        .catch(error => {
            matchesContainer.innerHTML = '<p>Wystąpił błąd podczas pobierania danych meczów.</p>';
            console.error('Error fetching matches data:', error);
        });
    }

    function displayMatchesData(matches) {
        matchesContainer.innerHTML = '';
        const now = new Date();
        matches
            .filter(match => {
                const matchDate = new Date(match.fixture.date);
                return matchDate > now && matchDate.getFullYear() === 2024;
            })
            .forEach(match => {
                const matchDiv = document.createElement('div');
                matchDiv.classList.add('match-item');

                const star = document.createElement('span');
                star.innerHTML = '&#9734;';
                star.classList.add('star');
                star.onclick = () => toggleFavorite(match.fixture.id, star);
                star.setAttribute('data-id', match.fixture.id);
                if (favorites.has(match.fixture.id)) {
                    star.classList.add('favorite');
                }

                matchDiv.innerHTML = `
                <div class="teams-logos">
                    <img src="${match.teams.home.logo}" alt="${match.teams.home.name} logo" class="team-logo">
                    <img src="${match.teams.away.logo}" alt="${match.teams.away.name} logo" class="team-logo">
                </div>
                <h3>${match.teams.home.name} vs ${match.teams.away.name}</h3>
                <p>Data: ${new Date(match.fixture.date).toLocaleDateString()}</p>
                <p>Godzina: ${new Date(match.fixture.date).toLocaleTimeString()}</p>
                <p>Stadion: ${match.fixture.venue.name}</p>
                `;
                const actions = document.createElement('div');
                actions.classList.add('match-actions');
                actions.appendChild(star);
                matchDiv.appendChild(actions);

                matchesContainer.appendChild(matchDiv);
            });

        if (showingFavorites) {
            toggleDisplayMode(); 
        }
    }

    function toggleFavorite(matchId, star) {
        matchId = matchId.toString();
        if (favorites.has(matchId)) {
            favorites.delete(matchId);
            star.classList.remove('favorite');
        } else {
            favorites.add(matchId);
            star.classList.add('favorite');
        }
        localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
        console.log('Updated favorites:', favorites);
    }

    window.toggleDisplayMode = function() {
        showingFavorites = !showingFavorites;
        const button = document.getElementById('toggle-favorites-btn');
        const matchItems = document.querySelectorAll('.match-item');

        console.log('Showing favorites:', showingFavorites);

        if (showingFavorites) {
            button.textContent = 'Pokaż wszystkie';
            matchItems.forEach(item => {
                const matchId = item.querySelector('.star').getAttribute('data-id');
                console.log('matchId:', matchId, 'favorites:', Array.from(favorites));
                if (!favorites.has(matchId)) {
                    item.style.display = 'none';
                    console.log('nie ulubione :', matchId);
                } else {
                    item.style.display = 'block';
                    console.log('nie ulubione :', matchId);
                }
            });
        } else {
            button.textContent = 'Pokaż obserwowane mecze';
            matchItems.forEach(item => {
                item.style.display = 'block';
                console.log('ulubione :', favorites);
            });
        }
    };

    const leagueId = leagueIdMap[leagueName];
    console.log('Selected League ID:', leagueId);
    if (leagueId) {
        fetchMatchesData(leagueId);
    } else {
        matchesContainer.innerHTML = '<p>Nie znaleziono danych dla tej ligi.</p>';
    }
});