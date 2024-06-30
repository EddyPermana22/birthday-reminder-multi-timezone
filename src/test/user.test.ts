import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import mongoDBConnection from "../src/configs/mongoDBConnection";

const mongoDBURI = process.env.MONGODB_URI as string;

beforeAll(async () => {
  await mongoDBConnection(mongoDBURI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API Integration Tests", () => {
  let userId: string;

  it("should create a new user", async () => {
    const response = await request(app).post("/users").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      birthdate: "1990-01-01",
      location: "New York",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("userId");
    userId = response.body.user.userId;
  });

  it("should edit the user", async () => {
    const response = await request(app).put(`/users/${userId}`).send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      birthdate: "1990-01-01",
      location: "New York",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("firstName", "Jane");
    expect(response.body).toHaveProperty("email", "jane.doe@example.com");
  });

  it("should delete the user", async () => {
    const response = await request(app).delete(`/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "User deleted successfully"
    );
  });
});
