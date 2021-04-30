import React from "react"
import ReactPlayer from "react-player"
import "./responsive-player.css"

const ResponsivePlayer = ({url, onProgress, playing,      playedSeconds, played, loadedSeconds, loaded}) =>{
        
    return (
      <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          url={url}
          width='100%'
          height='100%'
          controls={true}
          onProgress={onProgress}
          playing={playing}
          //onStart={onStart}
          //played= {onProgress.playedSeconds}

          
        />
      </div>
    )
}
export default ResponsivePlayer;