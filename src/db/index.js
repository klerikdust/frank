 const { Pool } = require(`pg`)

 //  Initialize client
const db = new Pool({
    connectionString: process.env.DB_CONSTRING
})

module.exports = {

    init: async () => {

        //  Handle connection error
        try {
            console.time(`db init`)
            //  Initialize client
            const client = await db.connect()

            //  Check user data table
            await client.query(`
                CREATE TABLE IF NOT EXISTS userdata (
                    user_id VARCHAR(45) NOT NULL
                    , name VARCHAR(45) NOT NULL
                    , registered_at TIMESTAMPTZ NOT NULL DEFAULT now()
                    , on_channel VARCHAR(45) NOT NULL
                )
            `)

            //  Check collected_artworks table
            await client.query(`
                CREATE TABLE IF NOT EXISTS collected_artworks (
                    author VARCHAR(45) NOT NULL
                    , url VARCHAR(450) NOT NULL
                    , channel_id VARCHAR(45) NOT NULL
                    , send_at TIMESTAMPTZ NOT NULL DEFAULT now()
                )
            `)

            //  Check featured table
            await client.query(`
                CREATE TABLE IF NOT EXISTS featured (
                    author VARCHAR(45) NOT NULL
                    , url VARCHAR(450) NOT NULL
                    , channel_id VARCHAR(45) NOT NULL
                    , heart_counts INTEGER NOT NULL DEFAULT 0
                    , featured_at TIMESTAMPTZ NOT NULL DEFAULT now()
                )
            `)

            //  Close session
            client.end()

            console.timeEnd(`db init`)

        } catch (e) {
            console.log(`init failure - ${e.message}`)
        }
    },

    registerPost: async (metadata = []) => {
        //  Handle connection error
        try {
            console.time(`Post saved in`)
            //  Initialize client
            const client = await db.connect()

            //  Register into collected_artworks
            await client.query(`
                INSERT INTO "collected_artworks" (author, url, channel_id)
                VALUES ($1, $2, $3)
            `, metadata)

            //  Close session
            client.end()
            console.timeEnd(`Post saved in`)

        } catch (e) {
            console.log(`registerPost failure - ${e}`)
        }     
    },

    featurePost: async (metadata = {}) => {
        //  Handle connection error
        try {
            console.time(`Post sent to #featured in`)

            //  Extracting metadata
            const params = [
                metadata.author,
                metadata.url,
                metadata.channel,
                metadata.heart_counts
            ]

            //  Initialize client
            const client = await db.connect()

            //  Register into featured
            await client.query(`
                INSERT INTO "featured" (author, url, channel_id, heart_counts)
                VALUES ($1, $2, $3, $4)
            `, params)

            //  Close session
            client.end()
            console.timeEnd(`Post sent to #featured in`)

        } catch (e) {
            console.log(`featurePost failure - ${e}`)
        }     
    },

    getFeaturedPostData: async (url = ``) => {
        //  Handle connection error
        try {
            console.time(`Retrieved featured post metadata in`)
            //  Initialize client
            const client = await db.connect()

            //  Get post data
            const res = await client.query(`
                SELECT featured_at FROM featured WHERE url = $1
            `, [url])

            //  Close session
            client.end()
            console.timeEnd(`Retrieved featured post metadata in`)

            //  Return result
            return res.rows[0]

        } catch (e) {
            console.log(`getFeaturedPostData failure - ${e}`)
        }          
    }
    
}