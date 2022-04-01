const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const thumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: 'How You Like That',
            singer: 'BlackPink',
            path: './assets/mp3/song1.mp3',
            img: './assets/img/song1.jpg',
        },
        {
            name: 'Kill This Love',
            singer: 'BlackPink',
            path: './assets/mp3/song2.mp3',
            img: './assets/img/song2.jfif',
        },
        {
            name: 'Ice Cream',
            singer: 'BlackPink',
            path: './assets/mp3/song3.mp3',
            img: './assets/img/song3.jpg',
        },
        {
            name: 'DDU-DU DDU-DU',
            singer: 'BlackPink',
            path: './assets/mp3/song4.mp3',
            img: './assets/img/song4.jpg'
        },
        {
            name: 'Boombayah',
            singer: 'BlackPink',
            path: './assets/mp3/song5.mp3',
            img: './assets/img/song5.png'
        },
        {
            name: 'Lalisa',
            singer: 'Lisa',
            path: './assets/mp3/song6.mp3',
            img: './assets/img/song6.jpeg'
        },
        {
            name: 'Money',
            singer: 'Lisa',
            path: './assets/mp3/song7.mp3',
            img: './assets/img/song7.png'
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        /* Scroll handle */
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop * 1.2;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        /* Play button handle */
        playBtn.onclick = function() {
            if (_this.isPlaying == false) {
                _this.isPlaying = true;
                player.classList.add('playing');
                audio.play();
                thumb.classList.add('rotating');
            } else {
                _this.isPlaying = false;
                player.classList.remove('playing');
                audio.pause();
                thumb.classList.remove('rotating');
            }
        }

        /* Mp3 change event */
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        /* Rewind mp3 */
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        /* Next song button handle */
        nextBtn.onclick = function() {
            if (_this.isRandom == true) {
                _this.randomSong();
            } else {

                _this.nextSong();
                _this.loadCurrentSong();
                if (_this.isPlaying == true) {
                    audio.play();
                }
                _this.render();
            }
        }

        /* Prev Song button handle */
        prevBtn.onclick = function() {
            if (_this.isRandom == true) {
                _this.randomSong();
            } else {
                _this.prevSong();
                _this.loadCurrentSong();
                if (_this.isPlaying == true) {
                    audio.play();
                }
                _this.render();
            }
        }

        /* Random Song */
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        /* Repeat button handle */
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);

        }

        /* Repeat song, Random song when it ended */
        audio.onended = function() {
            progress.value = 0;
            if (_this.isRepeat == true) {
                audio.play();
            } else if (_this.isRandom == true) {
                _this.randomSong();
            } else nextBtn.click();
        }

        /* Song active when click on */
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    if (_this.isPlaying == true) {
                        audio.play();
                    }
                    _this.render();

                } else {

                }
            }
        }

    },

    loadCurrentSong: function() {
        heading.innerHTML = this.currentSong.name;
        thumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        }
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
        this.render();
        audio.play();
    },

    start: function() {
        this.loadConfig();

        this.defineProperties();

        this.render();

        this.handleEvents();

        this.loadCurrentSong();

        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    }
}

app.start();