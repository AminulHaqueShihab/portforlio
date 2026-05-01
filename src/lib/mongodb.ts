import mongoose from 'mongoose';

function mongodbUri(): string {
	const raw = process.env.MONGODB_URI;
	if (!raw) {
		throw new Error(
			'Please define MONGODB_URI inside .env.local (or env) for MongoDB connection'
		);
	}
	let uri = raw.trim();
	if (
		(uri.startsWith('"') && uri.endsWith('"')) ||
		(uri.startsWith("'") && uri.endsWith("'"))
	) {
		uri = uri.slice(1, -1).trim();
	}
	return uri;
}

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	// eslint-disable-next-line no-var
	var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache ?? {
	conn: null,
	promise: null,
};

if (!global.mongooseCache) {
	global.mongooseCache = cached;
}

async function connectDB(): Promise<typeof mongoose> {
	if (cached.conn) {
		return cached.conn;
	}
	if (!cached.promise) {
		const mechanism = process.env.MONGODB_AUTH_MECHANISM?.trim();
		const opts: mongoose.ConnectOptions = {
			bufferCommands: false,
			...(mechanism
				? { authMechanism: mechanism as mongoose.ConnectOptions['authMechanism'] }
				: {}),
		};
		cached.promise = mongoose.connect(mongodbUri(), opts).then((m) => m);
	}
	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}
	return cached.conn;
}

export default connectDB;
