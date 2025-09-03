import { randomUUID } from "node:crypto";
import { sql} from "./db.js"; 

export class dataBasePostgres {
  #videos = new Map();

  async create(video) {
    
    const videos = await sql`INSERT INTO videos (title, descripition, duration) VALUES (${video.title}, ${video.descripition}, ${video.duration}) RETURNING *`
    return videos
  }
    

   async list(search) {
    let videos
    if (search) {
       videos = await sql`SELECT * FROM videos WHERE title ILIKE ${'%' + search + '%'  }`
    } else {
      videos = await sql`SELECT * FROM videos`
    }

    return videos

  }

  async edit(videoID, video) {
    const { title, descripition, duration } = video

    await sql`UPDATE videos SET  title = ${title}, descripition = ${descripition}, duration = ${duration} WHERE id = ${videoID}`
  }

  async delete(videoID) {
    await sql`DELETE FROM videos WHERE id = ${videoID}`
  }

}
