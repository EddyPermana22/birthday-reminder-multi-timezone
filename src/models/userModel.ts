import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface ILocation {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  pop: number;
  country: string;
  iso2: string;
  iso3: string;
  province: string;
  timezone: string;
}

export interface IUser extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
  birthdateMonth: number;
  birthdateDay: number;
  thisYearBirthdayNotificationStatus: "not_schedule" | "scheduled" | "sent";
  thisYearBirthdayNotificationJobId?: string;
  location: ILocation;
  isDeleted: boolean;
}

const locationSchema: Schema = new mongoose.Schema(
  {
    city: { type: String },
    city_ascii: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    pop: { type: Number },
    country: { type: String },
    iso2: { type: String },
    iso3: { type: String },
    province: { type: String },
    timezone: { type: String },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: true,
  }
);

const userSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    birthdateMonth: {
      type: Number,
      required: true,
    },
    birthdateDay: {
      type: Number,
      required: true,
    },
    thisYearBirthdayNotificationStatus: {
      type: String,
      enum: ["not_schedule", "scheduled", "sent"],
      default: "not_schedule",
    },
    thisYearBirthdayNotificationJobId: {
      type: String,
    },
    location: locationSchema,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    id: false,
  }
);

userSchema.index({ userId: 1 }, { unique: true });
userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ birthdate: 1 });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
