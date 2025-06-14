I understand the original deadline for this technical test was yesterday. However, as you can see from the commit history, this has not been a one-day effort. I wanted to deliver a test that truly reflects my technical capabilities. If permitted, I will be uploading the missing unit tests over the weekend. Thank you for your understanding, and I apologize for the delay.

Neo RPG – RPG Battle

This proyect is built using Clean Architecture and Domain-Driven Design (DDD) principles. This project was developed as a technical test to demonstrate the ability to structure scalable, maintainable, and testable software with a strong architectural foundation.

Architectural Approach

The system was designed to ensure clear separation of concerns, extensibility, and testability from the start. Clean Architecture was chosen because:
• It fully decouples layers, allowing each one to evolve independently.
• It enables isolated unit and integration testing.
• It allows technology changes (e.g., database, UI) without modifying business logic.
• It promotes good practices such as dependency inversion, interface-based design, and encapsulation of domain knowledge.

All business logic is completely isolated from external frameworks and infrastructure concerns.

Project Structure

src/
├── application/ # Use cases and application logic
│ ├── cases/ # Orchestrated logic per context
│ ├── dto/ # Data transfer objects
│ └── services/ # Application-level services
├── domain/ # Business core
│ ├── entities/ # Pure domain entities
│ ├── logic/ # Business rules and validation
│ ├── models/ # Structural domain types
│ └── services/ # Reusable domain services
├── infrastructure/ # Technical adapters
│ └── repositories/ # Concrete implementation of data storage
├── presentation/ # Input/output interface
│ ├── middlewares/ # Input validation
│ └── router/ # HTTP route definitions
└── shared/ # Shared components
├── constants/
├── enums/
├── types/
└── utilities/

Persistence Layer and Extensibility

The current system uses an in-memory data structure to store characters and battles. The data layout follows a partitioned key pattern similar to strategies used in NoSQL databases like DynamoDB, enabling efficient access and logical grouping of records.

Thanks to the use of interfaces and dependency inversion, the system is fully prepared to switch to a real database such as DynamoDB, PostgreSQL, or MongoDB without changing any business logic or application workflows.

Switching Database Providers

Changing the storage engine requires only: 1. Implementing a new repository class that fulfills the existing domain interface. 2. Registering it in the infrastructure layer. 3. Injecting the implementation where required.

No modifications are needed in the business or application layers.

Available Commands

npm run build # Compile TypeScript
npm run watch # Compile on file changes
npm run test # Run unit tests
npx cdk synth # Generate CloudFormation template
npx cdk deploy # Deploy to AWS (optional)

Main Technologies
• TypeScript
• Clean Architecture
• Domain-Driven Design
• AWS CDK
• In-memory data store with composite key pattern
