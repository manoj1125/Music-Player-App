// Database of Songs (id, name, artist, img, genre, source)
const songs = [
    {
        id: 1,
        name: "Blinding Lights",
        artist: "The Weeknd",
        img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300",
        genre: "Pop",
        source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        name: "Electric Dreams",
        artist: "Synthwave Boy",
        img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300",
        genre: "Electronic",
        source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        name: "Rock Anthem",
        artist: "The Crushers",
        img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300",
        genre: "Rock",
        source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: 4,
        name: "Urban Flow",
        artist: "MC Street",
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300",
        genre: "Hip-Hop",
        source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        id: 5,
        name: "Midnight Groove",
        artist: "Luna",
        img: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300",
        genre: "Pop",
        source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
];

// Application State
let currentSongIndex = 0;
let currentGenre = "all";
let activePlaylistName = null;

// Playlists structure: { "PlaylistName": [songId1, songId2] }
let playlists = {
    "Favorites": [1, 3]
};

// DOM Elements
const audioPlayer = document.getElementById("audio-player");
const songListContainer = document.getElementById("song-list-container");
const currentSongImg = document.getElementById("current-song-img");
const currentSongTitle = document.getElementById("current-song-title");
const currentSongArtist = document.getElementById("current-song-artist");
const playPauseBtn = document.getElementById("play-pause-btn");
const playlistTargetSelect = document.getElementById("playlist-target-select");
const playlistsNavContainer = document.getElementById("playlists-nav-container");
const playlistSongsList = document.getElementById("playlist-songs-list");
const playlistDetailsTitle = document.querySelector(".playlist-details-view h3");

// Initial Load
window.addEventListener("DOMContentLoaded", () => {
    showSongs(songs);
    renderPlaylistsUI();
    if (songs.length > 0) {
        loadSongMetadata(0);
    }
});

// 1. Toggle Theme Function
function toggleTheme() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute("data-theme");
    const themeIcon = document.getElementById("theme-icon");
    const themeText = document.getElementById("theme-text");

    if (currentTheme === "dark") {
        htmlEl.setAttribute("data-theme", "light");
        themeIcon.className = "fa-solid fa-sun";
        themeText.innerText = "Dark Mode";
    } else {
        htmlEl.setAttribute("data-theme", "dark");
        themeIcon.className = "fa-solid fa-moon";
        themeText.innerText = "Light Mode";
    }
}

// 2. Show Songs Function & Filtering
function showSongs(songsToRender) {
    songListContainer.innerHTML = "";
    
    if (songsToRender.length === 0) {
        songListContainer.innerHTML = `<p style="text-align:center; color:var(--text-secondary); padding:20px;">No songs found.</p>`;
        return;
    }

    songsToRender.forEach((song) => {
        const songEl = document.createElement("div");
        songEl.className = "song-item";
        songEl.innerHTML = `
            <img src="${song.img}" alt="${song.name}">
            <div class="song-info-mini">
                <h4>${song.name}</h4>
                <p>${song.artist} • <span style="color:var(--accent-color);">${song.genre}</span></p>
            </div>
        `;
        songEl.onclick = () => {
            const originalIndex = songs.findIndex(s => s.id === song.id);
            renderCurrentSong(originalIndex);
        };
        songListContainer.appendChild(songEl);
    });
}

function onGenreChange() {
    const selectEl = document.getElementById("genre-select");
    currentGenre = selectEl.value;
    filterSongs();
}

function filterSongs() {
    const searchQuery = document.getElementById("song-search").value.toLowerCase();
    
    let filtered = songs.filter(song => {
        const matchesGenre = (currentGenre === "all" || song.genre === currentGenre);
        const matchesSearch = song.name.toLowerCase().includes(searchQuery) || song.artist.toLowerCase().includes(searchQuery);
        return matchesGenre && matchesSearch;
    });

    showSongs(filtered);
}

// 3. Render Current Song (Song Card & Playback)
function renderCurrentSong(index) {
    if (index < 0 || index >= songs.length) return;
    currentSongIndex = index;
    loadSongMetadata(currentSongIndex);
    playAudio();
}

function loadSongMetadata(index) {
    const song = songs[index];
    currentSongImg.src = song.img;
    currentSongTitle.innerText = song.name;
    currentSongArtist.innerText = song.artist;
    audioPlayer.src = song.source;
}

function playAudio() {
    audioPlayer.play().then(() => {
        playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    }).catch(err => {
        console.log("Playback error or browser autoplay restriction:", err);
    });
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
}

// 4. Next & Previous Controls (with Edge Case Handling)
function playNext() {
    currentSongIndex = (currentSongIndex + 1) % songs.length; // Loops back to start if at end
    renderCurrentSong(currentSongIndex);
}

