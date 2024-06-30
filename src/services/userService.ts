import cityTimezones from 'city-timezones';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import User, { IUser, ILocation } from '../models/userModel';
import { CustomError } from '../middlewares/errorHandler';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IUserData {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
  birthdateMonth?: number;
  birthdateDay?: number;
  thisYearBirthdayNotificationStatus?: 'not_schedule' | 'scheduled' | 'sent';
  thisYearBirthdayNotificationJobId?: string;
  location: ILocation;
  isDeleted?: boolean;
}

class UserService {
  static async createUser(userData: IUserData): Promise<IUser> {
    const { birthdate, location } = userData;

    const cityLookup = cityTimezones.lookupViaCity(location.city);

    if (cityLookup.length === 0) {
      throw new CustomError(
        'Invalid location, please provide a valid city name.',
        400
      );
    }

    userData.location = cityLookup[0];

    userData.birthdateMonth = dayjs(birthdate).month() + 1;
    userData.birthdateDay = dayjs(birthdate).date();

    const user = new User(userData);
    return await user.save();
  }

  static async getAllUsers(): Promise<IUser[]> {
    return await User.find({
      isDeleted: false,
    });
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findOne({
      userId,
      isDeleted: false,
    });
  }

  static async updateUserByUserId(userId: string, userData: Partial<IUserData>): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      {
        userId,
        isDeleted: false,
      },
      userData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  static async deleteUserById(userId: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { userId, isDeleted: false },
      { isDeleted: true },
      {
        new: true,
      }
    );
  }

  static async batchUpdateUser(bulkOps: any): Promise<any> {
    return await User.bulkWrite(bulkOps);
  }

  static async findUsersAtNextMidnightWithBirthday(): Promise<IUser[]> {
    const tommorowUTC = dayjs.utc().add(1, 'day');

    const currentMonth = tommorowUTC.month() + 1;
    const currentDay = tommorowUTC.date();

    const users = await User.find({
      birthdateMonth: currentMonth,
      birthdateDay: currentDay,
      thisYearBirthdayNotificationStatus: 'not_schedule',
      'location.timezone': { $exists: true },
      isDeleted: false,
    });

    const usersAtMidnightWithBirthday = users.filter((user) => {
      const userTimezone = user.location.timezone;
      const userLocalTime = tommorowUTC.tz(userTimezone);
      return userLocalTime.hour() === 0 && userLocalTime.minute() === 0;
    });

    return usersAtMidnightWithBirthday;
  }

  static async findUsersAlreadyNotified7DaysAfterBirthday(): Promise<IUser[]> {
    const sevenDaysAgoUTC = dayjs.utc().subtract(7, 'day');

    const currentMonth = sevenDaysAgoUTC.month() + 1;
    const currentDay = sevenDaysAgoUTC.date();

    const users = await User.find({
      birthdateMonth: currentMonth,
      birthdateDay: currentDay,
      thisYearBirthdayNotificationStatus: 'sent',
      thisYearBirthdayNotificationJobId: { $exists: true },
    });

    return users;
  }
}

export default UserService;