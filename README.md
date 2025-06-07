# 🚀 GraphQL Backend with Prisma, Zod, and Modular Services

A robust and modular GraphQL backend built with **Prisma**, **Zod**, **TypeScript**, and **class-based services**. Follows clean architecture principles for scalability and maintainability.

## 🧠 Core Concepts

- **Handlers**: GraphQL resolvers split by domain (`comment`, `post`, `user`). Each domain has separate query and mutation handlers.
- **Services**: Encapsulate business logic and communicate with the database via Prisma.
- **Schemas**: `.graphql` SDL files defining typeDefs, modular by domain.
- **Resolvers**: Centralized mapping of GraphQL resolvers.
- **Tools**: Utilities for Zod validation, JWT, and context injection.
- **Helpers**: Reusable functions like auth logic and custom error formatting.
- **Lib**: Shared logic and Prisma client setup.
- **Middleware**: Custom middleware logic for the application.

---

## 🧰 Tech Stack

| Tool/Library     | Purpose                                |
|------------------|-----------------------------------------|
| **GraphQL**      | API schema and query language           |
| **Prisma**       | ORM for PostgreSQL                      |
| **Zod**          | Schema-based input validation           |
| **TypeScript**   | Strong typing and code safety           |
| **JWT**          | Authentication via JSON Web Tokens      |
| **Docker**       | Containerization for local development  |

---

## ✅ Best Practices

- Keep **resolvers** lean; delegate logic to services.
- Use **Zod** for request validation before processing.
- Return typed responses using `GraphQL Codegen`.
- Handle errors with clear, descriptive custom messages.
- Centralize all Prisma queries in **service** classes.

---

## 🚧 Suggestions for Improvement

- Add unit tests using Jest or Vitest.
- Introduce Redis for caching popular queries.
- Add rate limiting middleware.
- Setup CI/CD for auto deployments.

---

## 📜 License

MIT

---

> Built with ❤️ by [Bapparaj Sk](https://github.com/Bapparajsk)
