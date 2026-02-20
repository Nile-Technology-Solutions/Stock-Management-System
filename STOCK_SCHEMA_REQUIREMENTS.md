# Stock Module - Database Schema Requirements

**From:** BE4 (Stock Module Developer)  
**To:** BE1 (Database Developer)  
**Date:** February 12, 2026

## Required Stock Table Schema

Based on the OpenAPI specification, please create the Stock table with the following columns:

### Table Name: `Stock`

| Column Name   | Data Type      | Constraints                    | Description                          |
|---------------|----------------|--------------------------------|--------------------------------------|
| id            | Integer        | PRIMARY KEY, AUTO_INCREMENT    | Unique identifier                    |
| name          | String         | NOT NULL                       | Stock material name                  |
| quantity      | Integer        | NOT NULL, DEFAULT 0            | Available quantity                   |
| color         | String         | NOT NULL                       | Material color                       |
| size          | String         | NOT NULL                       | Material dimensions                  |
| thickness     | String         | NOT NULL                       | Material thickness                   |
| laminated     | Boolean        | NOT NULL, DEFAULT false        | Whether material is laminated        |
| origin        | String         | NOT NULL                       | "Local" or "Imported"                |
| typeNote      | String         | NULLABLE                       | Additional notes about material type |
| createdAt     | DateTime       | DEFAULT NOW()                  | Record creation timestamp            |
| updatedAt     | DateTime       | DEFAULT NOW(), ON UPDATE NOW() | Last update timestamp                |

## Prisma Schema Example

```prisma
model Stock {
  id          Int      @id @default(autoincrement())
  name        String
  quantity    Int      @default(0)
  color       String
  size        String
  thickness   String
  laminated   Boolean  @default(false)
  origin      String   // "Local" or "Imported"
  typeNote    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Sample Data for Testing

```json
{
  "name": "Laminated MDF Board",
  "quantity": 50,
  "color": "Dark Oak",
  "size": "1220mm x 2440mm",
  "thickness": "18mm",
  "laminated": true,
  "origin": "Imported",
  "typeNote": "High-density water resistant"
}
```

## Questions for BE1:

1. ✅ Is the schema above correct?
2. ✅ When will the database migration be ready?
3. ✅ Should I use `prisma.stock` to access the table?
4. ✅ Any additional indexes needed for performance?

## My Progress (BE4):

- ✅ All 5 CRUD endpoints implemented
- ✅ Validation functions ready
- ✅ Routes configured with auth middleware
- ✅ Mock controller ready for testing
- ⏳ Waiting for database schema to test with real data

## Reference:
See OpenAPI specification section: `components.schemas.StockMaterial`
