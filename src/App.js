import { useState, useRef } from 'react';
// Import Styles
import './styles/App.scss';
// Import Components
import Player from '../src/components/Player';
import Song from '../src/components/Song';
import Library from './components/Library';
import Nav from './components/Nav';
// Import Util
import data from './data';

function App() {
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);

  const audioRef = useRef(null); // получаем аудио элемент

  // ф-ция указывающая время в песне
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime; // время проигрывания
    const duration = e.target.duration; // общее время песни
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);

    const animationPercentage = Math.round(
      roundedCurrent / (roundedDuration / 100)
    );
    // const animationPercentage = Math.round(
    //   (roundedCurrent / roundedDuration) * 100
    // );

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage,
    }); // указ время в стейт
  };

  const songEndHandler = () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    // if (isPlaying) audioRef.current.play();

    // const play = audioRef.current.play();
    // if (play !== undefined) {
    //   play.then((res) => {
    //     audioRef.current.play();
    //     console.log('undefined');
    //   });
    //   console.log(play);
    // }

    setTimeout(() => audioRef.current.play(), 1);
  };

  return (
    <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        audioRef={audioRef}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        songs={songs}
        setSongs={setSongs}
        setCurrentSong={setCurrentSong}
      />
      <Library
        songs={songs}
        setSongs={setSongs}
        setCurrentSong={setCurrentSong}
        audioRef={audioRef}
        isPlaying={isPlaying}
        libraryStatus={libraryStatus}
      />
      <audio
        onLoadedMetadata={timeUpdateHandler} // сразу загружает время песни(до нажатия на кнопку)
        onTimeUpdate={timeUpdateHandler} // получаем время песни
        ref={audioRef} // получаем ссылку на элемент
        src={currentSong.audio} // получаем саму песню
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
