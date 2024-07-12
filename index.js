document.addEventListener('DOMContentLoaded', function() {
    const leaguesContainer = document.getElementById('leagues-container');
    const API_KEY = '3';

    const leagueNamesMap = {
        'English Premier League': 'Premier League Anglia',
        'English League Championship': 'Championship Anglia',
        'German Bundesliga': 'Bundesliga Niemcy',
        'German 2. Bundesliga': '2. Bundesliga Niemcy',
        'Italian Serie A': 'Serie A Włochy',
        'Italian Serie B': 'Serie B Włochy',
        'French Ligue 1': 'Ligue 1 Francja',
        'French Ligue 2': 'Ligue 2 Francja',
        'Spanish La Liga': 'La Liga Hiszpania',
        'Spanish La Liga 2': 'La Liga 2 Hiszpania'
    };

    const orderedLeagues = [
        'English Premier League',
        'Spanish La Liga',
        'German Bundesliga',
        'Italian Serie A',
        'French Ligue 1',
        'English League Championship',
        'Spanish La Liga 2',
        'German 2. Bundesliga',
        'Italian Serie B',
        'French Ligue 2'
    ];

    const leagueClasses = {
        'English Premier League': 'league-epl',
        'English League Championship': 'league-championship',
        'German Bundesliga': 'league-bundesliga',
        'German 2. Bundesliga': 'league-bundesliga2',
        'Italian Serie A': 'league-seriea',
        'Italian Serie B': 'league-serieb',
        'French Ligue 1': 'league-ligue1',
        'French Ligue 2': 'league-ligue2',
        'Spanish La Liga': 'league-laliga',
        'Spanish La Liga 2': 'league-laliga2'
    };

    function fetchLeaguesData() {
        fetch(`https://www.thesportsdb.com/api/v1/json/${API_KEY}/all_leagues.php`)
            .then(response => response.json())
            .then(data => {
                displayLeaguesData(data.leagues);
            })
            .catch(error => {
                leaguesContainer.innerHTML = '<p>Wystąpił błąd podczas pobierania danych.</p>';
                console.error('Error fetching leagues data:', error);
            });
    }

    function displayLeaguesData(leagues) {
        leaguesContainer.innerHTML = '';

        orderedLeagues.forEach(orderedLeague => {
            const league = leagues.find(l => l.strLeague === orderedLeague);
            if (league && league.strSport === 'Soccer') {
                const leagueDiv = document.createElement('a');
                const leagueName = leagueNamesMap[league.strLeague].toLowerCase().replace(/ /g, '-');
                leagueDiv.href = `${leagueName}.html`;
                leagueDiv.classList.add('league-item');
                leagueDiv.classList.add(leagueClasses[league.strLeague]);
                leagueDiv.dataset.target = `${leagueName}.html`;
                leagueDiv.innerHTML = `
                    <h2>${leagueNamesMap[league.strLeague]}</h2>
                `;
                leagueDiv.addEventListener('click', handleLeagueClick);
                leaguesContainer.appendChild(leagueDiv);
            }
        });
    }
    function handleLeagueClick(event) {
        event.preventDefault();
        const targetUrl = event.currentTarget.dataset.target;
        const animationDiv = document.getElementById('expand-animation');
        animationDiv.style.width = '100vw';
        animationDiv.style.height = '100vh';
        animationDiv.style.background = 'linear-gradient(135deg, #666699, #4ca1af)';

        setTimeout(() => {
            window.location.href = targetUrl;
        }, 500);
    }
    fetchLeaguesData();
});


