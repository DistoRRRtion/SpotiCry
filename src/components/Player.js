import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from '@fortawesome/free-solid-svg-icons';

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  songs,
  setSongs,
  setCurrentSong,
}) => {
  const activeLibraryHandler = (nextPrevios) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrevios.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);
  };

  // ф-ция играть/пауза
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);

    // 👈🏼 skip-back
    if (direction === 'skip-back') {
      if (currentIndex - 1 === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);

        if (isPlaying) audioRef.current.play();
        return;
      }
      await setCurrentSong(songs[currentIndex - 1]);
      activeLibraryHandler(songs[songs.length - 1]);
    }

    // 👉🏼 skip-forwerd
    if (direction === 'skip-forwerd') {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }

    if (isPlaying) audioRef.current.play();
  };

  // ф-ция форматирующая отображение времени в мин/сек
  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
    );
  };

  // ф-ция ручной перемотки
  const dragHeandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  // add styles
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  return (
    <div className='player'>
      <div className='time-control'>
        <p>{getTime(songInfo.currentTime)}</p>
        <div
          style={{
            background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})`,
          }}
          className='track'
        >
          <input
            min={0} // начало
            max={songInfo.duration || 0} // конец песни
            value={songInfo.currentTime} // текущий момент песни
            onChange={dragHeandler} // ручна перемотка
            type='range' // строка прокрутки трека
          />
          <div style={trackAnim} className='animate-track'></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : '0:00'}</p>
      </div>
      <div className='play-control'>
        <FontAwesomeIcon
          className='skip-back'
          icon={faAngleLeft}
          size='2x'
          onClick={() => skipTrackHandler('skip-back')}
        />
        <FontAwesomeIcon
          onClick={playSongHandler} // ф-ция старт/пауза
          className='play'
          icon={isPlaying ? faPause : faPlay}
          size='2x'
        />
        <FontAwesomeIcon
          className='skip-forward'
          icon={faAngleRight}
          size='2x'
          onClick={() => skipTrackHandler('skip-forwerd')}
        />
      </div>
    </div>
  );
};

export default Player;
