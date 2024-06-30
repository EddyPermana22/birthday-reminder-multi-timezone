import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

// Function to get the ordinal suffix
function getOrdinalSuffix(number: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = number % 100;
  return suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
}

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
}

class BirthdayNotificationService {
  static async sendBirthdayNotification(user: IUser): Promise<any> {
    try {
      const birthdayMessageEndpoint = process.env.BIRTHDAY_MESSAGE_ENDPOINT;

      if (!birthdayMessageEndpoint) {
        throw new Error(
          "BIRTHDAY_MESSAGE_ENDPOINT is not defined in environment variables"
        );
      }

      const { firstName, lastName, email, birthdate } = user;

      const age = dayjs().diff(birthdate, "year");

      const message = `
Hey, ${firstName} ${lastName},

Today, ${dayjs(birthdate).format(
        "dddd, D MMMM YYYY"
      )}, is a very special day because it's your birthday! On this wonderful occasion, we want to take a moment to celebrate you and all the amazing things you bring into the lives of those around you.

May this year bring you even more success, happiness, and unforgettable memories. We hope your birthday is filled with joy, laughter, and the company of loved ones. You deserve all the best that life has to offer.

Happy ${age}${getOrdinalSuffix(
        age
      )} birthday, ${firstName}! Here's to many more years of health, happiness, and prosperity.

Warmest wishes,
The Team
`;

      const response = await axios({
        method: "POST",
        url: birthdayMessageEndpoint,
        data: {
          email,
          message,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Failed to send birthday notification:", error.message);
      throw error;
    }
  }
}

export default BirthdayNotificationService;
