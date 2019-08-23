const { Pool } = require(`pg`)

//  Initialize client
const db = new Pool({
	connectionString: process.env.DB_CONSTRING
})

module.exports = () => {

	//	Setup container
	let container = {}


	/**
	 * 	Standard-use for single query
	 *  @param {String} name used to describe the given query. Optional.
	 * 	@param {String} request sql query to be executed.
	 *  @param {Array} components parameters to be inserted into sql query.
	 *  @param {Boolean} getValue toggle this on if you are pulling returned value from query.
	 */
	container._query = async ({name = ``, request = ``, components = [], getValue = false}) => {

		//	Handle if {name} parameter wasn't specified.
		if (!name) name = `query`

		//  Initialize client
		const client = await db.connect()

		try {
			console.time(`✔ ${name}`)
			//  Run query
			let res = await client.query(request, components)

			//	Return value if prompted
			if (getValue) {
				client.end()
				console.timeEnd(`✔ ${name}`)
				return res.rows
			}

			res
			//  Close client
			client.end()
			console.timeEnd(`✔ ${name}`)

		} catch (e) {
			console.log(`✘ ${name} has failed to run. ${e}`)
		}     		
	}


	/**
	 * 	This will be used on startup
	 * 	@param {Boolean} connectionOnly Use only in experimental/dev. Not for production.
	 */
	container.init = async ({connectionOnly = false}) => {

		console.clear()
		console.log(`--BEGIN DATABASE VALIDATION--`)

		//  Handle connection error
		try {

			//	If prompted to only check the db connection
			if (connectionOnly) {
				console.time(`db established in`)
				//  Initialize client
				const client = await db.connect()
				//  Close session
				client.end()
				return console.timeEnd(`db established in`)
			}


			//  Check user_main table
			await container._query({
				name: `validate_user_main`,
				request: `
					CREATE TABLE IF NOT EXISTS user_main (
						user_id VARCHAR(45) NOT NULL,
						name VARCHAR(45) NOT NULL,
						registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
						on_channel VARCHAR(45) NOT NULL
					)`,
				components: []
			})


			//  Check user_exp table
			await container._query({
				name: `validate_user_exp`,
				request: `
					CREATE TABLE IF NOT EXISTS user_exp (
						id VARCHAR(45) NOT NULL, 
						level INTEGER NOT NULL DEFAULT 1, 
						currentexp INTEGER NOT NULL DEFAULT 0, 
						maxexp INTEGER NOT NULL DEFAULT 150, 
						curvexp INTEGER NOT NULL DEFAULT 150, 
						last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
					)`,
				components: []
			})


			//  Check user_inventory table
			await container._query({
				name: `validate_user_inventory`,
				request: `
					CREATE TABLE IF NOT EXISTS user_inventory (
						id VARCHAR(45) NOT NULL, 
						item_name VARCHAR(45) NOT NULL, 
						quantity INTEGER NOT NULL DEFAULT 0, 
						last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
					)`,
				components: []
			})


			//  Check user_artdata table
			await container._query({
				name: `validate_user_artdata`,
				request: `
					CREATE TABLE IF NOT EXISTS user_artdata (
						id VARCHAR(45) NOT NULL, 
						received_favs INTEGER NOT NULL DEFAULT 0, 
						given_favs INTEGER NOT NULL DEFAULT 0
					)`,
				components: []
			})


			//  Check collected_artworks table
			await container._query({
				name: `validate_collected_artworks`,
				request: `
					CREATE TABLE IF NOT EXISTS collected_artworks (
						author VARCHAR(45) NOT NULL, 
						url VARCHAR(450) NOT NULL, 
						channel_id VARCHAR(45) NOT NULL, 
						send_at TIMESTAMPTZ NOT NULL DEFAULT now()
				  	)`,
				components: []
			})


			//  Check featured table
			await container._query({
				name: `validate_featured`,
				request: `
					CREATE TABLE IF NOT EXISTS featured (
						author VARCHAR(45) NOT NULL, 
						url VARCHAR(450) NOT NULL, 
						channel_id VARCHAR(45) NOT NULL, 
						heart_counts INTEGER NOT NULL DEFAULT 0, 
						featured_at TIMESTAMPTZ NOT NULL DEFAULT now()
				  	)`,
				components: []
			})
			
			
		} catch (e) {
			console.log(`Initialization has failed . .\n${e.message}`)
		}
	}


	/**
	 * From this point, all methods below are just a wrapper to hide the query complexity.
	 * 
	 * 
	 * Add new fav point
	 * @param {Object|UserID} user_id parameters to be inserted into sql query.
	 */
	container.addNewFavPoint = async ({user_id = ``}) => {
		await container._query({
			name: `adding_new_fav_point`,
			request: ` 
				UPDATE user_artdata
				SET received_favs = received_favs + 1
				WHERE id = $1
				`,
			components: [user_id]
		})
	}


	/**
	 * Watch and register the post
	 * @param {Object|StringUserID} user_id
	 * @param {Object|StringURL} url
	 * @param {Object|StringChannelID} channel_id
	 */
	container.registerPost = async ({user_id = ``, url = ``, channel_id = ``}) => {
		await container._query({
			name: `registering_post`,
			request: `
				INSERT INTO "collected_artworks" (author, url, channel_id)
				VALUES ($1, $2, $3)`,
			components: [user_id, url, channel_id]
				
		})
	}


	/**
	 * Register post metadata and send it to #featured
	 * @param {Object|StringUserID} user_id
	 * @param {Object|StringURL} url
	 * @param {Object|StringChannelID} channel_id
	 * @param {Object|Integer} heart_counts
	 */
	container.featurePost = async ({user_id = ``, url = ``, channel_id = ``, heart_counts = 0}) => {
		await container._query({
			name: `featuring_post`,
			request: `
				INSERT INTO "featured" (author, url, channel_id, heart_counts)
				VALUES ($1, $2, $3, $4)`,
			components: [user_id, url, channel_id, heart_counts]			
		})
	}		


	/**
	 * Get post metadata by url
	 * @param {Object|StringURL} url as referrence
	 */
	container.getFeaturedPostData = async ({url = ``}) => {
		return await container._query({
			name: `fetch_featuredpost_metadata`,
			request: `SELECT * FROM featured WHERE url = $1`,
			components: [url],
			getValue: true		
		})
	}
    
	
	return container
}