function playPrev() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; // Loops to end if at start
    renderCurrentSong(currentSongIndex);
}

// 5. Playlist Management & Functions
function createPlaylist() {
    const inputEl = document.getElementById("new-playlist-name");
    const playlistName = inputEl.value.trim();

    if (!playlistName) {
        alert("Please enter a valid playlist name.");
        return;
    }

    if (playlists[playlistName]) {
        alert("Playlist already exists!");
        return;
    }

    playlists[playlistName] = [];
    inputEl.value = "";
    renderPlaylistsUI();
}

function renderPlaylistsUI() {
    playlistsNavContainer.innerHTML = "";
    playlistTargetSelect.innerHTML = `<option value="">Select Playlist</option>`;

    const playlistKeys = Object.keys(playlists);

    if (playlistKeys.length === 0) {
        playlistsNavContainer.innerHTML = `<p style="color:var(--text-secondary); font-size:0.85rem;">No playlists created yet.</p>`;
        return;
    }

    playlistKeys.forEach(name => {
        // Populate playlist chips
        const chip = document.createElement("div");
        chip.className = `playlist-chip ${activePlaylistName === name ? 'active' : ''}`;
        chip.innerText = name;
        chip.onclick = () => selectPlaylist(name);
        playlistsNavContainer.appendChild(chip);

        // Populate dropdown inside Song Card
        const opt = document.createElement("option");
        opt.value = name;
        opt.innerText = name;
        playlistTargetSelect.appendChild(opt);
    });

    if (!activePlaylistName && playlistKeys.length > 0) {
        selectPlaylist(playlistKeys[0]);
    } else if (activePlaylistName && playlists[activePlaylistName]) {
        renderPlaylistsSong(activePlaylistName);
    } else {
        playlistDetailsTitle.innerText = "Select a playlist to view tracks";
        playlistSongsList.innerHTML = "";
    }
}

function selectPlaylist(name) {
    activePlaylistName = name;
    document.querySelectorAll(".playlist-chip").forEach(chip => {
        if (chip.innerText === name) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });
    renderPlaylistsSong(name);
}

function addToPlaylist() {
    const targetPlaylist = playlistTargetSelect.value;
    if (!targetPlaylist) {
        alert("Please select a target playlist first.");
        return;
    }

    const currentSong = songs[currentSongIndex];
    if (playlists[targetPlaylist].includes(currentSong.id)) {
        alert(`"${currentSong.name}" is already in "${targetPlaylist}"!`);
        return;
    }

    playlists[targetPlaylist].push(currentSong.id);
    alert(`Added "${currentSong.name}" to "${targetPlaylist}"!`);
    renderPlaylistsSong(targetPlaylist);
}

function renderPlaylistsSong(playlistName) {
    activePlaylistName = playlistName;
    playlistDetailsTitle.innerText = `Tracks in: ${playlistName}`;
    playlistSongsList.innerHTML = "";

    const songIds = playlists[playlistName] || [];

    if (songIds.length === 0) {
        playlistSongsList.innerHTML = `<p style="color:var(--text-secondary); font-size:0.85rem; padding:10px;">Playlist is empty.</p>`;
        return;
    }

    songIds.forEach(id => {
        const song = songs.find(s => s.id === id);
        if (!song) return;

        const songEl = document.createElement("div");
        songEl.className = "song-item";
        songEl.innerHTML = `
            <img src="${song.img}" alt="${song.name}">
            <div class="song-info-mini" style="flex-grow:1;">
                <h4>${song.name}</h4>
                <p>${song.artist}</p>
            </div>
            <button class="remove-btn" onclick="event.stopPropagation(); removeFromPlaylist('${playlistName}', ${song.id})" title="Remove track"><i class="fa-solid fa-trash"></i></button>
        `;
        songEl.onclick = () => {
            const originalIndex = songs.findIndex(s => s.id === song.id);
            renderCurrentSong(originalIndex);
        };
        playlistSongsList.appendChild(songEl);
    });
}

function removeFromPlaylist(playlistName, songId) {
    playlists[playlistName] = playlists[playlistName].filter(id => id !== songId);
    renderPlaylistsSong(playlistName);
}

function filterPlaylists() {
    const query = document.getElementById("playlist-search").value.toLowerCase();
    const chips = document.querySelectorAll(".playlist-chip");
    chips.forEach(chip => {
        const name = chip.innerText.toLowerCase();
        if (name.includes(query)) {
            chip.style.display = "block";
        } else {
            chip.style.display = "none";
        }
    });
}