import { randomUUID } from "node:crypto";

export class dataBaseMemory {
  #videos = new Map();

  create(video) {
    const videoID = randomUUID();

    this.#videos.set(videoID, video);
  }

  list(search) {
    return Array.from(this.#videos.entries()).map((videoArray) => {
      const id = videoArray[0];
      const video = videoArray[1];
      
      return {
        id,
        ...video
        };
    
      })
      .filter(video => {
        if(search) {
          return video.title.includes(search)
        }
        return true
      });
  }

  edit(videoID, video) {
    this.#videos.set(videoID, video);
  }

  delete(videoID) {
    this.#videos.delete(videoID);
  }

}
