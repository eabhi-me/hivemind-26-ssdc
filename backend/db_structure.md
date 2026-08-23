# HiveMind 2026 Database Structure

This document outlines the current MongoDB collections and their data structures (schemas) used by the HiveMind 2026 backend. Since PyMongo is used without an ORM, these represent the dictionaries stored in the database.

## 1. `users` Collection
Stores the profile information of registered participants.

```json
{
  "_id": "ObjectId()",
  "name": "string",
  "regNo": "string (Indexed)",
  "emailId": "string (Unique Index)",
  "collegeEmailId": "string",
  "phoneNumber": "string (Indexed)",
  "college": "string",
  "trade": "string",
  "degree": "string",
  "batchYear": "string",
  "createdAt": "string (ISO 8601 Datetime)"
}
```

## 2. `registrations` Collection
Maps a user to a specific event they registered for.

```json
{
  "_id": "ObjectId()",
  "userId": "ObjectId() (Indexed, references users._id)",
  "eventId": "string (e.g., 'bad-ui')",
  "selectedEvent": "string (e.g., 'EVENT_01 — BAD UI')",
  "submissionId": "string (Unique Index, e.g., 'HM26-123456')",
  "status": "string (e.g., 'PENDING')",
  "createdAt": "string (ISO 8601 Datetime)",
  "updatedAt": "string (ISO 8601 Datetime)"
}
```

## 3. `events` Collection
Stores the details of events/challenges. (Seed data typically originates from `database.py`).

```json
{
  "_id": "ObjectId()",
  "id": "string (e.g., 'bad-ui')",
  "number": "string (e.g., 'EVENT_01')",
  "title": "string (e.g., 'BAD UI')",
  "description": "string",
  "startDate": "string (e.g., '06 NOV, 2026')",
  "endDate": "string",
  "isoStartDate": "string (ISO 8601 Datetime)",
  "isoEndDate": "string (ISO 8601 Datetime)",
  "location": "string",
  "capacity": "integer",
  "isOnline": "boolean",
  "registrationOpen": "boolean",
  "isFeatured": "boolean"
}
```

## 4. `admin_users` Collection
Stores the credentials for the Organizer Admin portal.

```json
{
  "_id": "ObjectId()",
  "username": "string (Unique Index)",
  "password": "string",
  "role": "string (e.g., 'admin')",
  "updatedAt": "string (ISO 8601 Datetime)"
}
```

## 5. `results` Collection
Stores event results (Leaderboards/Winners).

```json
{
  "_id": "ObjectId()",
  "eventId": "string (Unique Index, references events.id)",
  // Additional dynamic fields for winners/results
}
```
