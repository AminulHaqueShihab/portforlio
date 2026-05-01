import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const visitorSchema = new Schema(
	{
		ip: { type: String, required: true, index: true },
		city: String,
		region: String,
		country: String,
		countryCode: String,
		latitude: Number,
		longitude: Number,
		isp: String,
		timezone: String,
		userAgent: String,
		browser: String,
		os: String,
		deviceType: {
			type: String,
			enum: ['mobile', 'tablet', 'desktop'],
			default: 'desktop',
		},
		referrer: String,
		language: String,
		path: String,
		visitorDeviceId: { type: String, maxlength: 36 },
		visitedAt: { type: Date, required: true, index: true },
		lastSeen: { type: Date, required: true, index: true },
		visitCount: { type: Number, default: 1, min: 1 },
	},
	{ timestamps: false }
);

visitorSchema.index({ ip: 1, lastSeen: -1 });
visitorSchema.index({ visitorDeviceId: 1, lastSeen: -1 }, { sparse: true });

export type VisitorDocument = InferSchemaType<typeof visitorSchema> & {
	_id: mongoose.Types.ObjectId;
};

const VisitorModel =
	mongoose.models.Visitor ?? mongoose.model('Visitor', visitorSchema);

export default VisitorModel;
