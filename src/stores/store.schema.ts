import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';

@Schema()
export class Store extends Document {
    @Prop({required: true, unique: true})
    name: string;

    @Prop({ default: true, required: true })
    takeOutInStore: boolean;

    @Prop({required: true})
    shippingTimeInDays: number;

    @Prop({
        type: { type: String, default: 'Point', enum: ['Point'], required: true },
        coordinates: { type: [Number] },
    })
    location: { coordinates: [number, number] };

    @Prop({required: true})
    address1: string;

    @Prop({required: true})
    address2: string;

    @Prop()
    address3: string;

    @Prop({required: true})
    city: string;

    @Prop()
    district: string;

    @Prop({required: true})
    state: string;

    @Prop({required: true})
    type: string;

    @Prop({required: true, default: 'BR'})
    country: string;

    @Prop({required: true})
    postalCode: string;

    @Prop({required: true})
    telephoneNumber: string;

    @Prop({required: true})
    emailAddress: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

StoreSchema.index({ location: '2dsphere' });
StoreSchema.plugin(mongoosePaginate);
