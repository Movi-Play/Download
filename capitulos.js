<script>
        document.addEventListener("DOMContentLoaded", async function() {
            const apiKey = 'c2a30192cfbf4e95acbb656bf3af6177';
            const tvShowLink = document.querySelector('.mobile_header.content a').href;
            const tvShowId = tvShowLink.split('/').pop();

            async function getSeasons(tvShowId) {
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}`);
                    const data = await response.json();
                    return data.seasons;
                } catch (error) {
                    console.error('Error fetching seasons:', error);
                    return [];
                }
            }

            async function getEpisodes(tvShowId, seasonNumber, language) {
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${apiKey}&language=${language}`);
                    const data = await response.json();
                    return data.episodes;
                } catch (error) {
                    console.error(`Error fetching episodes for season ${seasonNumber} in ${language}:`, error);
                    return [];
                }
            }

            async function updateEpisodeNames() {
                const seasons = await getSeasons(tvShowId);

                for (const season of seasons) {
                    const container = document.querySelector(`#T${season.season_number}`);
                    if (!container) continue;

                    let episodeCounter = 1;
                    let episodes = await getEpisodes(tvShowId, season.season_number, 'es-ES');

                    if (!episodes || episodes.length === 0) {
                        episodes = await getEpisodes(tvShowId, season.season_number, 'en-US');
                    }

                    episodes.forEach((episode) => {
                        const episodeDiv = container.querySelectorAll('.click.capt')[episodeCounter - 1];
                        if (episodeDiv && episodeDiv.textContent.trim() === 'Cap') {
                            episodeDiv.textContent = `Episodio ${episodeCounter}: ${episode.name}`;
                        }
                        episodeCounter++;
                    });
                }
            }

            await updateEpisodeNames();
        });
    </script>
