import app from "../../../app.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import request from "supertest";
import User from "../../../models/User.js";
import { users } from "../../../seeds/seedHelpers";

describe("POST /login", () => {
  beforeEach(async () => {
    // clear all the documents in the model
    await User.deleteMany({});
    // add a random user into the database
    await request(app).post("/api/user/signup").send(users[0]);
  });

  describe("given a non-existing email", () => {
    test("should not be able to find any user with the email", async () => {
      const user = await User.findOne({ email: `invalid${users[0].email}` });
      expect(user).toBeNull();
    });

    test("should respond wth a 404 status code", async () => {
      const res = await request(app)
        .post("/api/user/login")
        .send({
          email: `invalid${users[0].email}`,
          password: users[0].password,
        });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("given an existing email with an incorrect password", () => {
    test("should find a user with the email", async () => {
      const user = await User.findOne({ email: users[0].email });
      expect(user).toBeTruthy();
    });

    test("should fail the comparison with the hashed password", async () => {
      const user = await User.findOne({ email: users[0].email });
      const isPasswordCorrect = await bcrypt.compare(
        `wrong${users[0].password}`,
        user.password
      );
      expect(isPasswordCorrect).toBe(false);
    });

    test("should respond wth a 400 status code", async () => {
      const res = await request(app)
        .post("/api/user/login")
        .send({
          email: users[0].email,
          password: `wrong${users[0].password}`,
        });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("given an existing email with the correct password", () => {
    test("should find a user with the email", async () => {
      const user = await User.findOne({ email: users[0].email });
      expect(user).toBeTruthy();
    });

    test("should pass the comparison with the hashed password", async () => {
      const user = await User.findOne({ email: users[0].email });
      const isPasswordCorrect = await bcrypt.compare(
        users[0].password,
        user.password
      );
      expect(isPasswordCorrect).toBe(true);
    });

    test("should respond wth a 200 status code", async () => {
      const res = await request(app).post("/api/user/login").send({
        email: users[0].email,
        password: users[0].password,
      });
      expect(res.statusCode).toBe(200);
    });

    test("should respond wth a JWT token", async () => {
      const res = await request(app).post("/api/user/login").send({
        email: users[0].email,
        password: users[0].password,
      });
      expect(res.body.token).toBeTruthy();
    });
  });
});

describe("POST /signup", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("given an existing email", () => {
    beforeEach(async () => {
      await request(app).post("/api/user/signup").send(users[1]);
    });

    test("should find that user with the email already exists", async () => {
      const user = await User.findOne({ email: users[1].email });
      expect(user).toBeTruthy();
    });

    test("should respond with a 400 status code", async () => {
      const res = await request(app).post("/api/user/signup").send(users[1]);
      expect(res.statusCode).toBe(400);
    });
  });

  describe("given a non-existing email", () => {
    test("should not be able to find any user with the email", async () => {
      const user = await User.findOne({ email: users[1].email });
      expect(user).toBeNull();
    });

    test("should respond wth a 201 status code", async () => {
      const res = await request(app).post("/api/user/signup").send(users[1]);
      expect(res.statusCode).toBe(201);
    });

    test("should respond wth a JWT token", async () => {
      const res = await request(app).post("/api/user/signup").send(users[1]);
      expect(res.body.token).toBeTruthy();
    });
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
