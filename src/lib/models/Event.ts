import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const eventSchema = new Schema(
	{
		visitorId: { type: Schema.Types.ObjectId, ref: 'Visitor', index: true },
		visitorDeviceId: { type: String, maxlength: 36, index: true },
		sessionId: { type: String, required: true, index: true },
		type: {
			type: String,
			required: true,
			enum: [
				'click',
				'project_click',
				'section_view',
				'page_duration',
				'scroll_depth',
			],
		},
		label: { type: String },
		path: { type: String, required: true },
		value: { type: Number },
		metadata: { type: Schema.Types.Mixed },
		timestamp: { type: Date, required: true, default: Date.now, index: true },
	},
	{ timestamps: false }
);

eventSchema.index({ visitorId: 1, timestamp: -1 });
eventSchema.index({ type: 1, timestamp: -1 });
eventSchema.index({ sessionId: 1, timestamp: 1 });

export type EventDocument = InferSchemaType<typeof eventSchema> & {
	_id: mongoose.Types.ObjectId;
};

const EventModel =
	mongoose.models.Event ?? mongoose.model('Event', eventSchema);

export default EventModel;
